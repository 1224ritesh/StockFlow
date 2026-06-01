import { Product } from "@/types";
import { Badge } from "@/components/ui/Card";
import { AlertTriangle } from "lucide-react";

type Props = {
  items: Product[];
};

export function LowStockTable({ items }: Props) {
  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-green-50 p-3">
          <AlertTriangle className="h-6 w-6 text-green-500" />
        </div>
        <p className="mt-3 text-sm font-medium text-gray-900">All stock levels are healthy</p>
        <p className="text-sm text-gray-500">No products are below their threshold</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-200">
            <th className="pb-3 text-left font-medium text-gray-500">Name</th>
            <th className="pb-3 text-left font-medium text-gray-500">SKU</th>
            <th className="pb-3 text-right font-medium text-gray-500">Qty on Hand</th>
            <th className="pb-3 text-right font-medium text-gray-500">Threshold</th>
            <th className="pb-3 text-right font-medium text-gray-500">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {items.map((item) => (
            <tr key={item.id}>
              <td className="py-3 font-medium text-gray-900">{item.name}</td>
              <td className="py-3 text-gray-500">{item.sku}</td>
              <td className="py-3 text-right text-gray-900">{item.quantityOnHand}</td>
              <td className="py-3 text-right text-gray-500">{item.effectiveLowStockThreshold}</td>
              <td className="py-3 text-right">
                <span className="inline-flex items-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className={`absolute inline-flex h-full w-full animate-ping rounded-full opacity-75 ${item.quantityOnHand === 0 ? "bg-red-500" : "bg-yellow-500"}`} />
                    <span className={`relative inline-flex h-2 w-2 rounded-full ${item.quantityOnHand === 0 ? "bg-red-500" : "bg-yellow-500"}`} />
                  </span>
                  <Badge variant={item.quantityOnHand === 0 ? "danger" : "warning"}>
                    {item.quantityOnHand === 0 ? "Out of stock" : "Low stock"}
                  </Badge>
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
