import type { Request, Response } from "express";

import { AppError } from "../../errors/app-error.ts";
import {
  adjustStock,
  createProduct,
  deleteProduct,
  getProduct,
  listProducts,
  updateProduct,
} from "./products.service.ts";
import {
  adjustStockSchema,
  createProductSchema,
  productIdSchema,
  productQuerySchema,
  updateProductSchema,
} from "./products.validation.ts";
import { flattenError } from "zod/v4/mini";

const toValidationError = (message: string, error: unknown) =>
  new AppError(message, 400, "VALIDATION_ERROR", flattenError(error as never).fieldErrors);

export const listProductsController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const parsed = productQuerySchema.safeParse(req.query);

  if (!parsed.success) {
    throw toValidationError("Invalid product query", parsed.error);
  }

  const data = await listProducts(req.auth.organizationId, parsed.data.search);

  return res.status(200).json({
    message: "Products fetched successfully",
    data,
  });
};

export const getProductController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const parsed = productIdSchema.safeParse(req.params);

  if (!parsed.success) {
    throw toValidationError("Invalid product id", parsed.error);
  }

  const data = await getProduct(req.auth.organizationId, parsed.data.id);

  return res.status(200).json({
    message: "Product fetched successfully",
    data,
  });
};

export const createProductController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const parsed = createProductSchema.safeParse(req.body);

  if (!parsed.success) {
    throw toValidationError("Invalid product data", parsed.error);
  }

  const data = await createProduct(
    req.auth.organizationId,
    req.auth.userId,
    parsed.data
  );

  return res.status(201).json({
    message: "Product created successfully",
    data,
  });
};

export const updateProductController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const paramsParsed = productIdSchema.safeParse(req.params);
  const bodyParsed = updateProductSchema.safeParse(req.body);

  if (!paramsParsed.success) {
    throw toValidationError("Invalid product id", paramsParsed.error);
  }

  if (!bodyParsed.success) {
    throw toValidationError("Invalid product data", bodyParsed.error);
  }

  const data = await updateProduct(
    req.auth.organizationId,
    req.auth.userId,
    paramsParsed.data.id,
    bodyParsed.data
  );

  return res.status(200).json({
    message: "Product updated successfully",
    data,
  });
};

export const deleteProductController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const parsed = productIdSchema.safeParse(req.params);

  if (!parsed.success) {
    throw toValidationError("Invalid product id", parsed.error);
  }

  await deleteProduct(req.auth.organizationId, parsed.data.id);

  return res.status(200).json({
    message: "Product deleted successfully",
  });
};

export const adjustStockController = async (req: Request, res: Response) => {
  if (!req.auth) {
    throw new AppError("Not authenticated", 401, "UNAUTHORIZED");
  }

  const paramsParsed = productIdSchema.safeParse(req.params);
  const bodyParsed = adjustStockSchema.safeParse(req.body);

  if (!paramsParsed.success) {
    throw toValidationError("Invalid product id", paramsParsed.error);
  }

  if (!bodyParsed.success) {
    throw toValidationError("Invalid stock adjustment data", bodyParsed.error);
  }

  const data = await adjustStock(
    req.auth.organizationId,
    req.auth.userId,
    paramsParsed.data.id,
    bodyParsed.data
  );

  return res.status(200).json({
    message: "Stock updated successfully",
    data,
  });
};