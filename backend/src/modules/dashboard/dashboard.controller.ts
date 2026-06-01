import type { Request, Response } from "express";

import { AppError } from "../../errors/app-error.ts";
import { getDashboardSummary } from "./dashboard.service.ts";
import { dashboardSummarySchema } from "./dashboard.validation.ts";
import { flattenError } from "zod/v4/mini";

const toValidationError = (message: string, error: unknown) =>
  new AppError(message, 400, "VALIDATION_ERROR", flattenError(error as never).fieldErrors);

export const dashboardController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const data = await getDashboardSummary(req.auth.organizationId);
  const parsed = dashboardSummarySchema.safeParse(data);

  if (!parsed.success) {
    throw toValidationError("Invalid dashboard data", parsed.error);
  }

  return res.status(200).json({
    message: "Dashboard fetched successfully",
    data: parsed.data,
  });
};