import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { env } from "../config/env.ts";

export type AuthTokenPayload = {
  userId: string;
  organizationId: string;
  email: string;
};

const TOKEN_EXPIRY = "7d";

export const hashPassword = async (password: string) => {
  return bcrypt.hash(password, 10);
};

export const verifyPassword = async (password: string, hash: string) => {
  return bcrypt.compare(password, hash);
};

export const signAuthToken = (payload: AuthTokenPayload) => {
  return jwt.sign(payload, env.JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
};

export const verifyAuthToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as AuthTokenPayload;
};