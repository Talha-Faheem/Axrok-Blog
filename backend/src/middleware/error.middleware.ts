import { Request, Response, NextFunction } from "express";
import { logger } from "../utils/logger.js";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void {
  logger.error(`Unhandled Request Error [${req.method} ${req.url}]:`, err);

  const statusCode = err.statusCode || (err.name === "ValidationError" ? 400 : 500);
  const message = err.message || "Internal server error occurred";

  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
}
