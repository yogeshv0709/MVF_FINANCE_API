const CompanyService = require("../../services/CompanyService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

class CompanyController {
  static addCompany = asyncHandler(async (req, res) => {
    const company = await CompanyService.addCompany(req.body);
    res
      .status(200)
      .json(new ApiResponse(200, company, "Company added successfully"));
  });
  //get franchise
  static getCompany = asyncHandler(async (req, res) => {
    const { frenchiseId } = req.body;
    const user = req.user;
    const company = await CompanyService.getCompany(user, frenchiseId);
    res
      .status(200)
      .json(new ApiResponse(200, company, "Company fetched successfully"));
  });

  //update franchise
  static updateCompany = asyncHandler(async (req, res) => {
    const updates = req.body;
    const company = await CompanyService.updateCompany(updates);
    res
      .status(200)
      .json(new ApiResponse(200, company, "Company updated successfully"));
  });

  static getCompanies = asyncHandler(async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const result = await CompanyService.getCompanies(page, limit);
    res
      .status(200)
      .json(new ApiResponse(200, result, "Companies fetched successfully"));
  });
}

module.exports = CompanyController;
