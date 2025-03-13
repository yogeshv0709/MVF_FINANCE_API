const express = require("express");
const AuthController = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/auth.middleware");
const validate = require("../middleware/zod.middleware");
const {
  LoginSchema,
  changePasswordSchema,
  UserSchemaSendEmail,
  UserSchemaResetPassword,
  updateCompanyStaff,
} = require("../validators/user.validator");

const router = express.Router();

const authController = new AuthController();

router.route("/login").post(validate(LoginSchema), authController.login);
// router.route("/refresh").post(authController.refresh);

//! @get
router.route("/staffDetail").post(authMiddleware, authController.staffDetail);

router
  .route("/editstaff")
  .post(authMiddleware, validate(updateCompanyStaff), authController.editStaffDetail);

router
  .route("/changePassword")
  .post(authMiddleware, validate(changePasswordSchema), authController.changePassword);

// router.route("/logout").get(authMiddleware, authController.logout);

router.route("/resetToken").post(validate(UserSchemaSendEmail), authController.forgetPassword);

router
  .route("/verifyEmailToken")
  .post(validate(UserSchemaResetPassword), authController.resetPassword);

module.exports = router;
