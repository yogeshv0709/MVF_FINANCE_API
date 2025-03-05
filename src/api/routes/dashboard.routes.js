const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/isAdmin");
const {
  getAdminDashboard,
  getCompanyDashboard,
} = require("../controller/dashboard.controller");

const router = express.Router();

router.route("/dashboard").get(authMiddleware, isAdmin, getAdminDashboard);
router.route("/franchiseDashboard").get(authMiddleware, getCompanyDashboard);

module.exports = router;
