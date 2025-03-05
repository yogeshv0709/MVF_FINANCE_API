const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.signedCookies.accessToken;

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
    const decoded = jwt.verify(token, jwtConfig.secret);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { jwt, authMiddleware };
