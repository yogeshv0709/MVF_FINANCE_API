const ApiError = require("../errors/ApiErrors");
const Service = require("../models/Services.model");
const { logger } = require("../utils/helpers/logger.utils");
const { deleteFileFromS3 } = require("../utils/helpers/s3Fileops");

class Services {
  async addService({ body, files }) {
    const { name, description, features, active, discountPercentage, basePrice } = body;
    const getFileUrl = (fieldName) => (files[fieldName] ? files[fieldName][0].location : null);

    const imageUrl = getFileUrl("image");
    const coverImageUrl = getFileUrl("coverImage");

    const existingService = await Service.findOne({ name });
    if (existingService) {
      throw new ApiError(409, "Service with this name already exists");
    }
    const newService = new Service({
      name,
      description,
      features,
      active,
      basePrice,
      discountPercentage,
      image: imageUrl,
      coverImage: coverImageUrl,
    });

    const savedService = await newService.save();
    logger.info(`New service created: ${savedService.name}`);
    return savedService;
  }

  async updateService({ body, files }) {
    const { serviceId, ...updateData } = body;

    if (!serviceId) {
      throw new ApiError(400, "Service ID is required");
    }

    // Check for duplicate name
    if (updateData.name) {
      const existingServiceWithName = await Service.findOne({
        name: updateData.name,
        _id: { $ne: serviceId },
      });

      if (existingServiceWithName) {
        throw new ApiError(409, "Service with this name already exists");
      }
    }

    // Find the service first
    const service = await Service.findById(serviceId);

    if (!service) {
      throw new ApiError(404, "Service not found");
    }

    // Handle image updates
    try {
      if (files?.image) {
        if (service.image) {
          await deleteFileFromS3(service.image);
        }
        service.image = files.image[0].location;
      }

      if (files?.coverImage) {
        if (service.coverImage) {
          await deleteFileFromS3(service.coverImage);
        }
        service.coverImage = files.coverImage[0].location;
      }
    } catch (error) {
      logger.error(`Image update failed: ${error.message}`);
      throw new ApiError(500, "Failed to update images");
    }

    // Update each field individually to trigger hooks
    Object.keys(updateData).forEach((key) => {
      service[key] = updateData[key];
    });

    const updatedService = await service.save();

    logger.info(`Service updated: ${updatedService.name}`);
    return updatedService;
  }

  async getAllService() {
    const services = await Service.find().sort({ createdAt: -1 });
    return services;
  }

  async getService({ body }) {
    const { serviceId } = body;

    const service = await Service.findById(serviceId);

    if (!service) {
      throw new ApiError(404, "Service not found");
    }
    return service;
  }
}

module.exports = new Services();
