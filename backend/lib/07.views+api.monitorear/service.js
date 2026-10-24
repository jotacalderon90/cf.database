'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('./constants');

const repository = require('../_repository/_');

module.exports = {
  api: async function (input) {
    try {
      const collection = await repository.collection(
        'mongo_monitor',
        {},
        {
          skip: input.skip,
          limit: 24,
          sort: {
            ts: -1,
          },
        }
      );

      return collection;
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error
          ? error.message
          : constants.error.rest.api + ' ' + constants.error.servicio
      );
    }
  },
};
