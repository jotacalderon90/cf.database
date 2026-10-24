'use strict';

const controlador = require('./lib/06.documentos.crud/controller');

module.exports = {
  /**
   * @swagger
   * /api/document/{_name}:
   *   post:
   *     tags:
   *       - ApiCrud
   *     summary: api para crear registro en una coleccion
   *     description: api para crear registro en una coleccion
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: _name
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
  //@route('/api/document/:_name')
  //@method(['post'])
  //@roles(['root','admin'])
  create: controlador.create,

  /**
   * @swagger
   * /api/document/{name}/{id}:
   *   get:
   *     tags:
   *       - ApiCrud
   *     summary: api para obtener registro de una coleccion
   *     description: api para obtener registro de una coleccion
   *     x-roles: ['root','admin','database']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: id del documento
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
  //@route('/api/document/:name/:id')
  //@method(['get'])
  //@roles(['root','admin','database'])
  read: controlador.read,

  /**
   * @swagger
   * /api/document/{_name}/{id}:
   *   put:
   *     tags:
   *       - ApiCrud
   *     summary: api para actualizar registro de una coleccion
   *     description: api para actualizar registro de una coleccion
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: _name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: id del documento
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
  //@route('/api/document/:_name/:id')
  //@method(['put'])
  //@roles(['root','admin'])
  update: controlador.update,

  /**
   * @swagger
   * /api/document/{name}/{id}:
   *   delete:
   *     tags:
   *       - ApiCrud
   *     summary: api para eliminar registro de una coleccion
   *     description: api para eliminar registro de una coleccion
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: id del documento
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
  //@route('/api/document/:name/:id')
  //@method(['delete'])
  //@roles(['root','admin'])
  delete: controlador.delete,

  /**
   * @swagger
   * /api/document/{name}/{id}/img/base64:
   *   delete:
   *     tags:
   *       - ApiCrud
   *     summary: api para subir archivo en base64
   *     description: api para subir archivo en base64
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         required: true
   *         description: id del documento
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
  //@route('/api/document/:name/:id/img/base64')
  //@method(['post'])
  //@roles(['root','admin'])
  upload: controlador.upload,
};
