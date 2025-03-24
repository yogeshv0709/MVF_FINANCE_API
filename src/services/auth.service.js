const jwt = require("jsonwebtoken");
const jwtConfig = require("../config/jwt.config");
const ApiError = require("../errors/ApiErrors");
const { comparePassword, hashPassword } = require("../utils/helpers/password.util");
const CompanyModel = require("../models/Company.model");
const { userType, FRONTEND_URL } = require("../utils/constants/constant");
const RoleModel = require("../models/Role.model");
const { sendResetPasswordMail, sendUpdatePasswordMail } = require("../utils/helpers/email.util");
const UserModel = require("../models/User.model");
const crypto = require("crypto");
const { checkCompanyAccess } = require("../utils/authHelper");
require("../models/Permission.model");

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
    const refreshToken = jwt.sign(refreshTokenPayload, secret, refreshTokenOptions);

    return { accessToken, refreshToken };
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
    user.token = accessToken;
    await user.save();

    let name;
    if (user.type === userType.Admin) {
      name = "Admin";
    } else if (user.type === userType.RSVC) {
      name = "Franchise";
    } else {
      throw new ApiError(403, "Unauthorized");
    }

    if (user.type === userType.RSVC) {
      const company = await CompanyModel.findOne({ userId: user._id });
      if (company.blocked) {
        throw new ApiError(403, "company is blocked by admin");
      }
      if (company) {
        const staffId = company.frenchiseId;
        const blocked = company.blocked;
        const contact = company.contact;
        const roleId = await RoleModel.findOne({ name }).populate("isPermission");
        const { password: _, token: hideIt, ...rest } = user.toObject();
        const updatedRest = { ...rest, staffId, blocked, contact };

        return {
          accessToken,
          refreshToken,
          userId: updatedRest,
          roleId,
        };
      }
    } else if (user.type === userType.Admin) {
      const roleId = await RoleModel.findOne({ name }).populate("isPermission");
      const { password: _, token: hideIt, ...rest } = user.toObject();
      return {
        accessToken,
        refreshToken,
        userId: rest,
        roleId,
      };
    } else {
      throw new ApiError(403, "Unauthorized");
    }
  }

  async getAuthDetails(user) {
    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    let response;
    if (user.type === userType.RSVC) {
      response = CompanyModel.findOne({ userId: user.userId }).populate("group");
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
  async editStaffDetail(user, data) {
    const { frenchiseId, contact, name } = data;

    if (!user) {
      throw new ApiError(401, "Unauthorized");
    }
    const company = await CompanyModel.findOne({ frenchiseId });
    if (!company) {
      throw new ApiError(400, "No company found");
    }
    if (!checkCompanyAccess(user, company)) {
      throw new ApiError(403, "Access denied");
    }
    const response = await CompanyModel.findOneAndUpdate(
      { frenchiseId },
      { $set: { contact, name } },
      { new: true }
    );

    return response;
  }

  // async refreshToken(token) {
  //   const decoded = jwt.verify(token, jwtConfig.secret);
  //   const user = await this.userModel.findOne({
  //     _id: decoded.userId,
  //     refreshToken: token,
  //   });
  //   if (!user) throw new Error("Invalid refresh token");

  //   if (!user || user.refreshToken !== token) {
  //     throw new ApiError(401, "Invalid refresh token");
  //   }

  //   const { accessToken, refreshToken } = this.generateTokens(user);
  //   user.refreshToken = refreshToken;
  //   await user.save();
  //   return { accessToken, refreshToken };
  // }

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
      throw new ApiError(400, "New password must be different from old password");
    }

    const hashedNewPassword = await hashPassword(newPassword);
    user.password = hashedNewPassword;
    await user.save();
    return "Password changed successfully";
  }

  // async logout(userId) {
  //   await this.userModel.updateOne(
  //     { _id: userId },
  //     { $unset: { refreshToken: 1 } }
  //   );
  // }
  async forgotPassword(email) {
    const user = await UserModel.findOne({ email });
    if (!user) throw new ApiError(400, "User not found");

    // Generate a reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = new Date(Date.now() + 15 * 60 * 1000);
    await user.save();

    // /verify-forget-token/:id
    // const resetUrl = `${FRONTEND_URL}/api/v1/auth/reset-password?token=${resetToken}`;
    const resetUrl = `${FRONTEND_URL}/verify-forget-token/${resetToken}`;
    await sendResetPasswordMail(user.email, resetUrl);

    return "Reset password email sent";
  }

  async resetPassword(token, newPassword) {
    const user = await UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() }, // Check if token is not expired
    });

    if (!user) throw new ApiError(400, "Invalid or expired token");

    user.password = await hashPassword(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;
    await user.save();

    await sendUpdatePasswordMail(user.email);

    return "Password reset successful";
  }
}

module.exports = AuthService;
