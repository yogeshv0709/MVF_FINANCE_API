const express = require("express");
const CompanyController = require("../controller/company.controller");
const isAdmin = require("../middleware/isAdmin.middleware");
const validate = require("../middleware/zod.middleware");
const companySchema = require("../validators/company.validator");
const { authMiddleware } = require("../middleware/auth.middleware");

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
router.post("/getAllFrencise", authMiddleware, isAdmin, CompanyController.getCompanies);

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
