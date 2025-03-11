const DashboardService = require("../../services/dashboard.service");
const { asyncHandler } = require("../../utils/asyncHandler");

const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboardStats = await DashboardService.getDashboardStats();

  res.status(200).json({
    code: 200,
    status: "success",
    ...dashboardStats,
  });
});

const getCompanyDashboard = asyncHandler(async (req, res) => {
  const { userId, type } = req.user;
  const dashboard = await DashboardService.getCompanyDashboardStats(userId, type);

  res.status(200).json({
    code: 200,
    stats: "success",
    ...dashboard,
  });
});

module.exports = { getAdminDashboard, getCompanyDashboard };
