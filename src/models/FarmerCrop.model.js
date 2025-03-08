const mongoose = require("mongoose");
const UserModel = require("./User.model");
const crypto = require("crypto");
const CounterModel = require("./Counter.model");
const CompanyModel = require("./Company.model");

const FarmerCropSchema = new mongoose.Schema(
  {
    farmerName: { type: String, required: true },
    contact: { type: String, required: true },
    email: { type: String },
    address: { type: String },
    adharNumber: { type: String },
    state: { type: mongoose.Schema.ObjectId, ref: "State", required: true },
    district: {
      type: mongoose.Schema.ObjectId,
      ref: "StateDistrict",
      required: true,
    },
    tehsil: { type: String },
    village: { type: String },
    pinCode: { type: String, required: true },

    cropName: { type: String, required: true },
    cropSeason: { type: String, required: true },
    year: { type: Number },
    sowingDate: { type: Date, required: true },
    approximateYield: { type: Number },

    fieldName: { type: String, required: true },
    area: { type: Number, required: true }, // Acres
    Latitude: { type: Number },
    Longitude: { type: Number },
    wkt: { type: String, required: true },

    companyId: {
      type: mongoose.Types.ObjectId,
      require: true,
      ref: "Company",
    },
    userId: { type: String },
    requestId: { type: String, unique: true },
    fieldId: { type: String, unique: true },
    enquiryType: { type: String },
    type: { type: String, default: "test" },
  },
  { timestamps: true }
);

FarmerCropSchema.pre("save", async function (next) {
  // Fetch the staffId from the User model before saving
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
    const company = await CompanyModel.findById(this.companyId);
    if (company && company.frenchiseId) {
      this.userId = company.frenchiseId; // Store `staffId` instead of ObjectId
    } else {
      return next(new Error("Invalid userId: No staffId found."));
    }
  } catch (error) {
    return next(error);
  }

  next();
});

module.exports = mongoose.model("Farmer", FarmerCropSchema);
