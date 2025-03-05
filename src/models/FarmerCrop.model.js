const mongoose = require("mongoose");

const FarmerCropSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    email: { type: String },
    address: { type: String, required: true },
    aadharNumber: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    tehsil: { type: String },
    village: { type: String },
    pinCode: { type: String, required: true },

    cropName: { type: String, required: true },
    cropSeason: { type: String, required: true },
    seasonYear: { type: Number, required: true },
    sowingDate: { type: Date, required: true },
    approximateYield: { type: Number },

    fieldName: { type: String, required: true },
    area: { type: Number, required: true }, // Acres
    filedLatitude: { type: Number },
    fieldLongitude: { type: Number },
    fieldWktData: { type: String, required: true },

    userId: { type: mongoose.Types.ObjectId, require: true, ref: "Company" },
    //add unique requestID
    //add unique fieldId
  },
  { timestamps: true }
);

module.exports = mongoose.model("Farmer", FarmerCropSchema);
