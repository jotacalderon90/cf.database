'use strict';

const logger = require('cl.jotacalderon.cf.framework/lib/log')(__filename);

module.exports = function (csvString) {
  try {
    // Dividir por líneas y filtrar líneas vacías
    const lines = csvString
      .trim()
      .split('\n')
      .filter((line) => line.trim());

    if (lines.length === 0) {
      return [];
    }

    // Primera línea son los headers
    const headers = lines[0].split(',').map((header) => header.trim());

    // Convertir el resto de líneas a objetos JSON
    const result = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map((value) => value.trim());
      const obj = {};

      headers.forEach((header, index) => {
        // Asignar valor o cadena vacía si no existe
        obj[header] = values[index] || '';
      });

      result.push(obj);
    }

    return result;
  } catch (error) {
    logger.error(error);
    return null;
  }
};
