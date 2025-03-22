const { userType } = require("./constants/constant");

const checkCompanyAccess = (user, company) => {
  if (!user) return false;
  const isAdmin = user.type === userType.Admin;
  const isOwner = company?.userId?.toString() === user.userId;

  return isAdmin || isOwner;
};

module.exports = { checkCompanyAccess };
