const { z } = require("zod");

const objectIdSchema = z.string().refine((id) => /^[0-9a-fA-F]{24}$/.test(id), {
  message: "Invalid MongoDB ObjectId",
});

const reportSchema = z
  .object({
    descriptions: z.array(
      z.object({
        imagedescription: z
          .string()
          .min(5, "Description must be at least 5 characters")
          .max(500, "Description must not exceed 500 characters"),
        images: z.string().min(5, "Invalid file URL").optional(),
      })
    ),
    weatherForecastFile: z.string().optional(),
    otherReportFile: z.string().optional(),
    alert_notifications: z.string().optional(),
    requestId: z.string().uuid(),
  })
  .strict();

module.exports = reportSchema;
