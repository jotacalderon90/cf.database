const fileToB64 = function(file) {
  return new Promise(function(resolve, reject) {
    try {
      const reader = new FileReader();
      reader.fileName = file.name
      reader.readAsDataURL(file);
      reader.onload = function() {
        resolve(reader.result); //.split(',')[1]
      };
      reader.onerror = function(error) {
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  });
}

const registroEcommerce = function() {
  this.object = object;
	this.registro = registro;
	this.services = createServices('api/document/' + this.object.name);
  this.services.tag = createService('GET','api/document/' + this.object.name + '/tags');
  this.services.uploadImage = createService('POST','/api/document/' + this.object.name + '/:id/img/base64');
}

registroEcommerce.prototype.start = async function(parent) {
  this.parent = parent;
  
  if (!this.registro.id) {
    this.registro = {
      title: '',
      tag: [],
      img: null,
      domain: this.object.name
    };
  }

  this.action = (this.registro.id) ? 'edit' : 'new';

  $('#input_content').summernote({
    height: 300, // Altura del editor
    minHeight: null, // Altura mínima
    maxHeight: null, // Altura máxima
    focus: true, // Enfoque automático
    lang: 'es-ES', // Idioma español
    placeholder: 'Escribe aquí...',
    toolbar: [
      ['style', ['style']],
      ['font', ['bold', 'underline', 'clear']],
      ['color', ['color']],
      ['para', ['ul', 'ol', 'paragraph']],
      ['table', ['table']],
      ['insert', ['link', 'picture']],
      ['view', ['fullscreen', 'codeview', 'help']]
    ],
    callbacks: {
      onInit: function() {

      },
      onKeydown: function(e) {

      },
      onKeyup: function(e) {

      }
    }
  });

  $('#input_content').summernote('code', (this.isCreateMode()) ? '' : this.registro.content);
  
  if (!this.isCreateMode()) {
    this.refreshIMG();
    //$('form').attr('action', '/api/cms/' + this.name + '/' + ((this.registro) ? this.registro.id : '') + '/image?domain=' + this.domain);
  }

  await this.getTags();
  
}

registroEcommerce.prototype.updateUrl = function() {
  if(this.registro.uri && this.registro.uri.trim() != '') {
    return;
  }
  const cleaner = function(cadena){
    const specialChars = "!@#$^&%*()+=-[]\/{}|:<>?,.`";
    for (var i = 0; i < specialChars.length; i++) {
      cadena= cadena.replace(new RegExp("\\" + specialChars[i], 'gi'), '');
    }
    cadena = cadena.toLowerCase();
    cadena = cadena.replace(/ /g,"-");
    cadena = cadena.replace(/á/gi,"a");
    cadena = cadena.replace(/é/gi,"e");
    cadena = cadena.replace(/í/gi,"i");
    cadena = cadena.replace(/ó/gi,"o");
    cadena = cadena.replace(/ú/gi,"u");
    cadena = cadena.replace(/ñ/gi,"n");
    return cadena;
  }
  this.registro.uri = cleaner(this.registro.title);
}

registroEcommerce.prototype.isCreateMode = function() {
  return (this.action == "new") ? true : false;
}

registroEcommerce.prototype.isEditMode = function() {
  return (this.action == "edit") ? true : false;
}

registroEcommerce.prototype.getImg = function() {
  return __hostArchivosPublicos + '/assets/img/' + this.object.name + '/' + this.registro.domain + '.' + __host + '/' + this.registro.id + '.jpg?r=' + Math.random();
}

registroEcommerce.prototype.refreshIMG = function() {
  document.getElementById('dataImage').setAttribute('src', this.getImg());
}

registroEcommerce.prototype.addTag = function(event) {
  if (event.which === 13) {
    if (this.registro.tag.indexOf(this.registro.tagbk) == -1) {
      this.registro.tag.push(this.registro.tagbk);
      this.registro.tagbk = "";
    }
  }
}

registroEcommerce.prototype.removeTag = function(i) {
  this.registro.tag.splice(i, 1);
}

registroEcommerce.prototype.getTags = async function() {
  try {
    const tag = await this.services.tag({
      domain: this.domain
    });
    if (tag.error) {
      throw (tag.error);
    }
    this.tag = tag.data.map((r) => {
      return {
        label: r
      }
    });
    this.refreshAutocomplete();
  } catch (error) {
    await this.parent.modal.notify(error,'error');
    console.error(error);
  }
}

registroEcommerce.prototype.refreshAutocomplete = function() {
  $('#input_tag').autocomplete({
    source: this.tag,
    select: (event, ui) => {
      this.registro.tagbk = ui.item.value;
    }
  });
}

registroEcommerce.prototype.formatToServer = function(doc) {
  delete doc.datefromnow;
  delete doc.datetitle;
  delete doc.tagbk;
  delete doc.relation;
  doc.content = $('#input_content').summernote('code'); //CKEDITOR.instances["input_content"].getData();
  return doc;
}

registroEcommerce.prototype.create = async function() {
  try {
    
    const confirmar = await this.parent.modal.confirm('Confirme creación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
    this.parent.loader.active = true;
    const d = await this.services.create({}, this.formatToServer(this.registro));
    this.parent.loader.active = false;
    if (d.error) {
      throw new Error(d.error);
    }
    location.href = '/objetos/' + this.object.name + '/' + d.data + '?type=html';
    
  } catch (error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error,'error');
    console.error(error);
  }
}

registroEcommerce.prototype.update = async function() {
  try {
    
    const confirmar = await this.parent.modal.confirm('Confirme actualización del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
    this.parent.loader.active = true;
    const d = await this.services.update({
      id: this.registro.id
    }, this.formatToServer(this.registro));
    this.parent.loader.active = false;
    if (d.error) {
      throw new Error(d.error);
    }
    location.reload();
  } catch (error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error,'error');
    console.error(error);
  }
}

registroEcommerce.prototype.delete = async function() {
  try {
    
    const confirmar = await this.parent.modal.confirm('Confirme eliminación del documento', 'Cancelar', 'Aceptar');
    if(!confirmar) {
      return;
    }
    
    this.parent.loader.active = true;
    const d = await this.services.delete({
      id: this.registro.id
    });
    this.parent.loader.active = false;
    if (d.error) {
      throw new Error(d.error);
    }
    location.href = '/objetos/' + this.object.name;
  } catch (error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error, 'error');
    console.error(error);
  }
}

registroEcommerce.prototype.changeIMG = async function(event) {
  try {

    //audio/mpeg
    //application/x-zip-compressed
    //video/avi
    //application/pdf

    const files = $(event.currentTarget).prop('files');

    if (files.length != 1) {
      throw ('Seleccione un archivo');
    }

    const file = files[0];

    if (['image/png', 'image/jpeg'].indexOf(file.type) == -1) {
      throw ('Seleccione una imagen');
    }

    this.parent.loader.active = true;

    const result = await this.services.uploadImage({
      id: this.registro.id
    }, {
      base64: await fileToB64(file)
    });

    this.parent.loader.active = false;
    
    if (result.error) {
      throw (result.error);
    }

    this.refreshIMG();

  } catch (error) {
    this.parent.loader.active = false;
    await this.parent.modal.notify(error,'error');
    console.error(error);
  }

}

app.modules.registroEcommerce = registroEcommerce;