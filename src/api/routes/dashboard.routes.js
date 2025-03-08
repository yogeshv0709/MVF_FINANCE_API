const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {
  getAdminDashboard,
  getCompanyDashboard,
} = require("../controller/dashboard.controller");

const router = express.Router();

// @get admin dashboard
router.route("/dashboard").post(authMiddleware, isAdmin, getAdminDashboard);

// @get company dashboard
router.route("/franchiseDashboard").post(authMiddleware, getCompanyDashboard);

module.exports = router;
