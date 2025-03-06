const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");

const authMiddleware = async (req, res, next) => {
  try {
    const tokenCookie = req.signedCookies.x_auth_token;
    // console.log(tokenCookie);
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
    const token = authHeader.split(" ")[1];
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
