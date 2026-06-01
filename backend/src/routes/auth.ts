import { Router } from "express";

import { asyncHandler } from "../middleware/async-handler.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import { loginController, meController, signupController } from "../modules/auth/auth.controller.ts";

const router = Router();

router.post("/signup", asyncHandler(signupController));

router.post("/login", asyncHandler(loginController));

router.get("/me", requireAuth, asyncHandler(meController));

export default router;