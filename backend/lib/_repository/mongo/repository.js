'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');

const AppError = require('../../error');

const constants = require('../constants');

const mapRow = function (row) {
  row.id = row._id.toString();
  delete row._id;
  return row;
};

const validId = /^[a-f0-9]{24}$/;

module.exports = {
  total: async function (name, query, options) {
    try {
      const total = await mongodb.count(name, query, options);

      if (isNaN(total)) {
        throw new Error(total);
      }

      return total;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.total + ' ' + constants.error.repositorio);
    }
  },

  collection: async function (name, query, options, asCursor) {
    try {
      const collection = await mongodb.find(name, query, options, asCursor);

      if (asCursor) {
        return collection;
      }

      if (!Array.isArray(collection)) {
        throw new Error(collection);
      }

      return collection.map(mapRow);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.collection + ' ' + constants.error.repositorio);
    }
  },

  tags: async function (name, field, query) {
    try {
      const tags = await mongodb.distinct(name, field, query);

      if (!Array.isArray(tags)) {
        throw new Error(tags);
      }

      return tags;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.tags + ' ' + constants.error.repositorio);
    }
  },

  create: async function (name, input) {
    try {
      if (input._id) {
        input._id = mongodb.toId(input._id);
      }

      if (!input.host) {
        throw new Error('no host :|');
      }

      delete input._name;

      const created = await mongodb.insertOne(name, input);

      if (!created.acknowledged) {
        throw new Error(created);
      }

      return created.insertedId.toString();
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new AppError(constants.error.duplicate, 409);
      }
      logger.error(error);
      throw new Error(constants.error.rest.create + ' ' + constants.error.repositorio);
    }
  },

  read: async function (name, id) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      const doc = await mongodb.findOne(name, id);

      if (!doc._id) {
        throw new Error(doc);
      }

      return mapRow(doc);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.read + ' ' + constants.error.repositorio);
    }
  },

  update: async function (name, id, set) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      delete set._id;
      delete set._name;

      const updated = await mongodb.updateOne(name, id, { $set: set });

      if (!updated.acknowledged) {
        logger.error(updated);
        throw new Error(updated);
      }

      return true;
    } catch (error) {
      if (error.code && error.code === 11000) {
        throw new AppError(constants.error.duplicate, 409);
      }
      logger.error(error);
      throw new Error(constants.error.rest.update + ' ' + constants.error.repositorio);
    }
  },

  delete: async function (name, id) {
    try {
      if (!validId.test(id)) {
        throw new Error('Id inválido');
      }

      const deleted = await mongodb.deleteOne(name, id);

      if (!deleted.acknowledged) {
        throw new Error(deleted);
      }

      return true;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.delete + ' ' + constants.error.repositorio);
    }
  },

  /**************************/
  /*Metodos para cf.database*/
  /**************************/

  getObjeto: async function (name, host) {
    try {
      const query = {
        name: name,
        host: host,
      };

      const object = await this.collection('object', query, {});

      if (object.length == 0) {
        throw new Error(constants.error.rest.getObjetoNotFound);
      }

      return object[0];
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.getObjeto + ' ' + constants.error.repositorio);
    }
  },

  drop: async function (name, host) {
    try {
      const coll = await this.collection(name, { host: host });
      for (let i = 0; i < coll.length; i++) {
        await this.delete(name, coll[i].id);
      }
      //const drop = await mongodb.dropCollection(name);
      //logger.info(drop);
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.drop + ' ' + constants.error.repositorio);
    }
  },

  monitor: async function () {
    try {
      const adminDb = mongodb.client.db().admin();

      const [status, ops] = await Promise.all([
        adminDb.command({ serverStatus: 1 }),
        adminDb.command({ currentOp: 1 }),
      ]);

      const inprog = ops.inprog || [];

      let active = 0;
      let slow = 0;
      let waitingForLock = 0;
      let collscan = 0;
      let maxSecsRunning = 0;

      for (const op of inprog) {
        if (!op.active) continue;

        active++;

        const secs = op.secs_running || 0;
        if (secs > 5) slow++; //SE MARCA 5 SEGUNDOS COMO SLOW! ?
        if (op.waitingForLock) waitingForLock++;
        if (secs > maxSecsRunning) maxSecsRunning = secs;

        const plan = op.planSummary || '';
        if (plan.includes('COLLSCAN')) collscan++;
      }

      const doc = {
        ts: new Date(),

        currentOp: {
          active,
          slow,
          waitingForLock,
          collscan,
          maxSecsRunning,
        },

        counters: {
          opcounters: status.opcounters,
          network: {
            bytesIn: status.network.bytesIn,
            bytesOut: status.network.bytesOut,
            physicalBytesIn: status.network.physicalBytesIn,
            physicalBytesOut: status.network.physicalBytesOut,
            numSlowDNSOperations: status.network.numSlowDNSOperations,
            numSlowSSLOperations: status.network.numSlowSSLOperations,
            rejectedAdmissions: status.network.ingressRequestRateLimiter
              ? status.network.ingressRequestRateLimiter.rejectedAdmissions
              : 0,
            numRequests: status.network.numRequests,
            durationMicros: status.network.listenerProcessingTime
              ? status.network.listenerProcessingTime.durationMicros
              : 0,
          },
        },

        uptime: status.uptime,
        connections: status.connections?.current,
      };

      return doc;
    } catch (error) {
      logger.error(error);
      throw new Error(constants.error.rest.monitor + ' ' + constants.error.repositorio);
    }
  },
};
