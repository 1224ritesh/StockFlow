"use client";

import { useActionState } from "react";
import { updateSettingsAction, type SettingsActionState } from "@/actions/settings.actions";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

type Props = {
  defaultThreshold: number;
};

const initialState: SettingsActionState = {};

export function SettingsForm({ defaultThreshold }: Props) {
  const [state, formAction, pending] = useActionState(updateSettingsAction, initialState);

  return (
    <form action={formAction}>
      <Card className="space-y-5">
        <div>
          <h2 className="text-base font-semibold text-gray-900">Inventory Settings</h2>
          <p className="text-sm text-gray-500">
            These settings apply globally across all products.
          </p>
        </div>

        {state.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
        )}
        {state.success && (
          <div className="rounded-lg bg-green-50 px-4 py-3 text-sm text-green-700">
            Settings saved successfully.
          </div>
        )}

        <Input
          label="Default Low Stock Threshold"
          name="defaultLowStockThreshold"
          type="number"
          min={0}
          required
          defaultValue={defaultThreshold}
        />
        <p className="text-xs text-gray-500">
          Products without a custom threshold will use this value to determine low stock status.
        </p>

        <div className="flex justify-end">
          <Button type="submit" loading={pending}>
            Save Settings
          </Button>
        </div>
      </Card>
    </form>
  );
}
