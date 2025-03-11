const ApiError = require("../../errors/ApiErrors");

const isCompany = (req, res, next) => {
  if (req.user?.type !== "RSVC") {
    throw new ApiError(403, "Access denied. company only.");
  }
  next();
};

module.exports = isCompany;
