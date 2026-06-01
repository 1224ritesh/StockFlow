import "dotenv/config";

export const env = {
  PORT: process.env.PORT || "8080",

  DATABASE_URL: process.env.DATABASE_URL!,

  JWT_SECRET: process.env.JWT_SECRET!,

  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:3000",
};