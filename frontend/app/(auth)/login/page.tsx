"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { loginAction, type AuthActionState } from "@/actions/auth.actions";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Boxes className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">StockFlow</span>
          </div>
          <p className="text-sm text-gray-500">Sign in to your account</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}
            <Input
              label="Email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
            />
            <Button type="submit" className="w-full" loading={pending}>
              Sign in
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Don&apos;t have an account?{" "}
          <Link href="/signup" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
