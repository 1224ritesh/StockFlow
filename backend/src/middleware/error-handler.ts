import type { ErrorRequestHandler, RequestHandler } from "express";

import { AppError } from "../errors/app-error.ts";

export const notFoundHandler: RequestHandler = (_, res) => {
  return res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

export const errorHandler: ErrorRequestHandler = (error, _, res, _next) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
      code: error.code,
      details: error.details,
    });
  }

  console.error(error);

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};