const { z } = require("zod");
const { objectIdSchema } = require("./objectId.validator");
const sanitizeHtml = require("sanitize-html");

const baseServiceSchema = {
  name: z
    .string()
    .trim()
    .min(1, "Service name is required.")
    .max(100, "Service name must be at most 100 characters."),
  basePrice: z
    .string()
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0, {
      message: "Base price must be a valid number and at least 0.",
    }),

  active: z.string().transform((val) => val === "true"),

  discountPercentage: z
    .string()
    .default("0")
    .transform((val) => Number(val))
    .refine((val) => !isNaN(val) && val >= 0 && val <= 100, {
      message: "Discount percentage must be a number between 0 and 100.",
    }),
  image: z.string().trim().max(500, "Image URL must be at most 500 characters.").optional(),
  coverImage: z.string().trim().max(500, "Image URL must be at most 500 characters.").optional(),
  description: z
    .string()
    .max(5000, "Too long description it should be under 5000 lines")
    .optional()
    .transform((val) => sanitizeHtml(val)),
  features: z
    .string()
    .max(5000, "Too long description it should be under 5000 lines")
    .optional()
    .transform((val) => sanitizeHtml(val)),
};

const serviceSchema = z.object(baseServiceSchema).strict();

const updateServiceSchema = z.object({
  ...Object.fromEntries(
    Object.entries(baseServiceSchema).map(([key, schema]) => [key, schema.optional()])
  ),
  serviceId: objectIdSchema,
});

const getServiceSchema = z.object({
  serviceId: objectIdSchema,
});

module.exports = { serviceSchema, updateServiceSchema, getServiceSchema };
