const winston = require("winston");
const DailyRotateFile = require("winston-daily-rotate-file");
const path = require("path");
const { isDevelopment } = require("../constants/constant");
const fs = require("fs");
const morgan = require("morgan");

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json({ space: 2 })
);

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define logs directory at project root
const logsDir = path.join(__dirname, "../../../logs");

if (!fs.existsSync(logsDir)) {
  try {
    fs.mkdirSync(logsDir, { recursive: true });
  } catch (err) {
    console.error("Failed to create logs directory:", err);
  }
}

const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.printf(({ level, message, timestamp, ...metadata }) => {
    let msg = `[${timestamp}] ${level}: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata, null, 2)}`;
    }
    return msg;
  })
);

const transports = [
  new DailyRotateFile({
    level: "error",
    filename: path.join(logsDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "14d",
  }),
  new DailyRotateFile({
    level: "info",
    filename: path.join(logsDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    zippedArchive: true,
    maxSize: "20m",
    maxFiles: "30d",
  }),
  ...(isDevelopment
    ? [
        new winston.transports.Console({
          format: consoleFormat,
          handleRejections: true,
        }),
      ]
    : []),
];

const logger = winston.createLogger({
  levels: levels,
  level: isDevelopment ? "debug" : "info",
  format: logFormat,
  transports: transports,
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, "exceptions-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
    ...(isDevelopment
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),
  ],
  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(logsDir, "rejections-%DATE%.log"),
      datePattern: "YYYY-MM-DD",
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "30d",
    }),
    ...(isDevelopment
      ? [
          new winston.transports.Console({
            format: consoleFormat,
          }),
        ]
      : []),
  ],
  exitOnError: false,
});

const morganFormat = ":method :url :status :response-time ms - :res[content-length]";
const morganMiddleware = morgan(morganFormat, {
  stream: { write: (message) => logger.http(message.trim()) },
  immediate: false,
});

module.exports = { logger, morganMiddleware };
