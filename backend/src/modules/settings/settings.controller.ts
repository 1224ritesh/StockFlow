import type { Request, Response } from "express";

import { AppError } from "../../errors/app-error.ts";
import { getSettings, updateSettings } from "./settings.service.ts";
import { updateSettingsSchema } from "./settings.validation.ts";
import { flattenError } from "zod/v4/mini";

const toValidationError = (message: string, error: unknown) =>
  new AppError(message, 400, "VALIDATION_ERROR", flattenError(error as never).fieldErrors);

export const getSettingsController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const data = await getSettings(req.auth.organizationId);

  return res.status(200).json({
    message: "Settings fetched successfully",
    data,
  });
};

export const updateSettingsController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const parsed = updateSettingsSchema.safeParse(req.body);

  if (!parsed.success) {
    throw toValidationError("Invalid settings data", parsed.error);
  }

  const data = await updateSettings(req.auth.organizationId, parsed.data);

  return res.status(200).json({
    message: "Settings updated successfully",
    data,
  });
};