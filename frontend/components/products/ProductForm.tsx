"use client";

import { useActionState } from "react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { Product } from "@/types";
import type { ProductActionState } from "@/actions/products.actions";

type Props = {
  product?: Product;
  action: (prev: ProductActionState, formData: FormData) => Promise<ProductActionState>;
};

const initialState: ProductActionState = {};

export function ProductForm({ product, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <Input
          label="Name"
          name="name"
          required
          defaultValue={product?.name}
          error={state.fieldErrors?.name?.[0]}
          placeholder="Product name"
        />
        <Input
          label="SKU"
          name="sku"
          required
          defaultValue={product?.sku}
          error={state.fieldErrors?.sku?.[0]}
          placeholder="SKU-001"
        />
      </div>

      <Input
        label="Description"
        name="description"
        defaultValue={product?.description ?? ""}
        placeholder="Optional description"
      />

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <Input
          label="Quantity on Hand"
          name="quantityOnHand"
          type="number"
          min={0}
          required
          defaultValue={product?.quantityOnHand ?? 0}
          error={state.fieldErrors?.quantityOnHand?.[0]}
        />
        <Input
          label="Cost Price"
          name="costPrice"
          type="number"
          min={0}
          step="0.01"
          defaultValue={product?.costPrice ?? ""}
          placeholder="0.00"
        />
        <Input
          label="Selling Price"
          name="sellingPrice"
          type="number"
          min={0}
          step="0.01"
          defaultValue={product?.sellingPrice ?? ""}
          placeholder="0.00"
        />
      </div>

      <Input
        label="Low Stock Threshold"
        name="lowStockThreshold"
        type="number"
        min={0}
        defaultValue={product?.lowStockThreshold ?? ""}
        placeholder="Leave blank to use global default"
      />

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={() => history.back()}>
          Cancel
        </Button>
        <Button type="submit" loading={pending}>
          {product ? "Save Changes" : "Create Product"}
        </Button>
      </div>
    </form>
  );
}
