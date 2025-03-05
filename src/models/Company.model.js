const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema(
  {
    companyName: { type: String },
    managerName: { type: String },
    address: { type: String },
    email: { type: String },
    contactNo: { type: Number },
    state: { type: String },
    district: { type: String },
    pinCode: { type: Number },
    IFSC: { type: String },
    block: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    userId: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
    //request id
  },
  { timestamps: true }
);

module.exports = mongoose.model("Company", CompanySchema);
