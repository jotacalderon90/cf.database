'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.total = 'Error al obtener total de documentos';
_constants.error.rest.collection = 'Error al obtener colección';
_constants.error.rest.tags = 'Error al obtener tags';

module.exports = _constants;
