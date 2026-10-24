'use strict';

const fs = require('fs');

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

const view = require('./view');

const fileCache = new Map();

module.exports = async function (nameObject, host) {
  const id = nameObject + host;
  let existe_formulario = false;
  try {
    if (fileCache.has(id)) {
      return fileCache.get(id);
    }
    //Valido si existe formulario propio para dominio
    const path_form = 'database/03.cms/' + nameObject + '/_';
    const path_view = await view(path_form, host);
    if (path_view != path_form) {
      //existe formulario propio para dominio
      existe_formulario = true;
    } else {
      //No existe formulario propio para dominio , validar que exista para objeto general (blog/ecommerce/story)
      existe_formulario = await fs.promises
        .access(
          process.cwd() + '/' + (process.env.FRONTEND || 'frontend') + '/' + path_form + '.html'
        )
        .then(() => true)
        .catch(() => false);
    }
  } catch (error) {
    logger.error(error);
  }

  fileCache.set(id, existe_formulario);
  return existe_formulario;
};
