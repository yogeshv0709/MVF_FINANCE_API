const { z } = require("zod");

const uplValidator = z
  .object({
    requestId: z.string().uuid({ message: "Invalid requestId. It must be a valid UUID." }),
  })
  .strict();

module.exports = { uplValidator };
