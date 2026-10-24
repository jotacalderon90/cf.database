'use strict';

const { z } = require('zod');

module.exports = {
  
  api: z.object({
    skip: z
      .coerce.number()
  })
  
}