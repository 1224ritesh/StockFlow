import { Router } from "express";

import { asyncHandler } from "../middleware/async-handler.ts";
import { requireAuth } from "../middleware/require-auth.ts";
import {
  adjustStockController,
  createProductController,
  deleteProductController,
  getProductController,
  listProductsController,
  updateProductController,
} from "../modules/products/products.controller.ts";

const router = Router();

router.use(requireAuth);

router.get("/", asyncHandler(listProductsController));
router.get("/:id", asyncHandler(getProductController));
router.post("/", asyncHandler(createProductController));
router.put("/:id", asyncHandler(updateProductController));
router.delete("/:id", asyncHandler(deleteProductController));
router.post("/:id/adjust-stock", asyncHandler(adjustStockController));

export default router;