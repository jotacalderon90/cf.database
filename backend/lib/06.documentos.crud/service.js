'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');

const AppError = require('../error');

const constants = require('./constants');

const repository = require('../_repository/_');

module.exports = {
  create: async function (input) {
    try {
      if (input._name === 'object') {
        return await repository.create('object', input);
      }

      const objeto = await repository.getObjeto(input._name, input.host);

      const nuevoDocumento = {};

      for (let attr in objeto.schema) {
        nuevoDocumento[attr] = input[attr];
      }

      if (objeto.static) {
        const staticFieldBuilders = {
          author: () => ({
            id: input.user.id,
            nickname: input.user.nickname,
            thumb: input.user.thumb,
          }),
          created: () => new Date(),
        };

        for (const field of objeto.static) {
          const build = staticFieldBuilders[field];
          if (build) {
            nuevoDocumento[field] = build();
          }
        }
      }

      nuevoDocumento.host = input.host;

      return await repository.create(input._name, nuevoDocumento);
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.servicio);
    }
  },

  read: async function (input) {
    try {
      return await repository.read(input.name, input.id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.servicio);
    }
  },

  update: async function (input) {
    try {
      if (input._name === 'object') {
        await repository.update('object', input.id, input);
        return true;
      }

      const objeto = await repository.getObjeto(input._name, input.host);

      const update = {};

      for (let field in input) {
        if (Object.hasOwn(objeto.schema, field)) {
          update[field] = input[field];
        }
      }

      update.host = input.host;

      return await repository.update(input._name, input.id, update);
    } catch (error) {
      logger.error(error);

      if (error instanceof AppError) {
        throw error;
      }

      throw new Error(constants.error.rest.update + ' ' + constants.error.servicio);
    }
  },

  delete: async function (input) {
    try {
      return await repository.delete(input.name, input.id);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.servicio);
    }
  },

  upload: async function (input) {
    try {
      const document = await repository.read(input.name, input.id);
      
      const filepath =
        '/archivospublicos/assets/img/' +
        input.name +
        '/' +
        document.domain +
        '.' +
        input.host +
        '/' +
        input.id + '.jpg';
      
      const archivosPrivadosHost  = 'https://archivosprivados.' + input.host;
      
      const respuesta = await request.post(archivosPrivadosHost + '/api/integration/upload/' + Buffer.from(filepath).toString('base64'), {
        headers: {
          'user-agent': 'cf.database',
          origin: input.origin,
        }
      }, {
        content: input.base64.replace(/^data:image\/\w+;base64,/, '')
      });
      
      if (respuesta.error) {
        logger.error(respuesta);
        throw new Error(constants.error.rest.servicio_archivosprivados);
      }

      if (respuesta.data.statusCode != 200) {
        logger.error(respuesta);
        throw new Error(constants.error.rest.servicio_archivosprivados + ' ' + respuesta.data.statusCode);
      }

      return true;
      
      //20261019:no agrego archivo directamente, sino que delego funcionalidad a sistema de ArchivosPrivados
      
      /*
      const basePath =
        process.cwd() +
        '/frontend/assets/domains/archivospublicos.' +
        input.host +
        '/assets/img/' +
        input.name +
        '/' +
        document.domain +
        '.' +
        input.host +
        '/';

      fs.mkdirSync(basePath, { recursive: true });

      const buffer = Buffer.from(input.base64.replace(/^data:image\/\w+;base64,/, ''), 'base64');
      const filePath = basePath + input.id + '.jpg';

      await fs.promises.writeFile(filePath, buffer);

      return true;
      */
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.upload + ' ' + constants.error.servicio);
    }
  },
};
