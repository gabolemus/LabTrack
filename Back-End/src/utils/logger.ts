import { addColors, createLogger, format, transports } from "winston";
import env from "./env";

const maxFileSize = env.logs.maxFileSizeMB * 1024 * 1024; // Max size of each log file in bytes.
const maxFiles = env.logs.maxFiles; // Max number of log files.

// Logger transport options
const options = {
  console: {
    handleExceptions: true,
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      format.colorize(),
      format.timestamp({ format: "HH:mm:ss" }),
      format.printf((info) => `[${info.level}] [90m${info.timestamp}[39m ${info.message}`),
    ),
  },
  logFile: {
    maxsize: maxFileSize,
    maxFiles,
    format: format.combine(
      format((info) => {
        info.level = info.level.toUpperCase();
        return info;
      })(),
      format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
      format.printf((info) => `[${info.level}] ${info.timestamp} ${info.message}`),
    ),
  },
};

const logger = createLogger({
  level: "debug",
  transports: [new transports.Console(options.console), new transports.File({ filename: "logs/labtrack-backend.log", ...options.logFile })],
});

addColors({
  info: "cyan",
  warn: "yellow",
  error: "red",
  debug: "green",
});

export default logger;
