const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: { type: String },
    email: { type: String, unique: true, require: true },
    password: { type: String },
    type: { type: String, enum: ["Admin", "RSVC", "user"], default: "user" },
    refreshToken: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
