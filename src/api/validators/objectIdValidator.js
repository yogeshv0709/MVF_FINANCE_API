const { z } = require("zod");

// ObjectId validation schema
const objectIdSchema = z.object({
  farmerId: z
    .string()
    .trim()
    .regex(/^[a-f\d]{24}$/i, "Invalid MongoDB ObjectId format"),
});

module.exports = { objectIdSchema };
