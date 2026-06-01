import { Prisma } from "../../generated/prisma/client.ts";
import { z } from "zod";

const decimalField = z.instanceof(Prisma.Decimal);

export const dashboardProductSchema = z
  .object({
    id: z.string().min(1),
    name: z.string().min(1),
    sku: z.string().min(1),
    description: z.string().nullable(),
    quantityOnHand: z.number().int().nonnegative(),
    costPrice: decimalField.nullable(),
    sellingPrice: decimalField.nullable(),
    lowStockThreshold: z.number().int().nonnegative().nullable(),
    effectiveLowStockThreshold: z.number().int().nonnegative(),
    isLowStock: z.boolean(),
    createdById: z.string().nullable(),
    updatedById: z.string().nullable(),
    createdAt: z.date(),
    updatedAt: z.date(),
  })
  .strict();

export const dashboardSummarySchema = z
  .object({
    totalProducts: z.number().int().nonnegative(),
    totalQuantityOnHand: z.number().int().nonnegative(),
    defaultLowStockThreshold: z.number().int().nonnegative(),
    lowStockItems: z.array(dashboardProductSchema),
  })
  .strict();