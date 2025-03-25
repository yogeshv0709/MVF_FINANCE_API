const Services = require("../../services/services.service");
const ApiResponse = require("../../utils/ApiResponse");
const { asyncHandler } = require("../../utils/asyncHandler");
const { logger } = require("../../utils/helpers/logger.utils");

const addService = asyncHandler(async (req, res) => {
  logger.info("Adding Service", { requestBody: req.body });
  const body = req.body;
  const files = req.files;
  const response = await Services.addService({ body, files });
  logger.info("Service Added success", response);
  res.status(200).json(new ApiResponse(200, response));
});

const updateService = asyncHandler(async (req, res) => {
  console.log(req.body.serviceId);
  console.log(req.files.serviceId);
  console.log(req.body);
  const body = req.body;
  logger.info("Update Service", { requestBody: req.body });
  const response = await Services.updateService({ body });
  logger.info("Service updated success", response);
  res.status(200).json(new ApiResponse(200, response));
});

const allServices = asyncHandler(async (req, res) => {
  logger.info("Getting all Service");
  const response = await Services.getAllService();
  logger.info("Al service fetched success", response);
  res.status(200).json(new ApiResponse(200, response));
});

const getService = asyncHandler(async (req, res) => {
  const body = req.body;
  logger.info("Get single Service", { requestBody: req.body });
  const response = await Services.getService({ body });
  logger.info("Get single Service success", response);
  res.status(200).json(new ApiResponse(200, response));
});

module.exports = {
  addService,
  updateService,
  allServices,
  getService,
};
