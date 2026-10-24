'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.create = 'Error al crear documento';
_constants.error.rest.read = 'Error al leer documento';
_constants.error.rest.update = 'Error al actualizar documento';
_constants.error.rest.delete = 'Error al eliminar documento';
_constants.error.rest.upload = 'Error al subir archivo';

_constants.error.rest.servicio_archivosprivados = 'Error al integrarse a servicio de Archivos Privados';

module.exports = _constants;
