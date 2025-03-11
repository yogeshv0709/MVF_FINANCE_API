// middleware/s3ErrorHandler.js
const s3ErrorHandler = (err, req, res, next) => {
  if (err && err.name === "MulterError") {
    return res.status(400).json({
      success: false,
      message: `Upload error: ${err.message}`,
    });
  } else if (err) {
    console.error("S3 Upload Error:", err);
    return res.status(500).json({
      success: false,
      message: "File upload failed",
    });
  }
  next();
};

module.exports = s3ErrorHandler;
