'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');

const domain = require('../domain');

module.exports = {
  coleccion: async function (req, res) {
    try {
      res.render('database/01.objetos/collection/_', {
        roles: req.user ? req.user.roles : [],
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.coleccion + ' ' + constants.error.controlador
      );
    }
  },

  formulario: async function (req, res) {
    try {
      res.render('database/01.objetos/form/_', {
        roles: req.user ? req.user.roles : [],
        id: '',
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.formulario + ' ' + constants.error.controlador
      );
    }
  },

  documento: async function (req, res) {
    try {
      res.render('database/01.objetos/form/_', {
        roles: req.user ? req.user.roles : [],
        id: req.params.name,
        __hostAccount: domain.getHostAccount(req),
      });
    } catch (error) {
      logger.error(error);
      response.renderError(
        req,
        res,
        constants.error.rest.documento + ' ' + constants.error.controlador
      );
    }
  },
};
