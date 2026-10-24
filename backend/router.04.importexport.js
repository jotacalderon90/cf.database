'use strict';

const controlador = require('./lib/04.importexport/controller');

module.exports = {
  /**
   * @swagger
   * /api/document/{name}/import:
   *   post:
   *     tags:
   *       - ApiAdministracion
   *     summary: api para importar objetos
   *     description: api para importar objetos
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto a importar
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
  //@route('/api/document/:name/import')
  //@method(['post'])
  //@roles(['root','admin'])
  import: controlador.import,

  /**
   * @swagger
   * /api/document/{name}/export:
   *   get:
   *     tags:
   *       - ApiAdministracion
   *     summary: api para exportar objetos
   *     description: api para exportar objetos
   *     x-roles: ['root','admin']
   *     parameters:
   *       - in: path
   *         name: name
   *         required: true
   *         description: Nombre del objeto a exportar
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
  //@route('/api/document/:name/export')
  //@method(['get'])
  //@roles(['root','admin'])
  export: controlador.export,
};
