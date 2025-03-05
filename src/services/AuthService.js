const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");
const ApiError = require("../errors/ApiErrors");
const {
  comparePassword,
  generateStrongPassword,
  hashPassword,
} = require("../utils/password.util");
const CompanyModel = require("../models/Company.model");
const { userType } = require("../utils/constant");

class AuthService {
  constructor(userModel) {
    this.userModel = userModel;
  }
  generateTokens(user) {
    const secret = jwtConfig.secret;

    const payload = { userId: user._id, email: user.email, type: user.type };
    const refreshTokenPayload = { userId: user._id.toString() };

    const accessTokenOptions = { expiresIn: jwtConfig.expiresIn };
    const refreshTokenOptions = { expiresIn: jwtConfig.refreshExpiresIn };

    const accessToken = jwt.sign(payload, secret, accessTokenOptions);
    const refreshToken = jwt.sign(
      refreshTokenPayload,
      secret,
      refreshTokenOptions
    );

    return { accessToken, refreshToken };
  }
  //!not used yet
  async register(email, type) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new ApiError(400, "Email already used");
    }
    const generatedPassword = await generateStrongPassword();
    console.log(generatedPassword);
    const hashedPassword = await hashPassword(generatedPassword);

    const user = new this.userModel({
      email,
      type,
      password: hashedPassword,
    });

    const { accessToken, refreshToken } = this.generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    return { accessToken, refreshToken, user: user.email };
  }

  async login(email, password) {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Invalid email or password");
    }

    const { accessToken, refreshToken } = this.generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();

    const { password: _, ...rest } = user.toObject();
    return { accessToken, refreshToken, user: rest };
  }

  async getAuthDetails(user) {
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    let response;
    if (user.type === userType.RSVC) {
      response = CompanyModel.findOne({ userId: user.userId });
    } else if (user.type === userType.Admin) {
      response = {
        _id: user.userId,
        name: "Admin",
        email: user.email,
        type: user.type,
      };
    }
    return response;
  }

  async refreshToken(token) {
    const decoded = jwt.verify(token, jwtConfig.secret);
    const user = await this.userModel.findOne({
      _id: decoded.userId,
      refreshToken: token,
    });
    if (!user) throw new Error("Invalid refresh token");

    if (!user || user.refreshToken !== token) {
      throw new ApiError(401, "Invalid refresh token");
    }

    const { accessToken, refreshToken } = this.generateTokens(user);
    user.refreshToken = refreshToken;
    await user.save();
    return { accessToken, refreshToken };
  }

  async changePassword(userId, oldPassword, newPassword) {
    const user = await this.userModel.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const isMatch = await comparePassword(oldPassword, user.password);
    if (!isMatch) {
      throw new ApiError(401, "Old password is incorrect");
    }
    if (oldPassword === newPassword) {
      throw new ApiError(
        400,
        "New password must be different from old password"
      );
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();
    return "Password changed successfully";
  }

  async logout(userId) {
    await this.userModel.updateOne(
      { _id: userId },
      { $unset: { refreshToken: 1 } }
    );
  }
}

module.exports = AuthService;
