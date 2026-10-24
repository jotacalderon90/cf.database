const objetos = function(){
	this.services = createServices('api/document/object');
	this.services.collection = createService('GET', 'api/document/object/collection?skip=:skip');
	this.services.getsyncserver = createService('GET', '/api/sync-server');
	this.services.putsyncserver = createService('PUT', '/api/sync-server');
	this.collection = [];
}

objetos.prototype.start = async function(parent) {
	this.parent = parent;
	await wait(1000);
	const d = await this.services.collection({skip: 0});
	if (d.error) {
		throw (d.error);
	}
	this.collection = sortArrayByField(d.data, 'label');
}

objetos.prototype.getURLCollection = function(row){
	return '/objetos/' + row.name;
}

objetos.prototype.exist = function(object){
	return this.collection.filter((r)=>{return r.name==object}).length == 1;
}

objetos.prototype.create = async function(objeto) {
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

objetos.prototype.createRole = function(){
	this.create({
    "label": "Roles",
    "name": "roles",
    "schema": {
      "descripcion": "",
      "nombre": ""
    }
  });
}

objetos.prototype.createUser = function(){
	this.create({
    "label": "Usuarios",
    "name": "user",
    "projection": {
      "email": 1,
      "roles": 1
    },
    "schema": {
      "email": "",
      "password": ""
    },
    "sort": {
      "email": 1
    }
  });
}

objetos.prototype.createBlog = function() {
  this.create({
    "label": "Blog",
    "name": "blog",
    "projection": {
      "created": 1,
      "host": 1,
      "tag_main": 1,
      "title": 1
    },
    "schema": {
      "title": "",
      "uri": "",
      "resume": "",
      "content": "",
      "img": "",
      "tag": [],
      "tag_main": "",
      "thumb": "",
      "active": true,
      "created": "",
      "host": "",
      "domain": "",
      "author": ""
    },
    "sort": {
      "created": -1
    },
    "static": [
      "author",
      "created"
    ]
  });
}

objetos.prototype.createEcommerce = function() {
  this.create({
    "label": "Ecommerce",
    "name": "ecommerce",
    "projection": {
      "host": 1,
      "title": 1
    },
    "schema": {
      "title": "",
      "uri": "",
      "resume": "",
      "content": "",
      "img": "",
      "tag": [],
      "tag_main": "",
      "thumb": "",
      "price": 0,
      "active": true,
      "created": "",
      "host": "",
      "domain": "",
      "author": ""
    },
    "sort": {
      "created": -1
    },
    "static": [
      "author",
      "created"
    ]
  });
}

objetos.prototype.createCart = function() {
  this.create({
    "label": "Carro de solicitud",
    "name": "cart",
    "projection": {
      "type": 1,
      "buyOrder": 1,
      "sessionId": 1,
      "created": 1,
      "to": 1,
      "total": 1
    },
    "schema": {
      "host": "",
      "domain": "",
      "created": "",
      "to": "",
      "message": "",
      "product": [],
      "total": "",
      "type": "",
      "sessionId": "",
      "buyOrder": ""
    },
    "sort": {
      "created": -1
    }
  });
}

objetos.prototype.createMailing = function() {
  this.create({
    "label": "Correos Generados",
    "name": "mailing",
    "projection": {
      "created": 1,
      "to": 1,
      "subject": 1,
      "sended": 1,
      "view": 1
    },
    "schema": {
      "to": "",
      "subject": "",
      "html": "",
      "hash": "",
      "origin": "",
      "host": "",
      "created": "",
      "created_display": "",
      "sended": "",
      "view": "",
      "config": {}
    },
    "sort": {
      "created": -1
    }
  });
}

objetos.prototype.createMailingSeen = function() {
  this.create({
    "label": "Correos Vistos",
    "name": "mailing_seen",
    "schema": {
      "created": "",
      "host": "",
      "headers": {},
      "request": {}
    },
    "sort": {
      "created": -1
    }
  });
}

objetos.prototype.refreshFromServer = async function() {
  try {
		this.parent.loader.active = true;
		const getsyncserver = await this.services.getsyncserver();
    this.parent.loader.active = false;
    console.log(getsyncserver);
	} catch (error) {
    this.parent.loader.active = false;
		await this.parent.modal.notify(error, 'error');
		console.error(error);
	}
}

objetos.prototype.export = async function() {
  const confirmar = await this.parent.modal.confirm('Confirme descarga de toda la base de datos\nEsta acción será limitada proximamente');
  if(!confirmar) {
    return;
  }
  for(let i = 0 ; i < this.collection.length ; i++) {
    window.open('/api/document/' + this.collection[i].name + '/export');
  }
  await this.parent.modal.notify('Revise carpeta de descargas');
}

app.modules.objetos = objetos;