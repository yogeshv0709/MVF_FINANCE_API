const processDescriptions = (req, res, next) => {
  try {
    const descriptions = [];

    // Check if descriptions exist in req.body
    if (req.body.descriptions) {
      const descArray = Array.isArray(req.body.descriptions)
        ? req.body.descriptions
        : [req.body.descriptions];

      descArray.forEach((text, index) => {
        descriptions[index] = { imagedescription: text, images: null };
      });
    }

    // Attach files to corresponding descriptions
    if (req.files?.images) {
      req.files.images.forEach((file, index) => {
        if (!descriptions[index]) {
          descriptions[index] = { imagedescription: "", images: null };
        }
        descriptions[index].images = file.path; // Store file URL
      });
    }

    req.body.descriptions = descriptions;
    next();
  } catch (error) {
    return res.status(400).json({ message: "Invalid descriptions format" });
  }
};

module.exports = processDescriptions;
