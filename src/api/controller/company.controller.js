const CompanyService = require("../../services/CompanyService");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");

class CompanyController {
  static addCompany = asyncHandler(async (req, res) => {
    const company = await CompanyService.addCompany(req.body);
    res
      .status(201)
      .json(new ApiResponse(200, company, "Company added successfully"));
  });

  static updateCompany = asyncHandler(async (req, res) => {
    const { companyId } = req.params;
    const updates = req.body;

    const company = await CompanyService.updateCompany(companyId, updates);

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

  static getCompanyById = asyncHandler(async (req, res) => {
    const company = await CompanyService.getCompanyById(
      req.user,
      req.params.companyId
    );
    res
      .status(200)
      .json(new ApiResponse(200, company, "Company fetched successfully"));
  });
}

module.exports = CompanyController;
