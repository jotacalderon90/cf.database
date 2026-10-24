'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.monitorear = 'Error al generar pagina para monitorear';
_constants.error.rest.api = 'Error al obtener registros para monitorear';

module.exports = _constants;
