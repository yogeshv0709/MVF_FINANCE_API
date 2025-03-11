const envVars = require("./server.config");

const jwtConfig = {
  secret: envVars.JWT_SECRET || "your-secret-key",
  expiresIn: 24 * 60 * 60, // 24 hours in seconds
  refreshExpiresIn: 30 * 24 * 60 * 60, // 30 days in seconds
};

module.exports = jwtConfig;
