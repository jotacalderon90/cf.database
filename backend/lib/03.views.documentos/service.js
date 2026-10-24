'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const repository = require('../_repository/_');

module.exports = {
  coleccion: async function (input) {
    try {
      const objeto = await repository.getObjeto(input.name, input.host);

      return objeto;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.coleccion + ' ' + constants.error.servicio
      );
    }
  },

  formulario: async function (input) {
    try {
      const objeto = await repository.getObjeto(input.name, input.host);

      return objeto;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.formulario + ' ' + constants.error.servicio
      );
    }
  },

  documento: async function (input) {
    try {
      const objeto = await repository.getObjeto(input.name, input.host);

      const documento = await repository.read(input.name, input.id);

      return {
        objeto: objeto,
        registro: documento,
      };
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.documento + ' ' + constants.error.servicio
      );
    }
  },
};
