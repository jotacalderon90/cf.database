'use strict';

const { z } = require('zod');

module.exports = {
  total: z.object({
    name: z.string().trim().toLowerCase(),
  }),

  collection: z.object({
    name: z.string().trim().toLowerCase(),
    skip: z.coerce.number(),
    sort_field: z.string().trim().toLowerCase().optional(),
    sort_type: z.coerce.number().optional(),
  }),

  tags: z.object({
    name: z.string().trim().toLowerCase(),
  }),
};
