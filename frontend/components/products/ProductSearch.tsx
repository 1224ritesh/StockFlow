"use client";

import { useRouter, usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { useTransition } from "react";

type Props = {
  defaultValue?: string;
};

export function ProductSearch({ defaultValue }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [, startTransition] = useTransition();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    startTransition(() => {
      const params = new URLSearchParams();
      if (value) params.set("search", value);
      router.replace(`${pathname}?${params.toString()}`);
    });
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        type="text"
        defaultValue={defaultValue}
        onChange={handleChange}
        placeholder="Search by name or SKU..."
        className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-4 text-sm text-gray-900 placeholder-gray-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:max-w-xs"
      />
    </div>
  );
}
