const { z } = require("zod");
const { INDIAN_STATES } = require("../../utils/constant");

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

  contact: z
    .string()
    .trim()
    .regex(
      /^[6-9]\d{9}$/,
      "Contact number must be a valid 10-digit Indian number starting with 6-9"
    ),

  state: z.string().refine((state) => INDIAN_STATES.includes(state), {
    message: "Invalid state. Please select a valid Indian state.",
  }),

  district: z
    .string()
    .trim()
    .min(2, "District name must be at least 2 characters long")
    .max(50, "District name must not exceed 50 characters"),

  pinCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Pin Code must be a valid 6-digit number"),

  IFSC: z
    .string()
    .trim()
    .regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC code format")
    .length(11, "IFSC code must be exactly 11 characters long"),

  block: z.boolean().default(false),
  status: z.enum(["pending", "accept", "rejected"]).default("pending"),

  loanId: z
    .array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format"))
    .optional(),

  gstNumber: z
    .string()
    .regex(
      /^([0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[A-Z0-9]{1})$/,
      "Invalid GST number format"
    )
    .optional(),

  firmtype: z.union([
    z.string().min(1, "Firm type cannot be empty"),
    z.boolean(),
  ]), // Can be either string (non-empty) or boolean

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
};

const createCompanySchema = z.object(baseCompanySchema).strict();

const updateCompanySchema = z
  .object(
    Object.fromEntries(
      Object.entries(baseCompanySchema).map(([key, schema]) => [
        key,
        schema.optional(),
      ])
    )
  )
  .strict();

module.exports = { createCompanySchema, updateCompanySchema };
