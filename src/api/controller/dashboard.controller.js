const DashboardService = require("../../services/DashboardService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

const getAdminDashboard = asyncHandler(async (req, res) => {
  const dashboardStats = await DashboardService.getDashboardStats();

  // res.status(200).json(new ApiResponse(200, { franchise, enquiry, total }));
  res.status(200).json({
    code: 200,
    status: "success",
    ...dashboardStats, // Spread the stats directly without "data"
  });
});

const getCompanyDashboard = asyncHandler(async (req, res) => {
  const { userId, type } = req.user;
  const dashboard = await DashboardService.getCompanyDashboardStats(
    userId,
    type
  );

  // res.status(200).json(new ApiResponse(200, stats));
  res.status(200).json({
    code: 200,
    stats: "success",
    ...dashboard,
  });
});

module.exports = { getAdminDashboard, getCompanyDashboard };
