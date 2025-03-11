// utils/s3UrlGenerator.js
const { GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const envVars = require("../../config/server.config");
const s3Client = require("../../config/s3.config");

/**
 * Extracts S3 object key from a full S3 URL
 * @param {string} s3Url - Full S3 URL
 * @returns {string} Object key
 */
const extractS3Key = (s3Url) => {
  if (!s3Url) return null;

  // Remove the S3 bucket URL prefix to get just the key
  const bucketUrlPrefix = `https://shivarix.s3.ap-south-1.amazonaws.com/`;
  return s3Url.replace(bucketUrlPrefix, "");
};

/**
 * Generates a pre-signed URL for an S3 object
 * @param {string} s3Url - Full S3 URL of the object
 * @param {number} expiresIn - Expiration time in seconds (default: 3600 = 1 hour)
 * @returns {Promise<string>} Pre-signed URL
 */
const generatePresignedUrl = async (s3Url, expiresIn = 3600) => {
  if (!s3Url) return null;

  try {
    const objectKey = extractS3Key(s3Url);

    const command = new GetObjectCommand({
      Bucket: envVars.AWS_S3_BUCKET_NAME,
      Key: objectKey,
    });

    return await getSignedUrl(s3Client, command, { expiresIn });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    throw new Error("Failed to generate file access URL");
  }
};

module.exports = {
  generatePresignedUrl,
};
