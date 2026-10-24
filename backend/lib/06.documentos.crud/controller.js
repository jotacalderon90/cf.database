'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const AppError = require('../error');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

module.exports = {
  create: async function (req, res) {
    try {
      const parseResult = validator.create.safeParse({ ...req.params, ...req.body });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.create({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
        user: {
          id: req.user.id,
          nickname: req.user.nickname,
          thumb: req.user.thumb,
        },
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }

      response.APIError(req, res, constants.error.rest.create + ' ' + constants.error.controlador);
    }
  },

  read: async function (req, res) {
    try {
      const parseResult = validator.read.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.read({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
        user: {
          id: req.user.id,
          nickname: req.user.nickname,
          thumb: req.user.thumb,
        },
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.read + ' ' + constants.error.controlador);
    }
  },

  update: async function (req, res) {
    try {
      const parseResult = validator.update.safeParse({ ...req.params, ...req.body });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.update({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
        user: {
          id: req.user.id,
          nickname: req.user.nickname,
          thumb: req.user.thumb,
        },
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);

      if (error instanceof AppError) {
        res.status(error.statusCode).json({ error: error.message });
        return;
      }

      response.APIError(req, res, constants.error.rest.update + ' ' + constants.error.controlador);
    }
  },

  delete: async function (req, res) {
    try {
      const parseResult = validator.delete.safeParse(req.params);

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.delete({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
        user: {
          id: req.user.id,
          nickname: req.user.nickname,
          thumb: req.user.thumb,
        },
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.delete + ' ' + constants.error.controlador);
    }
  },

  upload: async function (req, res) {
    try {
      
      if(process.env.NODE_ENV !== 'production') {
        response.APIError(req, res, 'Función habilitada solo para producción');
        return;
      }
      
      const parseResult = validator.upload.safeParse({ ...req.params, ...req.body });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.upload({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
        origin: req.headers.origin,
        user: {
          id: req.user.id,
          nickname: req.user.nickname,
          thumb: req.user.thumb,
        },
      });

      res.send({ data: respuesta });
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.upload + ' ' + constants.error.controlador);
    }
  },
};
