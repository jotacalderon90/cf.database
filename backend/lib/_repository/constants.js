'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.total = 'Error al obtener total';
_constants.error.rest.collection = 'Error al buscar';
_constants.error.rest.tags = 'Error al obtener tags';
_constants.error.rest.create = 'Error al crear';
_constants.error.rest.read = 'Error al leer';
_constants.error.rest.update = 'Error al actualizar';
_constants.error.rest.delete = 'Error al eliminar';

_constants.error.duplicate = 'Error por dato duplicado en la base de datos';

_constants.paginator = 50;

_constants.error.rest.getObjeto = 'Error al obtener objeto';
_constants.error.rest.getObjetoNotFound = 'No se encontro objeto asociado al dominio';
_constants.error.rest.drop = 'Error al truncar colección';
_constants.error.rest.monitor = 'Error al monitorear';

module.exports = _constants;
