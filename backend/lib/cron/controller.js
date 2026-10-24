'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const constants = require('../constants');

const repository = require('../_repository/_');

module.exports = {
  monitor: async function () {
    try {
      logger.info('Cron start');

      const monitor = await repository.monitor();

      monitor.host = process.env.HOST_MONITOR;

      const created = await repository.create('mongo_monitor', monitor);
      logger.info(created);
      logger.info('Cron finish');
    } catch (error) {
      logger.error(error);
      throw new Error(
        error instanceof Error ? error.message : 'Error monitor' + ' ' + constants.error.controlador
      );
    }
  },
};
