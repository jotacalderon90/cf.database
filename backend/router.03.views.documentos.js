'use strict';

const controlador = require('./lib/03.views.documentos/controller');

module.exports = {
  /**
   * @swagger
   * /objetos/{name}:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina de objetos
   *     description: pagina de objetos
   *     x-roles: ['root','admin','database']
   *     parameters:
   *       - in: path
   *         name: name
   *         description: Nombre del objeto
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/objetos/:name')
  //@method(['get'])
  //@roles(['root','admin','database'])
  coleccion: controlador.coleccion,

  /**
   * @swagger
   * /objetos/{name}/form:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina de nuevo objeto
   *     description: pagina de nuevo objeto
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: name
   *         description: Nombre del objeto
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/objetos/:name/form')
  //@method(['get'])
  //@roles(['root','admin'])
  formulario: controlador.formulario,

  /**
   * @swagger
   * /objetos/{name}/{id}:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina para editar objeto
   *     description: pagina para editar objeto
   *     x-roles: ['root','admin','database']
   *     parameters:
   *       - in: path
   *         name: name
   *         description: Nombre del objeto
   *         required: true
   *         schema:
   *           type: string
   *       - in: path
   *         name: id
   *         description: Id del objeto
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/objetos/:name/:id')
  //@method(['get'])
  //@roles(['root','admin','database'])
  documento: controlador.documento,
};
