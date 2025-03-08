const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const CompanyController = require("../controller/company.controller");
const validate = require("../middleware/zodValidate");
const companySchema = require("../validators/companyValidator");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/addFrencise",
  authMiddleware,
  isAdmin,
  // validate(companySchema.createCompanySchema),
  CompanyController.addCompany
);

router.post(
  "/getAllFrencise",
  authMiddleware,
  isAdmin,
  CompanyController.getCompanies
);

// @getFrenciseById=>frenchiseId=>post ask to sir this should be patch post work just pass it proper
router.post(
  "/getFrenciseById",
  authMiddleware,
  isAdmin,
  // validate(companySchema.updateCompanySchema),
  CompanyController.getCompany
);
//update company
router.post(
  "/editFrencise",
  authMiddleware,
  isAdmin,
  // validate(companySchema.updateCompanySchema),
  CompanyController.updateCompany
);

module.exports = router;
