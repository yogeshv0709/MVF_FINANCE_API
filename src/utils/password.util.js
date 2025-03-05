const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const saltRounds = 10;

const generateStrongPassword = async () => {
  const charset =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$";

  return Array.from(crypto.randomBytes(8))
    .map((byte) => charset[byte % charset.length])
    .join("");
};

const hashPassword = async (password) => {
  return bcrypt.hash(password, saltRounds);
};

const comparePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

module.exports = { hashPassword, comparePassword, generateStrongPassword };
