const { z } = require("zod");
const { objectIdSchema } = require("./objectId.validator");

const stateSchema = z
  .string()
  .regex(/^ST10\d{2}$/, "Invalid state ID format") // Ensures format ST10XX
  .refine(
    (id) => {
      const num = parseInt(id.substring(2), 10); // Extract number part
      return num >= 1000 && num <= 1035;
    },
    { message: "State ID must be between ST1000 and ST1035" }
  );

const citySchema = z
  .string()
  .regex(/^DT\d{4}$/, "Invalid district ID format")
  .refine(
    (id) => {
      const num = parseInt(id.substring(2), 10);
      return num >= 1000 && num <= 1791;
    },
    { message: "District ID must be between DT1000 and DT1791" }
  );

const baseCompanySchema = {
  firmName: z
    .string()
    .trim()
    .min(2, "Company name must be at least 2 characters long")
    .max(100, "Company name must not exceed 100 characters"),

  name: z
    .string()
    .trim()
    .min(2, "name must be at least 2 characters long")
    .max(100, "name must not exceed 100 characters"),

  address: z
    .string()
    .trim()
    .min(5, "Address must be at least 5 characters long")
    .max(200, "Address must not exceed 200 characters"),

  email: z
    .string()
    .trim()
    .email("Invalid email format")
    .max(100, "Email address must not exceed 100 characters"),
  stateId: stateSchema,
  cityId: citySchema,

  contact: z
    .union([z.string(), z.number()])
    .transform((val) => String(val).trim())
    .refine((val) => /^[6-9]\d{9}$/.test(val), {
      message: "Contact number must be a valid 10-digit Indian number starting with 6-9",
    }),

  pincode: z
    .union([z.string(), z.number()])
    .transform((val) => String(val).trim())
    .refine((val) => /^\d{6}$/.test(val), {
      message: "Pin Code must be a valid 6-digit number",
    }),

  stateId: stateSchema,
  cityId: citySchema,

  IFSC: z
    .string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .length(11, "IFSC code must be exactly 11 characters long")
    .optional(),

  blocked: z.boolean().default("false").optional(),

  status: z.enum(["pending", "accept", "rejected"]).default("pending"),

  loanId: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format")).optional(),

  gstNumber: z
    .string()
    .regex(
      /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[A-Z0-9]{1})$/,
      "Invalid GST number format"
    )
    .optional(),

  firmType: z.string().max(50, "firmType must be less than 50").optional(),

  tehsil: z
    .string()
    .trim()
    .min(2, "Tehsil name is too short")
    .max(50, "Tehsil name is too long")
    .optional(),

  village: z
    .string()
    .trim()
    .min(2, "Village name is too short")
    .max(50, "Village name is too long")
    .optional(),

  groupId: objectIdSchema,
};

const createCompanySchema = z.object(baseCompanySchema);

const updateCompanySchema = z.object({
  ...Object.fromEntries(
    Object.entries(baseCompanySchema).map(([key, schema]) => [key, schema.optional()])
  ),
  frenchiseId: z.string().trim().min(6, "frenchiseId is required"),
});

const getCompanySchema = z
  .object({
    frenchiseId: z.string().trim().min(6, "frenchiseId is required"),
  })
  .strict();

module.exports = {
  createCompanySchema,
  updateCompanySchema,
  getCompanySchema,
  stateSchema,
  citySchema,
};
