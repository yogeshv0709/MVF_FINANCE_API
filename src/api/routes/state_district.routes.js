const express = require("express");
const stateController = require("../controller/state.controller");
const { z } = require("zod");
const { stateSchema } = require("../validators/company.validator");
const validate = require("../middleware/zod.middleware");

const router = express.Router();

const getAllDistrictSchema = z.object({
  stateId: stateSchema,
});

router.route("/getAllState").post(stateController.getAllState);

router
  .route("/getDistrictByStateId")
  .post(validate(getAllDistrictSchema), stateController.getAllDistrict);

module.exports = router;
