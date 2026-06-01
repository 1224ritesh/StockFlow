import { Router } from "express";

import { asyncHandler } from "../middleware/async-handler.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import { dashboardController } from "../modules/dashboard/dashboard.controller.ts";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(dashboardController));

export default router;