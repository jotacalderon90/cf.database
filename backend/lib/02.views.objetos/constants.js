'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.coleccion = 'Error al generar pagina de objetos';
_constants.error.rest.formulario = 'Error al generar pagina para nuevo objeto';
_constants.error.rest.documento = 'Error al generar pagina para editar objeto';

module.exports = _constants;
