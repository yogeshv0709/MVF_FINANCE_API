const { default: mongoose } = require("mongoose");
const ApiError = require("../errors/ApiErrors");
const Company = require("../models/Company.model");
const UserModel = require("../models/User.model");
const { checkCompanyAccess } = require("../utils/authHelper");
const { userType } = require("../utils/constant");
const sendPasswordMail = require("../utils/email.util");
const {
  generateStrongPassword,
  hashPassword,
} = require("../utils/password.util");

class CompanyService {
  static async addCompany(data) {
    const session = await mongoose.startSession(); // Start transaction
    session.startTransaction();

    try {
      const { email } = data;

      // Check if the email already exists
      const existingUser = await UserModel.findOne({ email }).session(session);
      if (existingUser) {
        throw new ApiError(400, "Email already exists");
      }

      // Generate and hash password
      const generatedPassword = await generateStrongPassword();
      console.log(generatedPassword); //TODO: REMOVE THIS
      const hashedPassword = await hashPassword(generatedPassword);

      // Create user
      const user = new UserModel({
        email,
        type: userType.RSVC,
        password: hashedPassword,
      });
      await user.save({ session });

      const company = new Company({ ...data, userId: user._id });
      await company.save({ session });

      await session.commitTransaction(); // Commit if everything is successful

      //send password
      try {
        await sendPasswordMail(email, generatedPassword);
      } catch (mailError) {
        console.error("Failed to send password email:", mailError);
      }

      return company;
    } catch (error) {
      await session.abortTransaction(); // Rollback in case of an error
      throw error;
    } finally {
      session.endSession();
    }
  }

  static async getCompanies(page = 1, limit = 10) {
    const skip = (page - 1) * limit;

    const companies = await Company.find().skip(skip).limit(limit);
    const totalCompanies = await Company.countDocuments();

    return {
      companies,
      currentPage: page,
      totalPages: Math.ceil(totalCompanies / limit),
      totalCompanies,
    };
  }

  static async updateCompany(companyId, updates) {
    const company = await Company.findById(companyId);
    if (!company) {
      throw new Error("Company not found");
    }

    Object.keys(updates).forEach((key) => {
      company[key] = updates[key];
    });

    await company.save();
    return company;
  }

  static async getCompanyById(user, companyId) {
    const company = await Company.findById(companyId);
    if (!checkCompanyAccess(user, company)) {
      throw new ApiError(403, "Unauthorized access");
    }
    if (!company) {
      throw new ApiError(404, "Company not found");
    }

    return company;
  }
}

module.exports = CompanyService;
