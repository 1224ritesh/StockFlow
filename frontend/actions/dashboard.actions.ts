"use server";

import { apiFetch } from "@/lib/api";
import type { ApiResponse, DashboardData } from "@/types";

export async function getDashboard(): Promise<DashboardData> {
  const res = await apiFetch<ApiResponse<DashboardData>>("/dashboard");
  return res.data;
}
