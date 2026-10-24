'use strict';

const { z } = require('zod');

module.exports = {
  
  coleccion: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase()
  }),
  
  formulario: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase()
  }),
  
  documento: z.object({
    name: z
      .string()
      .trim()
      .toLowerCase(),
    id: z
      .string()
      .trim()
      .toLowerCase()
  })
  
  
}