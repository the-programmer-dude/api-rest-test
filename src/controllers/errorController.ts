import { Request, Response, NextFunction } from "express";
import AppError from "../utils/appError";

import dotenv from "dotenv";
dotenv.config();

function handleJWTError(): any {
  return new AppError(400, "Invalid token, please log in again");
}

function handleJWTValidationError(): any {
  return new AppError(400, "Token expired, log in again");
}

function executeProductionError(res: Response, error: AppError): any {
  if (!error.isOperational) {
    return res.status(error.status || 500).json({
      message: "Unknown error, please be patient while we fix it",
    });
  } else {
    return res.status(error.status || 500).json({
      message: error.message,
    });
  }
}

function executeDevelopmentError(res: Response, error: AppError) {
  return res.status(error.status || 500).json({
    message: error.message,
    stack: error.stack,
    operational: error.isOperational,
  });
}

export default (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (process.env.NODE_ENV === "production") {
    let err = {
      ...error,
    };
    err.message = error.message;

    if (err.name === "JsonWebTokenError") err = handleJWTError();
    if (err.name === "TokenExpiredError") err = handleJWTValidationError();
    return executeProductionError(res, err);
  } else {
    return executeDevelopmentError(res, error);
  }
};
