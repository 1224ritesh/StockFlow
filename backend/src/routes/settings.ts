import { Router } from "express";

import { asyncHandler } from "../middleware/async-handler.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import {
  getSettingsController,
  updateSettingsController,
} from "../modules/settings/settings.controller.ts";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(getSettingsController));
router.put("/", asyncHandler(updateSettingsController));

export default router;