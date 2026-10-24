'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  total: async function (req, res) {
    try {
      const parseResult = validator.total.safeParse({ ...req.params, ...req.query });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.total({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.total + ' ' + constants.error.controlador);
    }
  },

  collection: async function (req, res) {
    try {
      const parseResult = validator.collection.safeParse({ ...req.params, ...req.query });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.collection({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(
        req,
        res,
        constants.error.rest.collection + ' ' + constants.error.controlador
      );
    }
  },

  tags: async function (req, res) {
    try {
      const parseResult = validator.tags.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.tags({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.tags + ' ' + constants.error.controlador);
    }
  },
};
