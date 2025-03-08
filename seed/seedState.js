const mongoose = require("mongoose");
const fs = require("fs");
const csvParser = require("csv-parser");
const StateModel = require("../src/models/State.model");

const insertData = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to MongoDB");

    const data = [];

    // Read and parse CSV
    await new Promise((resolve, reject) => {
      fs.createReadStream("/home/mr_yogesh/Downloads/state.csv")
        .pipe(csvParser())
        .on("data", (row) => {
          data.push({
            _id: row._id
              ? new mongoose.Types.ObjectId(row._id)
              : new mongoose.Types.ObjectId(), // Handle missing/invalid _id
            stateId: row.stateId || null,
            name: row.name || null,
          });
        })
        .on("end", resolve)
        .on("error", reject);
    });

    // Insert data into MongoDB
    await StateModel.insertMany(data, { ordered: false });
    console.log("Data inserted successfully");
  } catch (error) {
    console.error("Error in insertData:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed");
  }
};

// Run the function
insertData().catch((err) => console.error("Unhandled error:", err));
