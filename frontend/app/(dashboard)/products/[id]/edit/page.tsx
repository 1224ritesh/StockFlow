import { notFound } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { ProductForm } from "@/components/products/ProductForm";
import { getProduct, updateProductAction } from "@/actions/products.actions";

type Props = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Edit Product — StockFlow" };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;

  let product;
  try {
    product = await getProduct(id);
  } catch {
    notFound();
  }

  const action = updateProductAction.bind(null, id);

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
      <Card>
        <ProductForm product={product} action={action} />
      </Card>
    </div>
  );
}
