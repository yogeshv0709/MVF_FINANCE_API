const jwtConfig = require("../../config/jwt.config");
const UserModel = require("../../models/User.model");
const AuthService = require("../../services/auth.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { isDevelopment } = require("../../utils/constants/constant");
const { logger } = require("../../utils/helpers/logger.utils");

class AuthController {
  setTokenCookie(res, tokenName, tokenValue, expiresIn) {
    res.cookie(tokenName, tokenValue, {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: "none",
      signed: true,
      maxAge: expiresIn * 1000,
      expires: new Date(Date.now() + expiresIn * 1000),
    });
  }

  constructor() {
    this.authservice = new AuthService(UserModel);
  }

  login = asyncHandler(async (req, res) => {
    logger.info("Login attempt", { email: req.body.email });
    const { email, password } = req.body;
    const { userId, roleId, accessToken } = await this.authservice.login(email, password);
    this.setTokenCookie(res, "x_auth_token", accessToken, jwtConfig.expiresIn);

    logger.info("User logged in successfully", { userId: userId._id });
    res.status(200).json(
      new ApiResponse(200, {
        userId,
        token: accessToken,
        message: "User Verified",
        permission: { roleId },
      })
    );
  });

  staffDetail = asyncHandler(async (req, res) => {
    logger.info("Fetching staff details", { userId: req.user?.userId });
    const user = req.user;
    const userDetails = await this.authservice.getAuthDetails(user);
    res.status(200).json(new ApiResponse(200, userDetails));
  });

  editStaffDetail = asyncHandler(async (req, res) => {
    logger.info("Fetching staff details for edit", { userId: req.user?.userId });
    const user = req.user;
    const data = req.body;
    const userDetails = await this.authservice.editStaffDetail(user, data);
    logger.info("staff detail edit success", { userId: req.user?.userId });
    res.status(200).json(new ApiResponse(200, userDetails));
  });

  // refresh = asyncHandler(async (req, res) => {
  //   const token = req.signedCookies.refreshToken;
  //   const { accessToken, refreshToken } = await this.authservice.refreshToken(
  //     token
  //   );

  //   this.setTokenCookie(res, "accessToken", accessToken, jwtConfig.expiresIn);
  //   this.setTokenCookie(
  //     res,
  //     "refreshToken",
  //     refreshToken,
  //     jwtConfig.refreshExpiresIn
  //   );
  //   res.status(200).json(new ApiResponse(200, {}, "Token Refresh success"));
  // });

  changePassword = asyncHandler(async (req, res) => {
    logger.info("Password change attempt", { userId: req.user?.userId });
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.user;
    const message = await this.authservice.changePassword(userId, oldPassword, newPassword);
    logger.info("Password changed successfully", { userId });
    res.status(200).json(new ApiResponse(200, {}, message));
  });

  forgetPassword = asyncHandler(async (req, res) => {
    logger.info("Forget password request", { email: req.body.email });
    const { email } = req.body;
    const message = await this.authservice.forgotPassword(email);
    res.status(200).json(new ApiResponse(200, {}, message));
  });

  resetPassword = asyncHandler(async (req, res) => {
    logger.info("Reset password request", { token: req.body.token });

    const { token, newPassword } = req.body;
    const message = await this.authservice.resetPassword(token, newPassword);
    logger.info("Password reset successfully");
    res.status(200).json(new ApiResponse(200, {}, message));
  });

  // logout = asyncHandler(async (req, res) => {
  //   const id = req.user?.userId;
  //   await this.authservice.logout(id);

  //   res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  // });
}

module.exports = AuthController;
