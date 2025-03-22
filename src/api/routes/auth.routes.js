const express = require("express");
const AuthController = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const validate = require("../middleware/zod.middleware");
const validation = require("../validators/user.validator");

const router = express.Router();

const authController = new AuthController();

router.route("/login").post(validate(validation.LoginSchema), authController.login);
// router.route("/refresh").post(authController.refresh);

router.route("/staffDetail").post(authMiddleware, authController.staffDetail);

router
  .route("/editstaff")
  .post(authMiddleware, validate(validation.updateCompanyStaff), authController.editStaffDetail);

router
  .route("/changePassword")
  .post(authMiddleware, validate(validation.changePasswordSchema), authController.changePassword);

// router.route("/logout").get(authMiddleware, authController.logout);

router
  .route("/resetToken")
  .post(validate(validation.UserSchemaSendEmail), authController.forgetPassword);

router
  .route("/verifyEmailToken")
  .post(validate(validation.UserSchemaResetPassword), authController.resetPassword);

module.exports = router;
