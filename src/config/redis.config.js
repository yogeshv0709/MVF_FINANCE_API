const Redis = require("ioredis");
const { logger } = require("../utils/helpers/logger.utils"); // Adjust path as needed

const redis = new Redis(); // Initialize Redis (default: localhost:6379)

redis.on("connect", () => {
  logger.info("✅ Redis connected successfully!");
});

redis.on("error", (err) => {
  logger.error("❌ Redis Error", { message: err.message, stack: err.stack });
});

module.exports = redis;
