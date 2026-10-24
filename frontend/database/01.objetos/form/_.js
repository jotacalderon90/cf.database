const objeto = function(){
	this.services = createServices('api/document/object');
	this.services.collection = createService('GET', 'api/document/object/collection?skip=:skip');
}

objeto.prototype.start = async function(parent) {
	
	this.parent = parent;
	
	await wait(1000);
	const collection = await this.services.collection({skip: 0});
	if (collection.error) {
		throw (collection.error);
	}
	this.collection = sortArrayByField(collection.data, 'label');
	
	if(id!=''){
		const doc = Object.assign({}, this.collection.filter((r)=>{
			return r.name == id;
		})[0]);
		this.doc = doc;
		this.title = 'Objeto ' + (doc.label || doc.name);
		this.content = JSON.stringify(doc, undefined, "\t");
	}else{
		this.title = 'Nuevo objeto';
		this.content = JSON.stringify({}, undefined, "\t");
	}
	
}

objeto.prototype.getURLCollection = function(){
	return '/objetos/' + ((this.doc)?this.doc.name :'');
}

objeto.prototype.isCreateMode = function(){
	return (id=='')?true:false;
}

objeto.prototype.create = async function(objeto) {
	try {
		
    const confirmar = await this.parent.modal.confirm('Confirme creación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		const doc = objeto || JSON.parse(this.content.split("\n").join(""));
		if (!doc.name || doc.name.trim() == "") {
			throw ("Nombre inválido");
		}
		if (this.collection.filter((r) => {
				return r.name.toLowerCase() == doc.name.toLowerCase();
			}).length != 0) {
			throw ("El objeto " + doc.name + " ya existe");
		}
		this.parent.loader.active = true;
		const response = await this.services.create({}, doc);
    this.parent.loader.active = false;
		if (response.error) {
			throw new Error(response.error);
		}
		location.href = '/';
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

objeto.prototype.update = async function() {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirme actualización del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		const doc = JSON.parse(this.content.split("\n").join(""));
		if (!doc.name || doc.name.trim() == "") {
			throw ("Nombre inválido");
		}
		if (this.collection.filter((r) => {
				return r.name.toLowerCase() == doc.name.toLowerCase() && r.id != this.doc.id;
			}).length != 0) {
			throw ("El objeto " + doc.name + " ya existe");
		}
		this.parent.loader.active = true;

		const d = await this.services.update({
			id: this.doc.id
		}, doc);
    this.parent.loader.active = false;
		if (d.error) {
			throw (d.error);
		}
		location.reload();

	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

objeto.prototype.delete = async function() {
	try {
    
    const confirmar = await this.parent.modal.confirm('Confirme eliminación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
		this.parent.loader.active = true;
		const d = await this.services.delete({
			id: this.doc.id
		});
    this.parent.loader.active = false;
		if (d.error) {
			throw (d.error);
		}
		location.href = "/";
	} catch (error) {
		this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

app.modules.objeto = objeto;