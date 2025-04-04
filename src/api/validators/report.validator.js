const { z } = require("zod");
const { objectIdSchema } = require("./objectId.validator");

const reportSchema = z.object({
  imageDescriptions: z.array(
    z.object({
      imageDescriptions: z
        .string()
        .min(5, "Description must be at least 5 characters")
        .max(500, "Description must not exceed 500 characters")
        .optional(),
      images: z.string().min(5, "Invalid file URL").optional(),
    })
  ),
  weatherForecastFile: z.string().optional(),
  schedule_advisory1: z.string().optional(),
  schedule_advisory2: z.string().optional(),
  schedule_advisory3: z.string().optional(),
  description: z.string().optional(),
  requestId: z.string().uuid(),
});

const mongoDBreportId = z
  .object({
    reportId: objectIdSchema,
  })
  .strict();

module.exports = { mongoDBreportId, reportSchema };
