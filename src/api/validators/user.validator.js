const { z } = require("zod");

const passwordSchema = z
  .string()
  .trim()
  .min(8, "Password must be at least 8 characters")
  .max(64, "Password must be at most 64 characters");

const emailSchema = z.string().trim().toLowerCase().email("Invalid email format");

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

const UserSchemaSendEmail = z
  .object({
    email: emailSchema,
  })
  .strict();

const UserSchemaResetPassword = z
  .object({
    token: z.string().min(10, "Invalid token").max(100, "Invalid token"),
    newPassword: passwordSchema,
  })
  .strict();

module.exports = {
  LoginSchema,
  RegisterSchema,
  changePasswordSchema,
  UserSchemaSendEmail,
  UserSchemaResetPassword,
};
