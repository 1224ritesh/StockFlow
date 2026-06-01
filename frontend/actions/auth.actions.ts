"use server";

import { redirect } from "next/navigation";
import { clearAuthCookie, setAuthCookie } from "@/lib/auth";
import type { ApiResponse, AuthData } from "@/types";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1";

export type AuthActionState = {
  error?: string;
  fieldErrors?: Record<string, string[]>;
};

export async function loginAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const json: ApiResponse<AuthData> = await res.json();

    if (!res.ok) {
      return { error: (json as unknown as { message: string }).message ?? "Login failed" };
    }

    await setAuthCookie(json.data.token);
  } catch {
    return { error: "Unable to connect to server" };
  }

  redirect("/dashboard");
}

export async function signupAction(
  _prev: AuthActionState,
  formData: FormData
): Promise<AuthActionState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const organizationName = formData.get("organizationName") as string;

  if (password !== confirmPassword) {
    return { fieldErrors: { confirmPassword: ["Passwords do not match"] } };
  }

  try {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, confirmPassword, organizationName }),
    });

    const json: ApiResponse<AuthData> = await res.json();

    if (!res.ok) {
      return { error: (json as unknown as { message: string }).message ?? "Signup failed" };
    }

    await setAuthCookie(json.data.token);
  } catch {
    return { error: "Unable to connect to server" };
  }

  redirect("/dashboard");
}

export async function logoutAction() {
  await clearAuthCookie();
  redirect("/login");
}
