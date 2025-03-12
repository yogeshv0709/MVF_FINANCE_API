const mongoose = require("mongoose");
const envVars = require("./server.config");
const { logger } = require("../utils/helpers/logger.utils");

async function connectToMongoDB() {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    logger.info("Connected to MongoDB successfully!");
  } catch (error) {
    if (error instanceof Error) {
      logger.error("Error connecting to MongoDB", { message: error.message });
    } else {
      logger.error("An unknown error occurred while connecting to MongoDB", { error });
    }
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
