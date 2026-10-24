'use strict';

const fs = require('fs');
const { performance } = require('perf_hooks')

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);
const mongodb = require('cl.jotacalderon.cf.framework/lib/mongodb');
const request = require('cl.jotacalderon.cf.framework/lib/request');

const { DateTime } = require('luxon');

const ahora = DateTime.now();

const esPrimeroDelAno  = ahora.month === 1 && ahora.day === 1;
const esPrimeroDelMes  = ahora.day === 1;
const esPrimerDiaSemana = ahora.weekday === 1; // 1 = lunes en Luxon

const generaInformeDiario = async function(url) {
  try {
    
    const response = await request.get(url, {}, true);
    if (response.error) {
      logger.error(response.error);
    } else {
      
      const contentDisposition = response.data.headers['content-disposition'];
      let filename = `archivo_${Date.now()}.pdf`;
      if (contentDisposition) {
        const match = contentDisposition.match(/filename\*?=(?:UTF-8''|")?([^";\n]+)/i);
        if (match) filename = decodeURIComponent(match[1].replace(/"/g, ''));
      }
      fs.writeFileSync(`${process.env.PATH_PDF}/${filename}`, response.data.body);
      
    }
    
  }catch(error) {
    logger.error(error);
  }
}

setTimeout(async () => {
  const inicio = performance.now();
  
  await generaInformeDiario(`${process.env.HOST}/pdf`);
  
  const duracion = performance.now() - inicio;
  logger.info(parseFloat(duracion.toFixed(3)) + 'ms');
  process.exit(0);
  
}, 5 * 1000);

module.exports = {};