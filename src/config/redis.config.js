const Redis = require("ioredis");

const redis = new Redis(); // Initialize Redis (default: localhost:6379)

module.exports = redis;
