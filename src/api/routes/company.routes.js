const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const CompanyController = require("../controller/company.controller");
const validate = require("../middleware/zodValidate");
const companySchema = require("../validators/companyValidator");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

//@post @admin Add company
router.post(
  "/addFrencise",
  authMiddleware,
  isAdmin,
  validate(companySchema.createCompanySchema),
  CompanyController.addCompany
);
// @get @admin =>get all companies
router.post(
  "/getAllFrencise",
  authMiddleware,
  isAdmin,
  CompanyController.getCompanies
);

//@get @admin or @own company => get company
router.post(
  "/getFrenciseById",
  authMiddleware,
  validate(companySchema.getCompanySchema),
  CompanyController.getCompany
);

//@patch @admin => update company
router.post(
  "/editFrencise",
  authMiddleware,
  isAdmin,
  validate(companySchema.updateCompanySchema),
  CompanyController.updateCompany
);

module.exports = router;
