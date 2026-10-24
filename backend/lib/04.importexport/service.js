'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const request = require('cl.jotacalderon.cf.framework/lib/request');

const repository = require('../_repository/_');
const csvtojson = require('../csvtojson');

const constants = require('./constants');

module.exports = {
  import: async function (input) {
    try {
      let json = [];

      if (input.dropCollection) {
        await repository.drop(input.name, input.host);
      }

      if (input.tipo === 'url') {
        let array = [];
        if (input.headers != '') {
          array = input.headers.split('\n');
        }
        const headers = {};
        for (let i = 0; i < array.length; i++) {
          const info = array[i].split(':');
          headers[info[0].trim()] = info[1].trim();
        }

        const respuesta = await request.get(input.data, {
          headers: headers,
        });

        if (respuesta.data.statusCode != 200) {
          return respuesta.data.statusCode + ' ' + input.data;
        }

        json = JSON.parse(respuesta.data.body);

        if (json.error) {
          return json.error;
        }

        json = json.data;
      } else if (input.tipo === 'data') {
        try {
          //intento parsear como json
          json = JSON.parse(input.data);
        } catch (error) {
          logger.error(error);
          //intento parsear como csv
          json = csvtojson(input.data);
          if (json === null) {
            throw new Error(constants.error.rest.import_parser);
          }
        }
      }

      for (let i = 0; i < json.length; i++) {
        json[i].host = input.host;
        await repository.create(input.name, json[i]);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.import + ' ' + constants.error.servicio);
    }
  },

  export: async function (input) {
    try {
      return await repository.collection(input.name, { host: input.host }, {}, true);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.export + ' ' + constants.error.servicio);
    }
  },
};
