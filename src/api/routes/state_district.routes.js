const express = require("express");
const {
  getAllState,
  getAllDistrict,
} = require("../controller/state.controller");
const { z } = require("zod");
const { stateSchema } = require("../validators/companyValidator");
const validate = require("../middleware/zodValidate");

const router = express.Router();

const getAllDistrictSchema = z.object({
  stateId: stateSchema,
});

router.route("/getAllState").post(getAllState);
router
  .route("/getDistrictByStateId")
  .post(validate(getAllDistrictSchema), getAllDistrict);

module.exports = router;
