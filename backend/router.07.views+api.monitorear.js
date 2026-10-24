'use strict';

const controlador = require('./lib/07.views+api.monitorear/controller');

module.exports = {
  /**
   * @swagger
   * /monitorear:
   *   get:
   *     tags:
   *       - Views
   *     summary: pagina para monitorear base de datos
   *     description: pagina para monitorear base de datos
   *     x-roles: ['root']
   *     responses:
   *       200:
   *         description: Respuesta en HTML
   *         content:
   *           text/html:
   *             schema:
   *               type: string
   */
  //@route('/monitorear')
  //@method(['get'])
  //@roles(['root'])
  monitorear: controlador.monitorear,

  /**
   * @swagger
   * /api/monitor:
   *   get:
   *     tags:
   *       - ApiAdministracion
   *     summary: servicio para listar datos a monitorear
   *     description: servicio para listar datos a monitorear
   *     responses:
   *       200:
   *         description: OK
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   */
  //@route('/api/monitor')
  //@method(['get'])
  //@roles(['root'])
  api: controlador.api,
};
