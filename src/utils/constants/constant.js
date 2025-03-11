const envVars = require("../../config/server.config");

const constants = {
  ENVIRONMENT_DEVELOPMENT: "development",
  MAX_LOG_FILE_SIZE_MB: 5 * 1024 * 1024,
  MAX_LOG_FILE: 5,
  REDIS_MAX_RETRIES: 10,
  JSON_LIMIT: "10mb",
};

const userType = {
  RSVC: "RSVC",
  Admin: "Admin",
  User: "User",
};

const isDevelopment = envVars.NODE_ENV === constants.ENVIRONMENT_DEVELOPMENT;

const FRONTEND_URL = envVars.FRONTEND_URL;

module.exports = {
  constants,
  isDevelopment,
  FRONTEND_URL,
  userType,
};
