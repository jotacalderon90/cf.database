'use strict';

const controlador = require('./lib/02.views.objetos/controller');

module.exports = {
  /**
   * @swagger
   * /:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina de objetos
   *     description: pagina de objetos
   *     x-roles: ['root','admin','database']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/')
  //@method(['get'])
  //@roles(['root','admin','database'])
  coleccion: controlador.coleccion,

  /**
   * @swagger
   * /objetos/form:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina de nuevo objeto
   *     description: pagina de nuevo objeto
   *     x-roles: ['root','admin']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/objetos/form')
  //@method(['get'])
  //@roles(['root','admin'])
  formulario: controlador.formulario,

  /**
   * @swagger
   * /objetos/{name}/edit:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina para visualizar objeto
   *     description: pagina para visualizar objeto
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto
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
  //@route('/objetos/:name/edit')
  //@method(['get'])
  //@roles(['root','admin'])
  documento: controlador.documento,
};
