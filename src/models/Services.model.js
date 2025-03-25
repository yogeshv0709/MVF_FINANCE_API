const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    features: {
      type: String,
      trim: true,
    },
    basePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      trim: true,
    },
    coverImage: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    calculatedPrice: {
      type: Number,
      default: function () {
        return this.basePrice * (1 - this.discountPercentage / 100);
      },
    },
  },
  { timestamps: true }
);

ServiceSchema.pre("save", function (next) {
  if (this.isModified("basePrice") || this.isModified("discountPercentage")) {
    this.calculatedPrice = this.basePrice * (1 - this.discountPercentage / 100);
  }
  next();
});

const Service = mongoose.model("Service", ServiceSchema);

module.exports = Service;
