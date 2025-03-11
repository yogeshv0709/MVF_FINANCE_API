const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, require: true, trim: true },
    password: { type: String, trim: true },
    type: { type: String, enum: ["Admin", "RSVC", "user"], default: "user" },
    refreshToken: { type: String },
    isActive: { type: String, default: false },
    roleId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    token: { type: String },
    resetPasswordToken: { type: String, default: null },
    resetPasswordExpires: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
