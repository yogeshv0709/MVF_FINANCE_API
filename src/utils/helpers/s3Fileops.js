// utils/s3FileOps.js
const s3 = require("../config/s3");

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
  if (!fileUrl) return;

  try {
    const key = getS3KeyFromUrl(fileUrl);

    await s3
      .deleteObject({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: key,
      })
      .promise();

    console.log(`Successfully deleted file from S3: ${key}`);
    return true;
  } catch (error) {
    console.error("Error deleting file from S3:", error);
    return false;
  }
};

module.exports = {
  deleteFileFromS3,
};
