const ApiError = require("../../errors/ApiErrors");
const { userType } = require("../../utils/constants/constant");

const isAdmin = (req, res, next) => {
  if (req.user?.type !== userType.Admin) {
    throw new ApiError(403, "Access denied. Admins only.");
  }
  next();
};

module.exports = isAdmin;
