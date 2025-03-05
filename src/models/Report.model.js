const mongoose = require("mongoose");
const crypto = require("crypto");

const ReportSchema = new mongoose.Schema(
  {
    images: [
      {
        images: { type: String, required: true }, // Image URL
        imagedescription: { type: String, required: true }, // Description
      },
    ],
    weatherReport: { type: String }, // File URL for Weather Forecast
    otherReportFile: { type: String }, // File URL for Other Reports

    alert_notifications: { type: String, required: true },
    farmerId: { type: mongoose.Schema.ObjectId, ref: "Farmer", required: true },
    requestId: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Report", ReportSchema);
