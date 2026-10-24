'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('../constants');

module.exports = {
  getObjeto: async function (name, host) {
    try {
      logger.info(name);
      logger.info(host);
    } catch (error) {
      logger.error(error);
      throw new Error('error al obtener objeto' + ' ' + constants.error.repositorio);
    }
  },

  total: async function (name, query, options) {
    try {
      logger.info(name);
      logger.info(query);
      logger.info(options);
    } catch (error) {
      logger.error(error);
      throw new Error('error al contar documentos' + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (name, query, options) {
    try {
      logger.info(name);
      logger.info(query);
      logger.info(options);
    } catch (error) {
      logger.error(error);
      throw new Error('error al obtener documentos' + ' ' + constants.error.repositorio);
    }
  },

  create: async function (name, document) {
    try {
      logger.info(name);
      logger.info(document);
    } catch (error) {
      logger.error(error);
      throw new Error('error al insertar documento' + ' ' + constants.error.repositorio);
    }
  },

  read: async function (name, id) {
    try {
      logger.info(name);
      logger.info(id);
    } catch (error) {
      logger.error(error);
      throw new Error('error al leer documento' + ' ' + constants.error.repositorio);
    }
  },

  update: async function (name, id, set) {
    try {
      logger.info(name);
      logger.info(id);
      logger.info(set);
    } catch (error) {
      logger.error(error);
      throw new Error('error al leer documento' + ' ' + constants.error.repositorio);
    }
  },

  delete: async function (name, id) {
    try {
      logger.info(name);
      logger.info(id);
    } catch (error) {
      logger.error(error);
      throw new Error('error al eliminar documento' + ' ' + constants.error.repositorio);
    }
  },

  drop: async function (name, host) {
    try {
      logger.info(name);
      logger.info(host);
    } catch (error) {
      logger.error(error);
      throw new Error('error al eliminar colección' + ' ' + constants.error.repositorio);
    }
  },

  monitor: async function () {
    try {
    } catch (error) {
      logger.error(error);
      throw new Error(
        'error al obtener información para monitor' + ' ' + constants.error.repositorio
      );
    }
  },
};
