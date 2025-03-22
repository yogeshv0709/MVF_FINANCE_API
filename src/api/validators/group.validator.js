const { z } = require("zod");
const { objectIdSchema } = require("./objectId.validator");

const createGroupSchema = z
  .object({
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(25, "Name can not be more than 25 characters"),
    description: z.string().max(250, "Name can not be more than 250 characters").optional(),
    blocked: z.boolean().optional(),
  })
  .strict();

const updateGroupSchema = z
  .object({
    id: objectIdSchema,
    name: z
      .string()
      .min(3, "Name must be at least 3 characters")
      .max(250, "Name can not be more than 250 characters")
      .optional(),
    description: z.string().optional(),
    blocked: z.boolean().optional(),
  })
  .strict();

const getGroupSchema = z
  .object({
    groupId: objectIdSchema,
  })
  .strict();

module.exports = {
  createGroupSchema,
  updateGroupSchema,
  getGroupSchema,
};
