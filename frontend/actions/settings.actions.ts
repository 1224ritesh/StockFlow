"use server";

import { revalidatePath } from "next/cache";
import { apiFetch } from "@/lib/api";
import type { ApiResponse, Settings } from "@/types";

export type SettingsActionState = {
  error?: string;
  success?: boolean;
};

export async function getSettings(): Promise<Settings> {
  const res = await apiFetch<ApiResponse<Settings>>("/settings");
  return res.data;
}

export async function updateSettingsAction(
  _prev: SettingsActionState,
  formData: FormData
): Promise<SettingsActionState> {
  const defaultLowStockThreshold = Number(formData.get("defaultLowStockThreshold"));

  try {
    await apiFetch<ApiResponse<Settings>>("/settings", {
      method: "PUT",
      body: { defaultLowStockThreshold },
    });
  } catch (e) {
    return { error: e instanceof Error ? e.message : "Failed to update settings" };
  }

  revalidatePath("/settings");
  revalidatePath("/dashboard");
  revalidatePath("/products");
  return { success: true };
}
