import express from "express";
import cors from "cors";

import routes from "./routes/index.ts";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.ts";
import { authLimiter, generalLimiter } from "./middleware/rate-limiter.ts";
import { env } from "./config/env.ts";

const app = express();

app.set("trust proxy", 1);

app.use(cors({
  origin: env.FRONTEND_URL,
  credentials: true,
}));
app.use(express.json());

app.use("/api/v1/auth", authLimiter);
app.use("/api/v1", generalLimiter);

app.use("/api/v1", routes);

app.get("/health", (_, res) => {
  res.status(200).json({
    message: "StockFlow API Running",
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;