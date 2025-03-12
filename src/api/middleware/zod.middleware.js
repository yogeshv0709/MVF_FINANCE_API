const { ZodError } = require("zod");
const { logger } = require("../../utils/helpers/logger.utils");

const validate =
  (schema, type = "body") =>
  async (req, res, next) => {
    try {
      logger.info(`Validating request ${type}`, { requestData: req[type] });

      if (type === "body") {
        req.body = await schema.parseAsync(req.body);
      } else if (type === "params") {
        req.params = await schema.parseAsync(req.params);
      } else if (type === "query") {
        req.query = await schema.parseAsync(req.query);
      }

      logger.info(`Validation successful for ${type}`);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        logger.warn("Validation failed", { errors: error.errors });

        return res.status(400).json({
          status: "error",
          message: "Validation failed",
          errors: error.errors,
        });
      } else {
        logger.error("Unexpected error in validation middleware", { error });
        next(error);
      }
    }
  };

module.exports = validate;
