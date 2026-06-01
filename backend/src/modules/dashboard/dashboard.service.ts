import { prisma } from "../../config/prisma.ts";
import {
  getLowStockProducts,
  getProductsSummary,
} from "../products/products.service.ts";

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const getDashboardSummary = async (organizationId: string) => {
  const [summary, lowStockItems, settings] = await Promise.all([
    getProductsSummary(organizationId),
    getLowStockProducts(organizationId),
    prisma.organizationSettings.findUnique({
      where: {
        organizationId,
      },
    }),
  ]);

  return {
    totalProducts: summary.totalProducts,
    totalQuantityOnHand: summary.totalQuantityOnHand,
    defaultLowStockThreshold:
      settings?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
    lowStockItems,
  };
};