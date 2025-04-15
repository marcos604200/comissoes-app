import MainLayout from "@/layouts/MainLayout";
import PainelDashboard from "@/components/PainelDashboard";

export default function DashboardPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">📊 Dashboard Analítico</h1>
      <PainelDashboard />
    </MainLayout>
  );
}
