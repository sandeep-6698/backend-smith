import { type ErrorRequestHandler } from "express";
import { AppError } from "../errors";
import { type ErrorResponse } from "../helper/response.hepler";
import logger from "../services/logger.service";

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const isAppError = err instanceof AppError;

  const response: ErrorResponse = {
    success: false,
    error_code: (isAppError ? err.statusCode : err?.status ?? 500) as number,
    message: (err?.message ?? "Something went wrong!") as string,
    data: (isAppError ? err.data : err?.data) ?? {},
    ...(isAppError ? { code: err.errorCode } : {}),
  };

  logger.error(err?.stack ?? response.message);
  res.status(response.error_code).send(response);
  next();
};

export default errorHandler;
