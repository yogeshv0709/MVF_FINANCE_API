const server = require("./server.js");
const connectToMongoDB = require("./config/mongo.config.js");
const envVars = require("./config/server.config.js");
const { logger } = require("./utils/helpers/logger.utils.js");

const PORT = envVars.PORT || 3000;

server.listen(PORT, async () => {
  await connectToMongoDB();
  logger.info(`Server is on http://localhost:${PORT}`);
});

// Handle server errors
server.on("error", (err) => {
  logger.error("Server error", err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  logger.error("Uncaught exception", err);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  logger.error("Unhandled rejection", { reason, promise });
  process.exit(1);
});
