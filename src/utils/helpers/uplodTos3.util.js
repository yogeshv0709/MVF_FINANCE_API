const { PutObjectCommand } = require("@aws-sdk/client-s3"); // Use v3 for consistency with your s3.config
const { logger } = require("./logger.utils");
const envVars = require("../../config/server.config");
const s3Client = require("../../config/s3.config");
const fs = require("fs").promises;

const uploadToS3AndGetUrl = async (filePath, reportId) => {
  try {
    const fileContent = await fs.readFile(filePath);
    const timestamp = Date.now();
    const safeFileName = encodeURIComponent(`report_${reportId}.pdf`); // Consistent, URL-safe filename
    const fileKey = `reports/${reportId}/${timestamp}-${safeFileName}`; // e.g., "reports/123/1698765432-report_123.pdf"

    logger.info(`Uploading file to S3 as ${fileKey}`);

    const params = {
      Bucket: envVars.AWS_S3_BUCKET_NAME, // e.g., "shivarix"
      Key: fileKey,
      Body: fileContent,
      ContentType: "application/pdf",
    };

    const command = new PutObjectCommand(params);
    await s3Client.send(command);

    const persistentUrl = `https://${envVars.AWS_S3_BUCKET_NAME}.s3.${envVars.AWS_REGION}.amazonaws.com/${fileKey}`;
    logger.info("File uploaded to S3:", persistentUrl);
    return persistentUrl;
  } catch (error) {
    logger.error("Error uploading to S3:", error);
    throw new ApiError(500, "Failed to upload PDF to S3: " + error.message);
  }
};

module.exports = uploadToS3AndGetUrl;
