"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Pencil, Trash2, ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { AdjustStockModal } from "./AdjustStockModal";
import { deleteProductAction, adjustStockAction, type ProductActionState } from "@/actions/products.actions";
import type { Product } from "@/types";

type Props = {
  products: Product[];
};

export function ProductTable({ products }: Props) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [adjustProduct, setAdjustProduct] = useState<Product | null>(null);
  const [isPending, startTransition] = useTransition();
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const handleDelete = () => {
    if (!deleteId) return;
    startTransition(async () => {
      const result = await deleteProductAction(deleteId);
      if (result.error) {
        setDeleteError(result.error);
      } else {
        setDeleteId(null);
      }
    });
  };

  const getAdjustAction = (product: Product) =>
    adjustStockAction.bind(null, product.id) as (
      prev: ProductActionState,
      formData: FormData
    ) => Promise<ProductActionState>;

  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-gray-900">No products yet</p>
        <p className="text-sm text-gray-500">Add your first product to get started</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="pb-3 text-left font-medium text-gray-500">Name</th>
              <th className="pb-3 text-left font-medium text-gray-500">SKU</th>
              <th className="pb-3 text-right font-medium text-gray-500">Qty</th>
              <th className="pb-3 text-right font-medium text-gray-500">Selling Price</th>
              <th className="pb-3 text-right font-medium text-gray-500">Status</th>
              <th className="pb-3 text-right font-medium text-gray-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {products.map((product) => (
              <tr key={product.id} className="group">
                <td className="py-3 font-medium text-gray-900">{product.name}</td>
                <td className="py-3 text-gray-500">{product.sku}</td>
                <td className="py-3 text-right text-gray-900">{product.quantityOnHand}</td>
                <td className="py-3 text-right text-gray-900">
                  {product.sellingPrice ? `$${Number(product.sellingPrice).toFixed(2)}` : "—"}
                </td>
                <td className="py-3 text-right">
                  {product.isLowStock ? (
                    <span className="inline-flex items-center gap-1.5">
                      <span className={`relative flex h-2 w-2`}>
                        <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${product.quantityOnHand === 0 ? "bg-red-500" : "bg-yellow-500"}`} />
                        <span className={`relative inline-flex h-2 w-2 rounded-full ${product.quantityOnHand === 0 ? "bg-red-500" : "bg-yellow-500"}`} />
                      </span>
                      <Badge variant={product.quantityOnHand === 0 ? "danger" : "warning"}>
                        {product.quantityOnHand === 0 ? "Out of stock" : "Low stock"}
                      </Badge>
                    </span>
                  ) : (
                    <Badge variant="success">In stock</Badge>
                  )}
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => setAdjustProduct(product)}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                      title="Adjust stock"
                    >
                      <ArrowUpDown className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/products/${product.id}/edit`}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-indigo-600"
                      title="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </Link>
                    <button
                      onClick={() => { setDeleteId(product.id); setDeleteError(null); }}
                      className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-red-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Delete confirm modal */}
      <Modal open={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Product">
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this product? This action cannot be undone.
        </p>
        {deleteError && (
          <p className="mt-2 text-sm text-red-600">{deleteError}</p>
        )}
        <div className="mt-5 flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>
            Cancel
          </Button>
          <Button variant="danger" loading={isPending} onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </Modal>

      {/* Adjust stock modal */}
      {adjustProduct && (
        <AdjustStockModal
          productId={adjustProduct.id}
          productName={adjustProduct.name}
          open={!!adjustProduct}
          onClose={() => setAdjustProduct(null)}
          action={getAdjustAction(adjustProduct)}
        />
      )}
    </>
  );
}
