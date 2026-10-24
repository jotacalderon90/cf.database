'use strict';

const { Readable } = require('stream');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const response = require('cl.jotacalderon.cf.framework/lib/response');

const constants = require('./constants');
const validator = require('./validator');
const service = require('./service');

const domain = require('../domain');

const generateTimestamp = () => {
  const now = new Date();
  return (
    now.getFullYear() +
    String(now.getMonth() + 1).padStart(2, '0') +
    String(now.getDate()).padStart(2, '0') +
    String(now.getHours()).padStart(2, '0') +
    String(now.getMinutes()).padStart(2, '0') +
    String(now.getSeconds()).padStart(2, '0')
  );
};

module.exports = {
  import: async function (req, res) {
    try {
      const parseResult = validator.import.safeParse({ ...req.params, ...req.body });

      if (!parseResult.success) {
        logger.error(parseResult);
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.import({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      if (typeof respuesta === 'string') {
        res.send({ error: respuesta });
        return;
      }

      res.send({ data: respuesta }); //boolean!
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.import + ' ' + constants.error.controlador);
    }
  },

  export: async function (req, res) {
    try {
      const parseResult = validator.export.safeParse(req.params);

      if (!parseResult.success) {
        response.APIError(req, res, constants.error.validacion);
        return;
      }

      const respuesta = await service.export({
        ...parseResult.data,
        host: domain.getParentDomain(req.headers.host),
      });

      const timestamp = generateTimestamp();
      const fileName = `${parseResult.data.name}_${timestamp}.export.json`;

      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);

      const generator = (async function* () {
        yield '[';
        let first = true;
        for await (const document of respuesta) {
          if (!first) {
            yield ',';
          }
          first = false;
          yield JSON.stringify(document);
        }
        yield ']';
      })();

      Readable.from(generator).pipe(res);
    } catch (error) {
      logger.error(error);
      response.APIError(req, res, constants.error.rest.export + ' ' + constants.error.controlador);
    }
  },
};
