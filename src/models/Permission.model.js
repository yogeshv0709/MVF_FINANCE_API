const mongoose = require("mongoose");

const PermissionModal = new mongoose.Schema({
  Module: { type: String, required: true },
  Create: { type: Boolean, default: false },
  Read: { type: Boolean, default: false },
  Update: { type: Boolean, default: false },
  Delete: { type: Boolean, default: false },
});

module.exports = mongoose.model("Permission", PermissionModal);
