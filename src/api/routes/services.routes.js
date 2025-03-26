const express = require("express");
const router = express.Router();
const validate = require("../middleware/zod.middleware");
const validation = require("../validators/services.validator");
const { authMiddleware } = require("../middleware/auth.middleware");
const isAdmin = require("../middleware/isAdmin.middleware");
const serviceController = require("../controller/services.controller");
const upload = require("../middleware/upload.middleware");
const s3ErrorHandler = require("../middleware/s3ErrorHandler.middleware");

router.post("/getAllService", authMiddleware, isAdmin, serviceController.allServices);

router.post(
  "/addService",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  s3ErrorHandler,
  validate(validation.serviceSchema),
  serviceController.addService
);

router.post(
  "/updateService",
  authMiddleware,
  isAdmin,
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  s3ErrorHandler,
  validate(validation.updateServiceSchema),
  serviceController.updateService
);

router.post(
  "/getServiceById",
  authMiddleware,
  isAdmin,
  validate(validation.getServiceSchema),
  serviceController.getService
);

module.exports = router;
