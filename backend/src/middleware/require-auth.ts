import type { NextFunction, Request, Response } from "express";

import { prisma } from "../config/prisma.ts";
import { AppError } from "../errors/app-error.ts";
import { verifyAuthToken } from "../lib/auth.ts";

const getBearerToken = (authorizationHeader: string | undefined) => {
  if (!authorizationHeader) {
    return null;
  }

  const [scheme, token] = authorizationHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return null;
  }

  return token;
};

export const requireAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token = getBearerToken(req.headers.authorization);

    if (!token) {
      throw new AppError("Missing authorization token", 401, "UNAUTHORIZED");
    }

    const payload = verifyAuthToken(token);

    const user = await prisma.user.findUnique({
      where: {
        id: payload.userId,
      },
      include: {
        organization: true,
      },
    });

    if (!user) {
      throw new AppError("Invalid authorization token", 401, "UNAUTHORIZED");
    }

    req.auth = {
      userId: user.id,
      organizationId: user.organizationId,
      email: user.email,
    };

    return next();
  } catch {
    return next(new AppError("Invalid authorization token", 401, "UNAUTHORIZED"));
  }
};