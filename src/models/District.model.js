const mongoose = require("mongoose");

const DistrictSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  stateId: { type: String, required: true },
  districtId: { type: String, required: true },
  name: { type: String, required: true },
  districtCode: { type: String, default: null },
});

const Districts = mongoose.model("District", DistrictSchema);
module.exports = Districts;
