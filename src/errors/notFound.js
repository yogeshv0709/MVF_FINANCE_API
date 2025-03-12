const { logger } = require("../utils/helpers/logger.utils");

const notFound = (req, res, next) => {
  logger.warn("Route not found", { method: req.method, path: req.originalUrl });
  res.status(404).send("Route does not exist");
  next();
};

module.exports = notFound;
