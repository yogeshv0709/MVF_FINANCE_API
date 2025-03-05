const constants = {
  ENVIRONMENT_DEVELOPMENT: "development",
  MAX_LOG_FILE_SIZE_MB: 5 * 1024 * 1024,
  MAX_LOG_FILE: 5,
  REDIS_MAX_RETRIES: 10,
  JSON_LIMIT: "1mb",
};

const types = ["RSVC", "user"];

const userType = {
  RSVC: "RSVC",
  Admin: "Admin",
  User: "User",
};

const isDevelopment =
  process.env.NODE_ENV === constants.ENVIRONMENT_DEVELOPMENT;

const FRONTEND_URL = process.env.FRONTEND_URL;

//state id name
const INDIAN_STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Andaman and Nicobar Islands",
  "Chandigarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Lakshadweep",
  "Delhi",
  "Puducherry",
  "Ladakh",
  "Jammu and Kashmir",
];

module.exports = {
  constants,
  isDevelopment,
  FRONTEND_URL,
  types,
  userType,
  INDIAN_STATES,
};
