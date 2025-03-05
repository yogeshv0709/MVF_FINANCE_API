const DashboardService = require("../../services/DashboardService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

const getAdminDashboard = asyncHandler(async (req, res) => {
  const stats = await DashboardService.getDashboardStats();

  res.status(200).json(new ApiResponse(200, stats));
});

const getCompanyDashboard = asyncHandler(async (req, res) => {
  const { userId, type } = req.user;
  const stats = await DashboardService.getCompanyDashboardStats(userId, type);

  res.status(200).json(new ApiResponse(200, stats));
});

module.exports = { getAdminDashboard, getCompanyDashboard };
