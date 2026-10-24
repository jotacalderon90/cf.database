'use strict';

const { z } = require('zod');

module.exports = {
  
  import: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase(),
    tipo: z
      .string()
      .trim()
      .toLowerCase()
      .pipe(z.enum(['url', 'data'])),
    data: z
      .string()
      .trim(),
    headers: z
      .string()
      .trim(),
    dropCollection: z
      .boolean()
  }),
  
  export: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase()
  })
  
}