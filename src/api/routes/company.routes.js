const express = require("express");
const isAdmin = require("../middleware/isAdmin");
const CompanyController = require("../controller/company.controller");
const validate = require("../middleware/zodValidate");
const companySchema = require("../validators/companyValidator");
const { authMiddleware } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/addFranchise",
  authMiddleware,
  isAdmin,
  validate(companySchema.createCompanySchema),
  CompanyController.addCompany
);

router.get(
  "/getAllFranchise",
  authMiddleware,
  isAdmin,
  CompanyController.getCompanies
);

router.patch(
  "/:companyId",
  authMiddleware,
  isAdmin,
  validate(companySchema.updateCompanySchema),
  CompanyController.updateCompany
);

router.get("/:companyId", authMiddleware, CompanyController.getCompanyById);

module.exports = router;
