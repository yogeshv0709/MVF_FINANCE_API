const mongoose = require("mongoose");
const ApiError = require("../errors/ApiErrors");
const Company = require("../models/Company.model");
const UserModel = require("../models/User.model");
const { userType } = require("../utils/constants/constant");
const { generateStrongPassword, hashPassword } = require("../utils/helpers/password.util");
const RoleModel = require("../models/Role.model");
const StateModel = require("../models/State.model");
const StateDistrict = require("../models/District.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { sendPasswordMail } = require("../utils/helpers/email.util");

class CompanyService {
  static async addCompany(data) {
    const session = await mongoose.startSession(); // Start transaction
    session.startTransaction();

    try {
      const { email, stateId, cityId, pincode } = data;

      // Check if the email already exists
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) {
        throw new ApiError(400, "Email already exists");
      }

      // Generate and hash password
      const generatedPassword = await generateStrongPassword();
      const hashedPassword = await hashPassword(generatedPassword);
      const roleId = await RoleModel.findOne({ roleId: "R1001" }); //Look at Role Model it's hardcoded
      // Create user
      const user = new UserModel({
        email,
        type: userType.RSVC,
        password: hashedPassword,
        isActive: true,
        roleId,
      });
      await user.save({ session });
      const state = await StateModel.findOne({ stateId });
      if (!state) {
        throw new ApiError("Please provide valid stateId");
      }
      const city = await StateDistrict.findOne({ districtId: cityId });
      if (!city) {
        throw new ApiError("Please provide valid cityId");
      }

      const company = new Company({
        ...data,
        userId: user._id,
        stateId: state._id,
        cityId: city._id,
        pinCode: pincode,
      });
      await company.save({ session });

      await session.commitTransaction();
      // send password
      await sendPasswordMail(email, generatedPassword);

      return company;
    } catch (error) {
      await session.abortTransaction(); // Rollback in case of an error
      throw new ApiError(400, error);
    } finally {
      session.endSession();
    }
  }

  static async getCompanies(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const companies = await Company.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("stateId cityId");

    return companies;
  }

  static async getCompany(user, frenchiseId) {
    const company = await Company.findOne({ frenchiseId })
      .populate("stateId", "stateId")
      .populate("cityId", "districtId");

    if (!company) {
      throw new ApiError(404, "Company not found");
    }
    if (!checkCompanyAccess(user, company)) {
      throw new ApiError(403, "Access denied");
    }

    const formattedCompany = {
      ...company.toObject(),
      stateId: company.stateId?.stateId,
      cityId: company.cityId?.districtId,
    };

    return formattedCompany;
  }

  static async updateCompany(updates) {
    const { stateId, cityId, pincode, frenchiseId } = updates;
    const company = await Company.findOne({ frenchiseId });
    if (!company) {
      throw new ApiError(404, "Company not found");
    }
    const state = await StateModel.findOne({ stateId });
    if (!state) {
      throw new ApiError(400, "no state");
    }
    const city = await StateDistrict.findOne({ districtId: cityId });
    if (!city) {
      throw new ApiError(400, "no city");
    }
    const finalUpdates = {
      ...updates,
      stateId: state._id,
      cityId: city._id,
      pinCode: pincode,
    };

    // Update the found company
    const updatedCompany = await Company.findByIdAndUpdate(company._id, finalUpdates, {
      new: true,
      runValidators: true,
    }).populate("stateId cityId");

    return updatedCompany;
  }
}

module.exports = CompanyService;
