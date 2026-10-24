'use strict';

const cron = require('node-cron');

const controlador = require('./lib/cron/controller');

if(process.env.CRON_CHEDULE_MONITOR) {
  cron.schedule(process.env.CRON_CHEDULE_MONITOR, controlador.monitor);
}