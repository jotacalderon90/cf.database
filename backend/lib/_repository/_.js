'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const validMotor = ['mongo', 'oracle'];

if (validMotor.indexOf(process.env.DB_MOTOR) === -1) {
  logger.error('Motor de BD inválido');
  process.exit(0);
}

module.exports = require('./' + process.env.DB_MOTOR + '/repository');
