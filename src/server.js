const express = require("express");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const notFound = require("./errors/notFound");
const errorHandler = require("./errors/ErrorHandler");
const cors = require("cors");
const envVars = require("./config/server.config");
const { constants } = require("./utils/constants/constant");
const { morganMiddleware } = require("./utils/helpers/logger.utils");

// @routes
const Routes = require("./api/routes/index.routes");

const server = express();

server.use(helmet());
server.use(express.json({ limit: constants.JSON_LIMIT }));
server.use(cors());
server.use(cookieParser(envVars.COOKIE_SECRET));
server.use(morganMiddleware);

server.use(express.urlencoded({ extended: true, limit: constants.JSON_LIMIT }));

server.use("/api/v1", Routes.authRoute);
server.use("/api/v1", Routes.groupRoute);
server.use("/api/v1", Routes.dashboardRoute);
server.use("/api/v1", Routes.companyRoute);
server.use("/api/v1", Routes.farmerRoute);
server.use("/api/v1", Routes.reportRoute);
server.use("/api/v1", Routes.uplRoute);
server.use("/api/v1", Routes.stateAndDistrictRoute);
server.use("/api/v1", Routes.servicesRoute);

server.use(notFound);
server.use(errorHandler);

module.exports = server;
