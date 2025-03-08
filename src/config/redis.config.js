const Redis = require("ioredis");

const redis = new Redis(); // Initialize Redis (default: localhost:6379)

redis.on("connect", () => {
  console.log("✅ Redis connected successfully!");
});

redis.on("error", (err) => {
  console.error("❌ Redis Error:", err);
});

module.exports = redis;
