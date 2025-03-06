const { z } = require("zod");

const FarmerCropSchema = z
  .object({
    // Farmer Details
    farmerName: z
      .string()
      .min(1, "Farmer name is required")
      .max(100, "Farmer name must not exceed 100 characters"),
    contactNumber: z
      .string()
      .min(10, "Contact number must be 10 digits")
      .max(10, "Contact number must be 10 digits")
      .regex(/^\d+$/, "Contact number must contain only digits"),
    email: z.string().email("Invalid email format").max(100).optional(),
    address: z
      .string()
      .min(1, "Address is required")
      .max(255, "Address must not exceed 255 characters"),
    aadharNumber: z
      .string()
      .length(12, "Aadhar number must be exactly 12 digits")
      .regex(/^\d+$/, "Aadhar number must contain only digits"),
    state: z.string().min(1, "State is required").max(100),
    district: z.string().min(1, "District is required").max(100),
    tehsil: z.string().max(100).optional(),
    village: z.string().max(100).optional(),
    pinCode: z
      .string()
      .length(6, "Pin code must be exactly 6 digits")
      .regex(/^\d+$/, "Pin code must contain only digits"),

    // Crop Details
    cropName: z.string().min(1, "Crop name is required").max(100),
    cropSeason: z.string().min(1, "Crop season is required").max(50),
    seasonYear: z
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
      .number()
      .min(0, "Yield cannot be negative")
      .max(100000, "Unrealistic yield value")
      .optional(),

    // Field Details
    fieldName: z
      .string()
      .min(1, "Field name is required")
      .max(100, "Field name must not exceed 100 characters"),
    area: z
      .number()
      .min(0.1, "Field area must be greater than 0") // Acres
      .max(10000, "Unrealistic field area"),
    latitude: z
      .number()
      .min(-90, "Invalid latitude")
      .max(90, "Invalid latitude")
      .optional(),
    longitude: z
      .number()
      .min(-180, "Invalid longitude")
      .max(180, "Invalid longitude")
      .optional(),
    wkt: z.string().min(1, "WKT data is required").max(10000),
  })
  .strict();

module.exports = { FarmerCropSchema };
