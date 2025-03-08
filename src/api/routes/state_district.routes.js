const express = require("express");
const {
  getAllState,
  getAllDistrict,
} = require("../controller/state.controller");

const router = express.Router();

router.route("/getAllState").post(getAllState);
router.route("/getDistrictByStateId").post(getAllDistrict);

module.exports = router;
