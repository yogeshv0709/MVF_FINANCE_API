const mongoose = require("mongoose");

const StateDistrictSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: true },
  stateId: { type: String, required: true },
  districtId: { type: String, required: true },
  name: { type: String, required: true },
  districtCode: { type: String, default: null },
});

const StateDistrict = mongoose.model("StateDistrict", StateDistrictSchema);
module.exports = StateDistrict;
