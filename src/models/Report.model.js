const mongoose = require("mongoose");

const ReportSchema = new mongoose.Schema(
  {
    images: [
      {
        images: { type: String }, // Image URL
        imagedescription: { type: String }, // Description
      },
    ],
    weatherReport: { type: String }, // File URL for Weather Forecast
    excel: { type: String }, // excel

    alert_notifications: { type: String, required: true },
    farmerId: { type: mongoose.Schema.ObjectId, ref: "Farmer", required: true },
    requestId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
