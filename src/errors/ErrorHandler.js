const { isDevelopment } = require("../utils/constants/constant");
const ApiError = require("./ApiErrors");

const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      errors: err.errors,
      data: err.data,
      stack: isDevelopment ? err.stack : undefined,
    });
    return;
  }
  if (err instanceof SyntaxError) {
    res.status(400).json({
      success: false,
      message: "Malformed JSON",
      errors: [],
      data: null,
      stack: isDevelopment ? err.stack : undefined,
    });
    return;
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
