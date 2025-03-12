const { logger } = require("../utils/helpers/logger.utils"); // Adjust the path as needed

class ApiError extends Error {
  constructor(statusCode, message = "Something went wrong", errors = [], stack = "") {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.message = message;
    this.success = false;
    this.errors = errors;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }

    // Log the error when it's created
    logger.error("API Error occurred", {
      statusCode,
      message,
      errors,
      stack: this.stack,
    });
  }
}

module.exports = ApiError;
