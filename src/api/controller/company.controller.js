const CompanyService = require("../../services/company.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

class CompanyController {
  static addCompany = asyncHandler(async (req, res) => {
    logger.info("Adding a new company", { body: req.body });
    const company = await CompanyService.addCompany(req.body);
    logger.info("Company added successfully", { company });
    res.status(200).json(new ApiResponse(200, company, "Company added successfully"));
  });

  static getCompany = asyncHandler(async (req, res) => {
    const { frenchiseId } = req.body;
    const user = req.user;
    logger.info("Fetching company details", { user, frenchiseId });
    const company = await CompanyService.getCompany(user, frenchiseId);
    logger.info("Company fetched successfully", { company });
    res.status(200).json(new ApiResponse(200, company, "Company fetched successfully"));
  });

  static updateCompany = asyncHandler(async (req, res) => {
    const updates = req.body;
    logger.info("Updating company details", { updates });
    const company = await CompanyService.updateCompany(updates);
    logger.info("Company updated successfully", { company });
    res.status(200).json(new ApiResponse(200, company, "Company updated successfully"));
  });

  static getCompanies = asyncHandler(async (req, res) => {
    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    logger.info("Fetching list of companies", { page, limit });
    const result = await CompanyService.getCompanies(page, limit);
    logger.info("Companies fetched successfully", { result });
    res.status(200).json(new ApiResponse(200, result, "Companies fetched successfully"));
  });
}

module.exports = CompanyController;
