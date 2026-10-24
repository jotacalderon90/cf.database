'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.coleccion = 'Error al generar pagina de documentos';
_constants.error.rest.formulario = 'Error al generar pagina para nuevo documento';
_constants.error.rest.documento = 'Error al generar pagina para editar documento';

module.exports = _constants;
