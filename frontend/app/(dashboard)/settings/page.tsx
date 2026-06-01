import { getSettings } from "@/actions/settings.actions";
import { SettingsForm } from "@/components/settings/SettingsForm";

export const metadata = { title: "Settings — StockFlow" };

export default async function SettingsPage() {
  const settings = await getSettings();

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
      <SettingsForm defaultThreshold={settings.defaultLowStockThreshold} />
    </div>
  );
}
