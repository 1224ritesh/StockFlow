import express from "express";
import cors from "cors";

import routes from "./routes/index.ts";
import { errorHandler, notFoundHandler } from "./middleware/error-handler.ts";

const app = express();

app.use(cors());

app.use(express.json());

app.use("/api/v1", routes);

app.get("/health", (_, res) => {
  res.status(200).json({
    message: "StockFlow API Running",
  });
});

app.use(notFoundHandler);

app.use(errorHandler);

export default app;