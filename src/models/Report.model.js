const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    images: [
      {
        images: { type: String }, // Image URL
        imagedescription: { type: String, trim: true }, // Description
      },
    ],
    weatherReport: { type: String }, // File URL for Weather Forecast
    excel: { type: String }, // excel

    schedule_advisory1: { type: String },
    schedule_advisory2: { type: String },

    alert_notifications: { type: String, required: true, trim: true },
    farmerId: { type: mongoose.Schema.ObjectId, ref: "Farmer", required: true },
    requestId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
