const mongoose = require("mongoose");
const CounterModel = require("./Counter.model");

const CompanySchema = new mongoose.Schema(
  {
    name: { type: String },
    firmName: { type: String },
    frenchiseId: { type: String },
    address: { type: String },
    email: { type: String },
    contact: { type: Number },
    stateId: { type: mongoose.Schema.ObjectId, ref: "State", require: true },
    cityId: {
      type: mongoose.Schema.ObjectId,
      ref: "StateDistrict",
      require: true,
    },
    pinCode: { type: Number },
    IFSC: { type: String },
    blocked: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["pending", "accept", "rejected"],
      default: "pending",
    },
    userId: { type: mongoose.Types.ObjectId, require: true, ref: "User" },
    loanId: [],
    gstNumber: { type: String },
    firmtype: { type: String },
    tehsil: { type: String }, //
    village: { type: String }, //optional
  },
  { timestamps: true }
);

CompanySchema.pre("save", async function (next) {
  try {
    if (!this.frenchiseId) {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "frenchiseId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      this.frenchiseId = `FR${1000 + counter.value}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Company", CompanySchema);
