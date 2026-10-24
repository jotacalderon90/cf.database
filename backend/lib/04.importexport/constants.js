'use strict';

const constants = require('../constants');

const _constants = structuredClone(constants);

_constants.error.rest.import = 'Error al importar documentos';
_constants.error.rest.import_parser = 'No se pudo parsear la data para importar';
_constants.error.rest.export = 'Error al exportar documentos';

module.exports = _constants;
