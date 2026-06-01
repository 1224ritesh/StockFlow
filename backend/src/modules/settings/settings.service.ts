import { prisma } from "../../config/prisma.ts";

type UpdateSettingsInput = {
  defaultLowStockThreshold: number;
};

const DEFAULT_LOW_STOCK_THRESHOLD = 5;

export const getSettings = async (organizationId: string) => {
  const settings = await prisma.organizationSettings.findUnique({
    where: {
      organizationId,
    },
  });

  return {
    organizationId,
    defaultLowStockThreshold:
      settings?.defaultLowStockThreshold ?? DEFAULT_LOW_STOCK_THRESHOLD,
  };
};

export const updateSettings = async (
  organizationId: string,
  input: UpdateSettingsInput
) => {
  const settings = await prisma.organizationSettings.upsert({
    where: {
      organizationId,
    },
    create: {
      organizationId,
      defaultLowStockThreshold: input.defaultLowStockThreshold,
    },
    update: {
      defaultLowStockThreshold: input.defaultLowStockThreshold,
    },
  });

  return {
    organizationId: settings.organizationId,
    defaultLowStockThreshold: settings.defaultLowStockThreshold,
  };
};