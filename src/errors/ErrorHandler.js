const { isDevelopment } = require("../utils/constants/constant");
const ApiError = require("./ApiErrors");
const { logger } = require("../utils/helpers/logger.utils"); // Ensure logger is correctly imported

const errorHandler = (err, req, res, next) => {
  logger.error("Error occurred", {
    method: req.method,
    path: req.originalUrl,
    errorMessage: err.message,
    stack: isDevelopment ? err.stack : undefined,
  });
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
      stack: isDevelopment ? err.stack : undefined,
    });
  }

  if (err instanceof SyntaxError) {
    return res.status(400).json({
      success: false,
      message: "Malformed JSON",
      errors: [],
      data: null,
      stack: isDevelopment ? err.stack : undefined,
    });
  }

  res.status(500).json({
    success: false,
    message: "Internal Server Error",
    errors: [],
    data: null,
    stack: isDevelopment ? err.stack : undefined,
  });
};

module.exports = errorHandler;
