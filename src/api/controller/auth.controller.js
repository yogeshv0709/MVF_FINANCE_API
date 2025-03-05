const jwtConfig = require("../../config/jwt.config");
const ApiError = require("../../errors/ApiErrors");
const UserModel = require("../../models/User.model");
const AuthService = require("../../services/AuthService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { types, isDevelopment } = require("../../utils/constant");

class AuthController {
  setTokenCookie(res, tokenName, tokenValue, expiresIn) {
    res.cookie(tokenName, tokenValue, {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: "strict",
      signed: true,
      maxAge: expiresIn * 1000,
      expires: new Date(Date.now() + expiresIn * 1000),
    });
  }

  constructor() {
    this.authservice = new AuthService(UserModel);
  }

  register = asyncHandler(async (req, res) => {
    const { email, type } = req.body;

    if (!types.includes(type)) {
      throw new ApiError(400, "Invalid role");
    }

    const { accessToken, refreshToken, user } = await this.authservice.register(
      email,
      type
    );

    this.setTokenCookie(res, "accessToken", accessToken, jwtConfig.expiresIn);
    this.setTokenCookie(
      res,
      "refreshToken",
      refreshToken,
      jwtConfig.refreshExpiresIn
    );

    res
      .status(201)
      .json(new ApiResponse(200, { user }, "Registration Successful"));
  });

  login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const { user, accessToken, refreshToken } = await this.authservice.login(
      email,
      password
    );

    this.setTokenCookie(res, "accessToken", accessToken, jwtConfig.expiresIn);
    this.setTokenCookie(
      res,
      "refreshToken",
      refreshToken,
      jwtConfig.refreshExpiresIn
    );

    res.status(200).json(new ApiResponse(200, user, "Login Successful"));
  });

  staffDetail = asyncHandler(async (req, res) => {
    const user = req.user;

    const userDetails = await this.authservice.getAuthDetails(user);
    console.log(userDetails);
    res.status(200).json(new ApiResponse(200, userDetails));
  });

  refresh = asyncHandler(async (req, res) => {
    const token = req.signedCookies.refreshToken;
    const { accessToken, refreshToken } = await this.authservice.refreshToken(
      token
    );

    this.setTokenCookie(res, "accessToken", accessToken, jwtConfig.expiresIn);
    this.setTokenCookie(
      res,
      "refreshToken",
      refreshToken,
      jwtConfig.refreshExpiresIn
    );
    res.status(200).json(new ApiResponse(200, {}, "Token Refresh success"));
  });

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

  logout = asyncHandler(async (req, res) => {
    const id = req.user?.userId;
    await this.authservice.logout(id);

    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: "strict",
    });
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: !isDevelopment,
      sameSite: "strict",
    });

    res.status(200).json(new ApiResponse(200, {}, "Logged out successfully"));
  });
}

module.exports = AuthController;
