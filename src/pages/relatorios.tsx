import MainLayout from "@/layouts/MainLayout";
import PainelRelatorio from "@/components/PainelRelatorio";

export default function RelatoriosPage() {
  return (
    <MainLayout>
      <h1 className="text-2xl font-bold mb-4">📝 Relatórios de Comissões</h1>
      <PainelRelatorio />
    </MainLayout>
  );
}
