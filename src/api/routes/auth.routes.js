const express = require("express");
const AuthController = require("../controller/auth.controller");
const { authMiddleware } = require("../middleware/authMiddleware");
const validate = require("../middleware/zodValidate");
const {
  LoginSchema,
  changePasswordSchema,
} = require("../validators/user.validator");

const router = express.Router();

const authController = new AuthController();

router.route("/login").post(validate(LoginSchema), authController.login);
// router.route("/refresh").post(authController.refresh);

//! @get
router.route("/staffDetail").post(authMiddleware, authController.staffDetail);

router
  .route("/change-password")
  .post(
    authMiddleware,
    validate(changePasswordSchema),
    authController.changePassword
  );

// router.route("/logout").get(authMiddleware, authController.logout);

module.exports = router;
