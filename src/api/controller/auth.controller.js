const jwtConfig = require("../../config/jwt.config");
const UserModel = require("../../models/User.model");
const AuthService = require("../../services/AuthService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { isDevelopment } = require("../../utils/constant");

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
    const { email, password } = req.body;
    const { userId, roleId, accessToken } = await this.authservice.login(
      email,
      password
    );
    this.setTokenCookie(res, "x_auth_token", accessToken, jwtConfig.expiresIn);

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
    const user = req.user;
    const userDetails = await this.authservice.getAuthDetails(user);
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
    const { oldPassword, newPassword } = req.body;
    const { userId } = req.user;
    const message = await this.authservice.changePassword(
      userId,
      oldPassword,
      newPassword
    );
    res.status(200).json(new ApiResponse(200, {}, message));
  });

  // logout = asyncHandler(async (req, res) => {
  //   const id = req.user?.userId;
  //   await this.authservice.logout(id);

  //   res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  // });
}

module.exports = AuthController;
