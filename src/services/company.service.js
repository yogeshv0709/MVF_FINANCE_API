const mongoose = require("mongoose");
const ApiError = require("../errors/ApiErrors");
const Company = require("../models/Company.model");
const UserModel = require("../models/User.model");
const { userType } = require("../utils/constants/constant");
const { generateStrongPassword, hashPassword } = require("../utils/helpers/password.util");
const RoleModel = require("../models/Role.model");
const StateModel = require("../models/State.model");
const DistrictModel = require("../models/District.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { sendPasswordMail } = require("../utils/helpers/email.util");
const GroupModel = require("../models/Group.model");

class CompanyService {
  static async addCompany(data) {
    const session = await mongoose.startSession(); // Start transaction
    session.startTransaction();

    try {
      const { email, stateId, cityId, pincode, groupId } = data;

      //Check if group is blocked
      const group = await GroupModel.findOne({ _id: groupId }).session(session);

      if (group.blocked) throw new ApiError("Group is blocked");

      // Check if the email already exists
      const existingUser = await UserModel.findOne({ email }).session(session);

      if (existingUser) {
        throw new ApiError(400, "Email already exists");
      }

      // Generate and hash password
      const generatedPassword = await generateStrongPassword();
      console.log(generatedPassword);
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
      const city = await DistrictModel.findOne({ districtId: cityId });
      if (!city) {
        throw new ApiError("Please provide valid cityId");
      }

      const company = new Company({
        ...data,
        userId: user._id,
        stateId: state._id,
        cityId: city._id,
        pinCode: pincode,
        group: groupId,
      });
      await company.save({ session });

      await session.commitTransaction();
      // send password
      //TODO:change this in production send Mail not in development
      // await sendPasswordMail(email, generatedPassword);

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
      .populate("stateId cityId")
      .populate("group");

    return companies;
  }

  static async getCompany(user, frenchiseId) {
    const company = await Company.findOne({ frenchiseId })
      .populate("stateId", "stateId")
      .populate("cityId", "districtId")
      .populate("group");

    if (!company) {
      throw new ApiError(404, "Company not found");
    }
    if (company.group.blocked) {
      throw new ApiError(403, "Company is blocked by Admin");
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
    const session = await mongoose.startSession(); // Start transaction
    session.startTransaction();
    try {
      const { stateId, cityId, pincode, frenchiseId, groupId } = updates;

      const group = await GroupModel.findOne({ _id: groupId }).session(session);

      if (group.blocked) throw new ApiError("Group is blocked");

      if (!group) throw new ApiError(404, "No group Found");

      const company = await Company.findOne({ frenchiseId }).session(session);

      if (!company) {
        throw new ApiError(404, "Company not found");
      }
      const state = await StateModel.findOne({ stateId });
      if (!state) {
        throw new ApiError(400, "No state Found");
      }
      const city = await DistrictModel.findOne({ districtId: cityId });
      if (!city) {
        throw new ApiError(400, "No city Found");
      }
      // const group = await GroupModel.findById({ _id: groupId });

      const finalUpdates = {
        ...updates,
        stateId: state._id,
        cityId: city._id,
        pinCode: pincode,
        group: groupId,
      };

      // Update the found company
      const updatedCompany = await Company.findByIdAndUpdate(company._id, finalUpdates, {
        new: true,
        runValidators: true,
      })
        .populate("stateId cityId")
        .populate("group");

      return updatedCompany;
    } catch (error) {
      await session.abortTransaction(); // Rollback in case of an error
      throw new ApiError(400, error);
    } finally {
      session.endSession();
    }
  }
}

module.exports = CompanyService;
