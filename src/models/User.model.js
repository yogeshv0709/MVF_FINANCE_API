const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, require: true },
    password: { type: String },
    type: { type: String, enum: ["Admin", "RSVC", "user"], default: "user" },
    refreshToken: { type: String },
    isActive: { type: String, default: false },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    token: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
