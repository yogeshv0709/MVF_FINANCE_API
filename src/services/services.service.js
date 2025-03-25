const ApiError = require("../errors/ApiErrors");
const Service = require("../models/Services.model");
const { logger } = require("../utils/helpers/logger.utils");

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
  async updateService({ body }) {
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
