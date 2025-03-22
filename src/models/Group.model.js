const mongoose = require("mongoose");
const CounterModel = require("./Counter.model");

const GroupSchema = new mongoose.Schema(
  {
    name: { type: String, unique: true, required: true, trim: true },
    description: { type: String, trim: true },
    blocked: { type: Boolean, default: false },
    groupId: { type: String, unique: true },
  },
  { timestamps: true }
);

// Auto-generate `groupId` before saving
GroupSchema.pre("save", async function (next) {
  try {
    if (!this.groupId) {
      const counter = await CounterModel.findOneAndUpdate(
        { name: "groupId" },
        { $inc: { value: 1 } },
        { new: true, upsert: true }
      );
      this.groupId = `MVF_GR_${1000 + counter.value}`;
    }
    next();
  } catch (error) {
    next(error);
  }
});

module.exports = mongoose.model("Group", GroupSchema);
