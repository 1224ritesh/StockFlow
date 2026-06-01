import Link from "next/link";
import { Plus } from "lucide-react";
import { getProducts } from "@/actions/products.actions";
import { ProductTable } from "@/components/products/ProductTable";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ProductSearch } from "@/components/products/ProductSearch";

export const metadata = { title: "Products — StockFlow" };

type Props = {
  searchParams: Promise<{ search?: string }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const { search } = await searchParams;
  const { products } = await getProducts(search);

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Products</h1>
        <Link href="/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <Card>
        <div className="mb-4">
          <ProductSearch defaultValue={search} />
        </div>
        <ProductTable products={products} />
      </Card>
    </div>
  );
}
