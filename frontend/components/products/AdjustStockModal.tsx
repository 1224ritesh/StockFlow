"use client";

import { useActionState, useEffect } from "react";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import type { ProductActionState } from "@/actions/products.actions";

type Props = {
  productId: string;
  productName: string;
  open: boolean;
  onClose: () => void;
  action: (prev: ProductActionState, formData: FormData) => Promise<ProductActionState>;
};

const initialState: ProductActionState = {};

export function AdjustStockModal({ productName, open, onClose, action }: Props) {
  const [state, formAction, pending] = useActionState(action, initialState);

  useEffect(() => {
    if (!state.error && !pending && state !== initialState) {
      onClose();
    }
  }, [state, pending, onClose]);

  return (
    <Modal open={open} onClose={onClose} title={`Adjust Stock — ${productName}`}>
      <form action={formAction} className="space-y-4">
        {state.error && (
          <div className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700">{state.error}</div>
        )}
        <Input
          label="Quantity Delta"
          name="quantityDelta"
          type="number"
          required
          placeholder="+10 or -5"
          error={state.fieldErrors?.quantityDelta?.[0]}
        />
        <div className="flex justify-end gap-3 pt-1">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" loading={pending}>
            Apply
          </Button>
        </div>
      </form>
    </Modal>
  );
}
