const { z } = require("zod");
const { stateSchema, citySchema } = require("./company.validator");

const FarmerCropSchema = z
  .object({
    // Farmer Details
    farmerName: z
      .string()
      .min(1, "Farmer name is required")
      .max(100, "Farmer name must not exceed 100 characters"),
    contact: z
      .string()
      .length(10, "Contact number must be exactly 10 digits")
      .regex(/^\d+$/, "Contact number must contain only digits"),
    email: z.string().max(100).optional(),
    address: z.string().max(255, "Address must not exceed 255 characters").optional(),
    adharNumber: z
      .string()
      .length(12, "Aadhar number must be exactly 12 digits")
      .regex(/^\d+$/, "Aadhar number must contain only digits")
      .or(z.literal("").optional())
      .optional(),
    state: stateSchema,
    district: citySchema,
    tehsil: z.string().max(100, "tehsil can not be more than 100 character").optional(),
    village: z.string().max(100, "village can not be more than 100 character").optional(),
    pinCode: z
      .string()
      .length(6, "Pin code must be exactly 6 digits")
      .regex(/^\d+$/, "Pin code must contain only digits"),

    // Crop Details
    cropName: z
      .string()
      .min(1, "Crop name is required")
      .max(100, "cropName can not be more than 100 character"),
    cropSeason: z
      .string()
      .min(1, "Crop season is required")
      .max(50, "cropSeason can not be more than 50 character"),
    year: z
      .number()
      .int()
      .min(1900, "Invalid season year")
      .max(new Date().getFullYear(), "Season year cannot be in the future"),
    sowingDate: z.union([
      z.string().refine((date) => !isNaN(Date.parse(date)), {
        message: "Invalid date format",
      }),
      z.date(),
    ]),
    approximateYield: z
      .string()
      .min(0, "Yield cannot be negative")
      .max(100000, "Unrealistic yield value")
      .optional(),

    // Field Details
    fieldName: z.string().max(100, "Field name must not exceed 100 characters").optional(),

    area: z
      .string()
      .trim()
      .regex(/^\d+(\.\d+)?$/, "Field area must be a valid number")
      .refine((val) => parseFloat(val) >= 0.1, {
        message: "Field area must be greater than 0",
      })
      .refine((val) => parseFloat(val) <= 10000, {
        message: "Unrealistic field area",
      }),

    // latitude: z.string().trim().optional(),
    latitude: z.string().trim().min(-90, "Invalid latitude").max(90, "Invalid latitude").optional(),

    longitude: z
      .string()
      .trim()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude")
      .optional(),

    wkt: z.string().min(1, "WKT data is required").max(10000),
    type: z.string().min(1, "Type is required").max(50, "no more than 50").optional(),
    enquiryType: z.string().min(1, "Enquiry Type is required").max(50, "no more than 50"),
  })
  .strict();

const getFarmersCropSchema = z
  .object({
    entype: z.string().min(1, "Invalid entype").max(25, "Invalid entype").optional(),
  })
  .strict();

const deleteEnquirySchema = z
  .object({
    requestId: z.string().uuid({ message: "Invalid requestId. It must be a valid UUID." }),
  })
  .strict();

const sendOtpSchema = z
  .object({
    phoneNumber: z
      .string()
      .length(10, "Contact number must be exactly 10 digits")
      .regex(/^\d+$/, "Contact number must contain only digits"),
  })
  .strict();

const verifyOtpSchema = z
  .object({
    phoneNumber: z
      .string()
      .length(10, "Contact number must be exactly 10 digits")
      .regex(/^\d+$/, "Contact number must contain only digits"),
    otp: z.string().max(10, "Not valid OTP"),
  })
  .strict();

module.exports = {
  FarmerCropSchema,
  getFarmersCropSchema,
  deleteEnquirySchema,
  sendOtpSchema,
  verifyOtpSchema,
};
