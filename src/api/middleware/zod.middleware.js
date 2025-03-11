const { ZodError } = require("zod");

const validate =
  (schema, type = "body") =>
  async (req, res, next) => {
    try {
      if (type === "body") {
        req.body = await schema.parseAsync(req.body);
      } else if (type === "params") {
        req.params = await schema.parseAsync(req.params);
      } else if (type === "query") {
        req.query = await schema.parseAsync(req.query);
      }
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        });
      } else {
        next(error);
      }
    }
  };

module.exports = validate;
