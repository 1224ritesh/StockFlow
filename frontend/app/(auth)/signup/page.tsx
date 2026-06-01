"use client";

import { useActionState } from "react";
import Link from "next/link";
import { Boxes } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { signupAction, type AuthActionState } from "@/actions/auth.actions";

const initialState: AuthActionState = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signupAction, initialState);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2">
          <div className="flex items-center gap-2">
            <Boxes className="h-8 w-8 text-indigo-600" />
            <span className="text-2xl font-bold text-gray-900">StockFlow</span>
          </div>
          <p className="text-sm text-gray-500">Create your account</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <form action={formAction} className="space-y-4">
            {state.error && (
              <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">
                {state.error}
              </div>
            )}
            <Input
              label="Organization Name"
              name="organizationName"
              required
              placeholder="My Store"
              error={state.fieldErrors?.organizationName?.[0]}
            />
            <Input
              label="Email"
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@example.com"
              error={state.fieldErrors?.email?.[0]}
            />
            <Input
              label="Password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              error={state.fieldErrors?.password?.[0]}
            />
            <Input
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              placeholder="••••••••"
              error={state.fieldErrors?.confirmPassword?.[0]}
            />
            <Button type="submit" className="w-full" loading={pending}>
              Create account
            </Button>
          </form>
        </div>

        <p className="mt-4 text-center text-sm text-gray-500">
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
