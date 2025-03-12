const DashboardService = require("../../services/dashboard.service");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

const getAdminDashboard = asyncHandler(async (req, res) => {
  logger.info("Fetching admin dashboard stats");
  const dashboardStats = await DashboardService.getDashboardStats();
  logger.info("Admin dashboard stats fetched", { dashboardStats });

  res.status(200).json({
    code: 200,
    status: "success",
    ...dashboardStats,
  });
});

const getCompanyDashboard = asyncHandler(async (req, res) => {
  const { userId, type } = req.user;
  logger.info("Fetching company dashboard stats", { userId, type });
  const dashboard = await DashboardService.getCompanyDashboardStats(userId, type);
  logger.info("Company dashboard stats fetched", { dashboard });

  res.status(200).json({
    code: 200,
    stats: "success",
    ...dashboard,
  });
});

module.exports = { getAdminDashboard, getCompanyDashboard };
