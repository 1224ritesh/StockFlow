import { z } from "zod";

export const updateSettingsSchema = z.object({
  defaultLowStockThreshold: z.coerce.number().int().nonnegative(),
});