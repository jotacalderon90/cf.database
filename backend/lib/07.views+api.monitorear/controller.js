'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  monitorear: async function (req, res) {
    try {
      res.render('database/monitorear/_', {
        roles: req.user ? req.user.roles : [],
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.monitorear + ' ' + constants.error.controlador
      );
    }
  },

  api: async function (req, res) {
    try {
      const parseResult = validator.api.safeParse(req.query);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.api({
        ...parseResult.data,
        host: req.headers.host,
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.api + ' ' + constants.error.controlador);
    }
  },
};
