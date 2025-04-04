const multer = require("multer");
const multerS3 = require("multer-s3");
const envVars = require("../../config/server.config");
const s3Client = require("../../config/s3.config");
const { logger } = require("../../utils/helpers/logger.utils");

const fileFilter = (req, file, cb) => {
  const allowedTypes = [
    "image/jpeg",
    "image/png",
    "application/pdf",
    "image/svg+xml",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
    "application/vnd.ms-excel", // .xls
    "text/csv", // .csv
  ];

  if (allowedTypes.includes(file.mimetype)) {
    logger.info(`File type allowed: ${file.mimetype}`);
    cb(null, true);
  } else {
    logger.warn(`Invalid file type: ${file.mimetype}`);
    cb(new Error("Invalid file type"), false);
  }
};

const s3Storage = multerS3({
  s3: s3Client,
  bucket: envVars.AWS_S3_BUCKET_NAME,
  metadata: (req, file, cb) => {
    cb(null, { fieldName: file.fieldname });
  },
  key: (req, file, cb) => {
    const requestId = req.body.requestId || Date.now();
    const folder =
      {
        images: "images",
        weatherReport: "weatherReports",
        schedule_advisory1: "advisories",
        schedule_advisory2: "advisories",
        schedule_advisory3: "advisories",
      }[file.fieldname] || "misc";

    const safeFileName = encodeURIComponent(file.originalname);
    const fileKey = `${folder}/${requestId}/${Date.now()}-${safeFileName}`;
    logger.info(`Uploading file: ${file.originalname} to S3 as ${fileKey}`);
    cb(null, fileKey);
  },
});

const upload = multer({
  storage: s3Storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

module.exports = upload;
