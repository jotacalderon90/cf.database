'use strict';

const { z } = require('zod');

const isValidImageDataUrl = (val) => {
  const match = val.match(
    /^data:image\/(png|jpe?g|gif|webp|svg\+xml);base64,([A-Za-z0-9+/]+={0,2})$/
  );
  if (!match) return false;

  const data = match[2];

  // La longitud debe ser múltiplo de 4
  if (data.length % 4 !== 0) return false;

  // El padding '=' solo puede ir al final, máximo 2, y no en cualquier posición intermedia
  // (esto ya lo garantiza el regex porque ={0,2}$ está anclado al final)

  return true;
};

module.exports = {
  create: z
    .object({
      _name: z.string().trim().toLowerCase(),
    })
    .passthrough(),

  read: z.object({
    name: z.string().trim().toLowerCase(),
    id: z.string(),
  }),

  update: z
    .object({
      _name: z.string().trim().toLowerCase(),
      id: z.string(),
    })
    .passthrough(),

  delete: z.object({
    name: z.string().trim().toLowerCase(),
    id: z.string(),
  }),

  upload: z.object({
    name: z.string().trim().toLowerCase(),
    id: z.string(),
    base64: z
      .string()
      .trim()
      .min(1, 'base64 es requerido')
      .refine(isValidImageDataUrl, { message: 'base64 debe ser un string en base64 válido' }),
  }),
};
