const ApiError = require("../../errors/ApiErrors");

const authUPLkey = (req, res, next) => {
  const providedKey = req.headers["authkey"];

  if (!providedKey) {
    throw new ApiError(401, "Authkey is missing");
  }

  if (providedKey !== process.env.UPL_ACCESS_KEY) {
    throw new ApiError(403, "Invalid authkey");
  }

  next();
};

module.exports = authUPLkey;
