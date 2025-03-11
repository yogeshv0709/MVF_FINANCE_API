const mongoose = require("mongoose");
const envVars = require("./server.config");

async function connectToMongoDB() {
  try {
    await mongoose.connect(envVars.MONGO_URI);
    console.log("Connected to MongoDB successfully!");
  } catch (error) {
    if (error instanceof Error) {
      console.error("Error connecting to MongoDB:", error.message);
    } else {
      console.error("An unknown error occurred:", error);
    }
    process.exit(1);
  }
}

module.exports = connectToMongoDB;
