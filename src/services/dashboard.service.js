const ApiError = require("../errors/ApiErrors");
const CompanyModel = require("../models/Company.model");
const Company = require("../models/Company.model");
const Farmer = require("../models/FarmerCrop.model");
const GroupModel = require("../models/Group.model");

class DashboardService {
  static async getDashboardStats() {
    const companyCount = await Company.countDocuments();
    const groupCount = await GroupModel.countDocuments();
    const pendingCompanyCount = await Company.countDocuments({
      status: "pending",
    });

    const farmerCount = await Farmer.countDocuments();
    // Aggregate companies by month
    const companiesByMonth = await Company.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);
    // Aggregate farmers by month
    const farmersByMonth = await Farmer.aggregate([
      {
        $group: {
          _id: { $month: "$createdAt" },
          count: { $sum: 1 },
        },
      },
    ]);

    const monthlyCompanies = Array(12).fill(0);
    const monthlyFarmers = Array(12).fill(0);

    // Populate the monthlyCompanies array with actual counts
    companiesByMonth.forEach((entry) => {
      monthlyCompanies[entry._id - 1] = entry.count;
    });

    // Populate the monthlyFarmers array with actual counts
    farmersByMonth.forEach((entry) => {
      monthlyFarmers[entry._id - 1] = entry.count;
    });

    return {
      franchise: {
        month: monthlyCompanies,
        total: companyCount,
        pending: pendingCompanyCount,
      },
      enquiry: {
        month: monthlyFarmers,
        total: farmerCount,
      },
      group: {
        total: groupCount,
      },
      user: {
        total: 0,
      },
    };
  }

  static async getCompanyDashboardStats(userId, type) {
    if (type === "RSVC") {
      //check this also
      const company = await CompanyModel.findOne({ userId });
      const farmerCount = await Farmer.countDocuments({
        companyId: company._id,
      });
      const companyId = company._id;
      const farmersByMonth = await Farmer.aggregate([
        { $match: { companyId: company._id } },
        {
          $group: {
            _id: { $month: "$createdAt" },
            count: { $sum: 1 },
          },
        },
        { $sort: { _id: 1 } },
      ]);

      const monthlyFarmers = Array(12).fill(0);
      farmersByMonth.forEach((entry) => {
        monthlyFarmers[entry._id - 1] = entry.count;
      });
      return {
        enquiry: {
          month: monthlyFarmers,
          total: farmerCount,
        },
        user: {
          total: 0,
        },
      };
    } else {
      throw new ApiError(403, "Access denied");
    }
  }
}

module.exports = DashboardService;
