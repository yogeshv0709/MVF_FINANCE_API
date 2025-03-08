const processDescriptions = (req, res, next) => {
  try {
    const descriptions = [];

    // Check if descriptions exist in req.body
    if (req.body.imageDescriptions) {
      const descArray = Array.isArray(req.body.imageDescriptions)
        ? req.body.imageDescriptions
        : [req.body.descriptions];

      descArray.forEach((text, index) => {
        descriptions[index] = { imageDescriptions: text, images: null };
      });
    }

    // Attach files to corresponding descriptions
    if (req.files?.images) {
      req.files.images.forEach((file, index) => {
        if (!descriptions[index]) {
          descriptions[index] = { imageDescriptions: "", images: null };
        }
        descriptions[index].images = file.path; // Store file URL
      });
    }

    req.body.imageDescriptions = descriptions;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid descriptions format" });
  }
};

module.exports = processDescriptions;
