import type { Request, Response } from "express";

import { AppError } from "../../errors/app-error.ts";
import { getCurrentUser, login, signup } from "./auth.service.ts";
import { authCredentialsSchema, signupSchema } from "./auth.validation.ts";
import { flattenError } from "zod/v4/mini";

export const signupController = async (req: Request, res: Response) => {
  const parsed = signupSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      "Invalid signup data",
      400,
      "VALIDATION_ERROR",
      flattenError(parsed.error).fieldErrors
    );
  }

  const data = await signup({
    email: parsed.data.email,
    password: parsed.data.password,
    organizationName: parsed.data.organizationName,
  });

  return res.status(201).json({
    message: "Account created successfully",
    data,
  });
};

export const loginController = async (req: Request, res: Response) => {
  const parsed = authCredentialsSchema.safeParse(req.body);

  if (!parsed.success) {
    throw new AppError(
      "Invalid login data",
      400,
      "VALIDATION_ERROR",
      flattenError(parsed.error).fieldErrors
    );
  }

  const data = await login(parsed.data);

  return res.status(200).json({
    message: "Logged in successfully",
    data,
  });
};

export const meController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const data = await getCurrentUser(req.auth.userId);

  return res.status(200).json({
    data,
  });
};
