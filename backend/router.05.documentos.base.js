'use strict';

const controlador = require('./lib/05.documentos.base/controller');

module.exports = {
  /**
   * @swagger
   * /api/document/{name}/total:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para total de una coleccion
   *     description: api para total de una coleccion
   *     x-roles: ['root','admin','database']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/document/:name/total')
  //@method(['get'])
  //@roles(['root','admin','database'])
  total: controlador.total,

  /**
   * @swagger
   * /api/document/{name}/collection:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para listar una coleccion
   *     description: api para listar una coleccion
   *     x-roles: ['root','admin','database']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/document/:name/collection')
  //@method(['get'])
  //@roles(['root','admin','database'])
  collection: controlador.collection,

  /**
   * @swagger
   * /api/document/{name}/tags:
   *   get:
   *     tags:
   *       - ApiBase
   *     summary: api para listar tags de una coleccion
   *     description: api para listar tags de una coleccion
   *     x-roles: ['root','admin','database']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/document/:name/tags')
  //@method(['get'])
  //@roles(['root','admin','database'])
  tags: controlador.tags,
};
