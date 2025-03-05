const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    roleId: { type: String, unique: true, required: true }, // e.g., "R1000","R1001"
    name: { type: String, required: true }, // e.g., "Admin","Frenchise"
    isPermission: [{ type: mongoose.Schema.Types.ObjectId, ref: "Permission" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Role", RoleSchema);

// NAME => roleId
// Admin => R1000
// Franchise => R1001
