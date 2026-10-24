const registros = function(){
	this.object = object;
	this.registro = registro;
	this.services = createServices('api/document/' + this.object.name);
}

registros.prototype.start = async function(parent) {
	
	this.parent = parent;
	
	await wait(1000);
	
	if(this.registro.id){
		this.title = 'Registro ' + this.registro.id;
		this.content = JSON.stringify(this.registro, undefined, "\t");
    this.uriForm = '/objetos/' + this.object.name + '/' + this.registro.id + '?type=html';
	}else{
		this.title = 'Nuevo registro';
		this.content = JSON.stringify(this.object.schema || {}, undefined, "\t");
    this.uriForm = '/objetos/' + this.object.name + '/' + 'form' + '?type=html';
	}
}

registros.prototype.getURLCollection = function(){
	return '/objetos/' + this.object.name;
}

registros.prototype.getURLEdit = function(row){
	return '/objetos/' + this.object.name + '/' + row.id;
}

registros.prototype.isCreateMode = function(){
	return (this.registro.id)?false:true;
}

registros.prototype.create = async function() {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirme creación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		const doc = JSON.parse(this.content.split("\n").join(""));
		this.parent.loader.active = true;
		const create = await this.services.create({
			object: this.object.name
		}, doc);
    this.parent.loader.active = false;
		if (create.error) {
			throw new Error(create.error);
		}
		location.href = this.getURLEdit({id: create.data});
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

registros.prototype.update = async function() {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirme actualización del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		const d = JSON.parse(this.content);

		d['$$hashKey'] = undefined;
		d['_class'] = undefined;

		this.parent.loader.active = true;

		const update = await this.services.update({
			object: this.object.name,
			id: this.registro.id
		}, d);
		
    this.parent.loader.active = false;
    
		if (update.error) {
			throw new Error(update.error);
		}
		location.reload();

	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error,'error');
		console.error(error);
	}
}

registros.prototype.delete = async function() {
	try {
		
    const confirmar = await this.parent.modal.confirm('Confirme eliminación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const sDelete = await this.services.delete({
			object: this.object.name,
			id: this.registro.id
		});
    this.parent.loader.active = false;
		if (sDelete.error) {
			throw new Error(sDelete.error);
		}
		location.href = this.getURLCollection();
	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error , 'error');
		console.error(error);
	}
}

app.modules.registros = registros;