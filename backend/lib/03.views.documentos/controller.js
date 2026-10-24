'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const domain = require('../domain');
const view = require('../view');
const view_to_form = require('../view_to_form');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

module.exports = {
  coleccion: async function (req, res) {
    try {
      const parseResult = validator.coleccion.safeParse(req.params);

      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const host = domain.getParentDomain(req.headers.host);

      const respuesta = await service.coleccion({
        ...parseResult.data,
        host: host,
      });

      const hasForm = await view_to_form(parseResult.data.name, host);

      res.render('database/02.registros/collection/_', {
        roles: req.user ? req.user.roles : [],
        object: respuesta,
        hasForm,
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
      const parseResult = validator.formulario.safeParse(req.params);

      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const host = domain.getParentDomain(req.headers.host);

      const respuesta = await service.formulario({
        ...parseResult.data,
        host: host,
      });

      const hasForm = await view_to_form(parseResult.data.name, host);

      let viewToRender = 'database/02.registros/form/_';
      if (req.query.type === 'html' && hasForm) {
        viewToRender = await view('database/03.cms/' + parseResult.data.name + '/_', host);
      }

      res.render(viewToRender, {
        roles: req.user ? req.user.roles : [],
        object: respuesta,
        registro: {},
        hasForm,
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
      const parseResult = validator.documento.safeParse(req.params);

      if (!parseResult.success) {
        response.renderError(req, res, constants.error.validacion);
        return;
      }

      const host = domain.getParentDomain(req.headers.host);

      const respuesta = await service.documento({
        ...parseResult.data,
        host: host,
      });

      const hasForm = await view_to_form(parseResult.data.name, host);

      let viewToRender = 'database/02.registros/form/_';
      if (req.query.type === 'html' && hasForm) {
        viewToRender = await view('database/03.cms/' + parseResult.data.name + '/_', host);
      }

      res.render(viewToRender, {
        roles: req.user ? req.user.roles : [],
        object: respuesta.objeto,
        registro: respuesta.registro,
        hasForm,
        __host: host,
        __hostAccount: domain.getHostAccount(req),
        __hostArchivosPublicos: domain.getHostArchivosPublicos(req),
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
