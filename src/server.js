const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/ErrorHandler");
const cors = require("cors");
const envVars = require("./config/server.config");
const { constants } = require("./utils/constants/constant");

// @routes
const companyRoute = require("./api/routes/company.routes");
const farmerRoute = require("./api/routes/farmer.routes");
const reportRoute = require("./api/routes/report.routes");
const authRoute = require("./api/routes/auth.routes");
const dashboardRoute = require("./api/routes/dashboard.routes");
const stateRoute = require("./api/routes/state_district.routes");

const server = express();

server.use(helmet());
server.use(express.json({ limit: constants.JSON_LIMIT }));
server.use(cors());
server.use(cookieParser(envVars.COOKIE_SECRET));
server.use(express.urlencoded({ extended: true, limit: constants.JSON_LIMIT }));
server.use("/uploads", express.static("uploads"));

server.use("/api/v1", authRoute);
server.use("/api/v1", dashboardRoute);
server.use("/api/v1", companyRoute);
server.use("/api/v1", farmerRoute);
server.use("/api/v1", reportRoute);
server.use("/api/v1", stateRoute);

server.use(notFound);
server.use(errorHandler);

module.exports = server;
