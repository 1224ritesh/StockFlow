import { Package, Layers, AlertTriangle } from "lucide-react";
import { getDashboard } from "@/actions/dashboard.actions";
import { StatCard } from "@/components/dashboard/StatCard";
import { LowStockTable } from "@/components/dashboard/LowStockTable";
import { Card } from "@/components/ui/Card";

export const metadata = { title: "Dashboard — StockFlow" };

export default async function DashboardPage() {
  const data = await getDashboard();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard title="Total Products" value={data.totalProducts} icon={Package} />
        <StatCard title="Total Units in Stock" value={data.totalQuantityOnHand} icon={Layers} />
        <StatCard
          title="Low Stock Items"
          value={data.lowStockItems.length}
          icon={AlertTriangle}
          iconColor={data.lowStockItems.length > 0 ? "text-yellow-600" : "text-green-600"}
        />
      </div>

      <Card>
        <h2 className="mb-4 text-base font-semibold text-gray-900">
          Low Stock Items
          {data.lowStockItems.length > 0 && (
            <span className="ml-2 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
              {data.lowStockItems.length}
            </span>
          )}
        </h2>
        <LowStockTable items={data.lowStockItems} />
      </Card>
    </div>
  );
}
