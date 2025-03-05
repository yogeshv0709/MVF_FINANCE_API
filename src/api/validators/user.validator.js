const { z } = require("zod");

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Invalid email format");

const LoginSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    type: z.enum(["Admin", "RSVC"]),
  })
  .strict();

const RegisterSchema = z
  .object({
    email: emailSchema,
    type: z.enum(["User", "RSVC"]),
  })
  .strict();

const changePasswordSchema = z.object({
  oldPassword: passwordSchema,
  newPassword: passwordSchema,
});

module.exports = { LoginSchema, RegisterSchema, changePasswordSchema };
