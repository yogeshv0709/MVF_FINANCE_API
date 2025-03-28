const mongoose = require("mongoose");
const crypto = require("crypto");
const CounterModel = require("./Counter.model");
const CompanyModel = require("./Company.model");

const FarmerCropSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true, trim: true },
    contact: { type: String, required: true, trim: true },
    email: { type: String, trim: true },
    address: { type: String, trim: true },
    adharNumber: { type: String, trim: true },
    state: { type: mongoose.Schema.ObjectId, ref: "State", required: true },
    district: {
      type: mongoose.Schema.ObjectId,
      ref: "District",
      required: true,
    },
    tehsil: { type: String, trim: true },
    village: { type: String, trim: true },
    pinCode: { type: String, required: true, trim: true },

    cropName: { type: String, required: true, trim: true },
    cropSeason: { type: String, required: true, trim: true },
    year: { type: Number, required: true },
    sowingDate: { type: Date, required: true },
    approximateYield: { type: Number },

    fieldName: { type: String, trim: true },
    area: { type: Number, required: true }, // Acres
    Latitude: { type: Number },
    Longitude: { type: Number },
    wkt: { type: String, required: true, trim: true },

    companyId: {
      type: mongoose.Types.ObjectId,
      ref: "Company",
    },
    userId: { type: String },
    requestId: { type: String, unique: true },
    fieldId: { type: String, unique: true },
    enquiryType: { type: String, trim: true },
    type: { type: String, default: "test" },

    status: { type: String, enum: ["pending", "accept"], default: "pending" },
    lastReportDate: { type: Date, default: null },
    prevCrop: { type: String },
  },
  { timestamps: true }
);

FarmerCropSchema.pre("save", async function (next) {
  try {
    if (!this.requestId) {
      this.requestId = crypto.randomUUID(); // Generate unique requestId
    }

    if (!this.fieldId) {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "fieldId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      this.fieldId = `FIELD_${1000 + counter.value}`;
    }

    // Only fetch userId if it's missing
    if (!this.userId) {
      const company = await CompanyModel.findById(this.companyId);
      if (company && company.frenchiseId) {
        this.userId = company.frenchiseId;
      } else {
        return next(new Error("Invalid userId: No frenchiseId found."));
      }
    }
  } catch (error) {
    return next(error);
  }

  next();
});

module.exports = mongoose.model("Farmer", FarmerCropSchema);
