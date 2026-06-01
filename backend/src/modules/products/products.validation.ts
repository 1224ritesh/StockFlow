import { z } from "zod";

const decimalField = z.coerce.number().nonnegative();

export const productQuerySchema = z.object({
  search: z.string().trim().min(1).optional(),
});

export const productIdSchema = z.object({
  id: z.string().trim().min(1),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(1),
  sku: z.string().trim().min(1),
  description: z.string().trim().optional(),
  quantityOnHand: z.coerce.number().int().nonnegative(),
  costPrice: decimalField.optional(),
  sellingPrice: decimalField.optional(),
  lowStockThreshold: z.coerce.number().int().nonnegative().optional(),
});

export const updateProductSchema = createProductSchema.partial().refine(
  (data) => Object.values(data).some((value) => value !== undefined),
  {
    message: "At least one field is required",
    path: ["name"],
  }
);

export const adjustStockSchema = z.object({
  quantityDelta: z.coerce.number().int().refine((value) => value !== 0, {
    message: "Quantity delta cannot be zero",
  }),
  note: z.string().trim().optional(),
});