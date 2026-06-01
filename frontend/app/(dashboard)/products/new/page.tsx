import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/products/ProductForm";
import { createProductAction } from "@/actions/products.actions";

export const metadata = { title: "New Product — StockFlow" };

export default function NewProductPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">New Product</h1>
      <Card>
        <ProductForm action={createProductAction} />
      </Card>
    </div>
  );
}
