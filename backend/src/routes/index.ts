import { Router } from "express";

import authRouter from "./auth.ts";
import dashboardRouter from "./dashboard.ts";
import productsRouter from "./products.ts";
import settingsRouter from "./settings.ts";

const router = Router();

router.use("/auth", authRouter);
router.use("/products", productsRouter);
router.use("/dashboard", dashboardRouter);
router.use("/settings", settingsRouter);

export default router;
