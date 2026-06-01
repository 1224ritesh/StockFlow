import { Card } from "@/components/ui/Card";
import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: string;
};

export function StatCard({ title, value, icon: Icon, iconColor = "text-indigo-600" }: Props) {
  return (
    <Card className="flex items-center gap-4">
      <div className={`rounded-xl bg-indigo-50 p-3 ${iconColor}`}>
        <Icon className="h-6 w-6" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
      </div>
    </Card>
  );
}
