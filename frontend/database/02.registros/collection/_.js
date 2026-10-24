const registros = function(){
	
  this.object = object;
	this.services = createServices('api/document/' + this.object.name);
  
	this.services.total = createService('GET', '/api/document/' + this.object.name + '/total');
	this.services.collection = createService('GET', '/api/document/' + this.object.name + '/collection?skip=:skip&sort_field=:sort_field&sort_type=:sort_type');
	this.services.import = createService('POST', '/api/document/' + this.object.name + '/import');
	
	this.total = 0;
  this.obtained = 0;
  
  this.collection = [];
  
  this.sort = {
    field: '',
    type: 1
  }
}

registros.prototype.start = async function(parent) {
	
	this.parent = parent;
	
	await wait(1000);
	
	const total = await this.services.total();
	if(total.error){
		throw new Error(total.error);
	}
	this.total = total.data;
	await this.loadRegistros();
}

registros.prototype.getURLObject = function(){
	return '/objetos/' + this.object.name + '/edit';
}

registros.prototype.getURLNew = function(){
	return '/objetos/' + this.object.name + '/form';
}

registros.prototype.getURLEdit = function(row, type){
	return '/objetos/' + this.object.name + '/' + row.id + '?type=' + type;
}

registros.prototype.loadRegistros = async function() {
	try {
		this.parent.loader.active = true;

		const collection = await this.services.collection({
			//query: JSON.stringify({}),
			//options: JSON.stringify(this.getOptions()),
      skip: this.obtained,
      sort_field: this.sort.field,
      sort_type: this.sort.type
		});
    this.parent.loader.active = false;
		if (collection.error) {
			throw new Error(collection.error);
		}

		this.collection = this.collection.concat(collection.data);
		this.obtained = this.collection.length;

	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

registros.prototype.getOptions = function() {
	const o = {
		skip: this.obtained,
		limit: 50
	};
	if (this.object.projection) {
		o.projection = this.object.projection;
	}
	if (this.object.sort) {
		o.sort = this.object.sort;
	}
	return o;
}

registros.prototype.getFields = function(){
	const f = [];
	if(this.object){
		const h = (this.object.projection || this.object.schema);
		for(attr in h){
			f.push(attr);
		}
	}
	return f;
}

registros.prototype.sortedBy = function(attr) {
  this.sort = {
    field: attr,
    type: this.sort.type * -1
  }
  this.obtained = 0;
  this.collection = [];
  this.loadRegistros();
}

registros.prototype.selectRegistro = function(registro) {
  if(registro.isSelected){
    registro.isSelected = false;
    registro._class = '';
  }else{
    registro.isSelected = true;
    registro._class = 'table-warning';
  }
}
registros.prototype.getSelectedRegistros = function() {
  return this.collection.filter((r)=>{
    return r.isSelected;
  })
}

registros.prototype.deleteRegistros = async function() {
	try {
    
    const selected = this.getSelectedRegistros();
    
    const confirmar = await this.parent.modal.confirm('Confirme eliminación de ' + selected.length + ' registros', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		for (let i = 0; i < selected.length; i++) {
			const response = await this.services.delete({
				object: this.object.name,
				id: selected[i].id
			});
			if (response.error) {
				throw new Error(response.error);
			}
		}
    this.parent.loader.active = false;
		location.reload();
	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

registros.prototype.canMailing = function(){
  if(this.object) {
    if(this.object.schema) {
      return Object.hasOwn(this.object.schema, 'correo') || Object.hasOwn(this.object.schema, 'email') || Object.hasOwn(this.object.schema, 'mailing');
    }
  }
  return false;
}

registros.prototype.mailingRegistros = async function(){
  const emailAttribute = Object.keys(this.collection[0]).find(
    key => typeof this.collection[0][key] === 'string' && 
            this.collection[0][key].includes('@')
  );
  await copyLarge(this.getSelectedRegistros().map((row)=>{return row[emailAttribute]}).join(','));
  await this.parent.modal.notify('Datos copiados');
}

registros.prototype.import = async function() {
	try {
    
    let headers = '';
    
    if(this.importType === 'url') {
      
      const confirmar = await this.parent.modal.confirm('¿Desea ingresar headers?', 'Cancelar', 'Aceptar');
      if(confirmar) {
        headers = await this.parent.modal.prompt('Ingrese headers: ');
      }
    }
    
    const confirmarDropCollection = await this.parent.modal.confirm('¿Desea truncar colección?', 'Cancelar', 'Aceptar');
      
		this.parent.loader.active = true;
  
		const respuesta = await this.services.import({
			object: this.object.name
		}, {
      tipo: this.importType,
			data: (this.importType === 'url') ? this.importUrl : this.importData,
			headers: headers || '',
			dropCollection: confirmarDropCollection
		});
		this.parent.loader.active = false;
    if (respuesta.error) {
			throw new Error(respuesta.error);
		}
    
    location.reload();
		
	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

registros.prototype.export = async function() {
  window.open('/api/document/' + this.object.name + '/export');
  await this.parent.modal.notify('Revise carpeta de descargas');
}

app.modules.registros = registros;