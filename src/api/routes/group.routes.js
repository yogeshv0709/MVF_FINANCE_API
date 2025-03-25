const express = require("express");
const router = express.Router();
const validation = require("../validators/group.validator");
const validate = require("../middleware/zod.middleware");
const { authMiddleware } = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");
const groupController = require("../controller/group.controller");

// Create a new group
router.post(
  "/addGroup",
  authMiddleware,
  isAdmin,
  validate(validation.createGroupSchema),
  groupController.create
);

// Update a group
router.post(
  "/updateGroup",
  authMiddleware,
  isAdmin,
  validate(validation.updateGroupSchema),
  groupController.update
);

router.post("/getAllGroup", authMiddleware, isAdmin, groupController.fetchAll);

router.post(
  "/getGroup",
  authMiddleware,
  isAdmin,
  validate(validation.getGroupSchema),
  groupController.fetch
);

module.exports = router;
