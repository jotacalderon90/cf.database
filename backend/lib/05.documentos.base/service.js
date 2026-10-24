'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const repository = require('../_repository/_');

module.exports = {
  total: async function (input) {
    try {
      const total = await repository.total(input.name, { host: input.host }, {});

      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.total + ' ' + constants.error.servicio
      );
    }
  },

  collection: async function (input) {
    try {
      let collection;

      if (input.name === 'object') {
        collection = await repository.collection(input.name, { host: input.host });
      } else {
        const object = await repository.getObjeto(input.name, input.host);

        let sort = object.sort;

        if (input.sort_field != '') {
          sort = {};
          sort[input.sort_field] = input.sort_type;
        }

        collection = await repository.collection(
          input.name,
          { host: input.host },
          {
            skip: input.skip,
            limit: 50,
            projection: object.projection,
            sort: sort,
          }
        );
      }

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.collection + ' ' + constants.error.servicio
      );
    }
  },

  tags: async function (input) {
    try {
      const tags = await repository.tags(input.name, 'tag', { host: input.host });

      return tags;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.tags + ' ' + constants.error.servicio
      );
    }
  },
};
