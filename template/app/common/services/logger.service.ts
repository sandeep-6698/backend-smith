import winston from "winston";

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    process.env.NODE_ENV === "production"
      ? winston.format.json()
      : winston.format.combine(winston.format.colorize(), winston.format.printf(({ timestamp, level, message, stack }) => {
        return `${timestamp} [${level}] ${stack ?? message}`;
      }))
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
