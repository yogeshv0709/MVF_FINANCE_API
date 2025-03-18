const { DeleteObjectCommand } = require("@aws-sdk/client-s3");
const s3Client = require("../../config/s3.config");
const envVars = require("../../config/server.config");
const { logger } = require("./logger.utils");

// Extract S3 key from full S3 URL
const getS3KeyFromUrl = (url) => {
  try {
    const urlObj = new URL(url);
    // Remove the leading slash
    return urlObj.pathname.substring(1);
  } catch (error) {
    // If the URL is already in key format
    return url;
  }
};

// Delete a file from S3
const deleteFileFromS3 = async (fileUrl) => {
  if (!fileUrl) return true;
  const decodedKey = decodeURIComponent(fileKey);

  try {
    const key = getS3KeyFromUrl(fileUrl);
    const command = new DeleteObjectCommand({
      Bucket: envVars.AWS_S3_BUCKET_NAME,
      Key: decodedKey,
    });

    await s3Client.send(command);
    logger.info(`Successfully deleted file from S3: ${key}`);
    return true;
  } catch (error) {
    // console.error(");
    logger.error("Error deleting file from S3:", error);
    return false;
  }
};

module.exports = {
  deleteFileFromS3,
};
