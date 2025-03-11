// config/s3.js
const { S3Client } = require("@aws-sdk/client-s3");
const envVars = require("./server.config");

// Configure S3 Client
const s3Client = new S3Client({
  region: envVars.AWS_REGION,
  credentials: {
    accessKeyId: envVars.AWS_ACCESS_KEY_ID,
    secretAccessKey: envVars.AWS_SECRET_ACCESS_KEY,
  },
});

module.exports = s3Client;
