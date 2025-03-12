const jwt = require("jsonwebtoken");
const jwtConfig = require("../../config/jwt.config");
const { logger } = require("../../utils/helpers/logger.utils");

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      logger.warn("Unauthorized access attempt: Token missing");
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      logger.warn("Unauthorized access attempt: Token extraction failed");
      return res.status(401).json({ message: "Unauthorized: Token missing" });
    }

    const decoded = jwt.verify(token, jwtConfig.secret);
    logger.info("User authenticated successfully", { userId: decoded.userId });
    req.user = decoded;
    next();
  } catch (error) {
    logger.error("Invalid token", { error: error.message });
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = { jwt, authMiddleware };
