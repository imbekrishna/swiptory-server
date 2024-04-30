const expressWinston = require("express-winston");
const winston = require("winston");

const loggerOptions = {
  transports: [
    new winston.transports.Console({
      silent: process.env.NODE_ENV === "test",
    }),
  ],
  format: winston.format.combine(
    winston.format.json(),
    winston.format.prettyPrint(),
    winston.format.colorize({ all: true })
  ),
};

if (process.env.NODE_ENV === "production") {
  loggerOptions.meta = false;
}

const requestLogger = expressWinston.logger(loggerOptions);
const logger = winston.createLogger(loggerOptions);

module.exports = {
  info: logger.info.bind(logger),
  error: logger.error.bind(logger),
  requestLogger,
};
