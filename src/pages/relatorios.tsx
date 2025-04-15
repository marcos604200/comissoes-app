import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export default function Relatorios() {
  const [relatorio, setRelatorio] = useState<any[]>([]);
  const [colaboradores, setColaboradores] = useState<string[]>([]);
  const [regras, setRegras] = useState<string[]>([]);
  const [filtros, setFiltros] = useState({ colaborador: "", regra: "", periodo: "" });

  useEffect(() => {
    buscarRelatorios();
    buscarColaboradores();
    buscarRegras();
  }, []);

  const buscarRelatorios = async () => {
    const { data } = await supabase.from("relatorios_comissao").select("*");
    setRelatorio(data ?? []);
  };

  const buscarColaboradores = async () => {
    const { data } = await supabase.from("colaboradores").select("nome");
    setColaboradores(data?.map((c) => c.nome) ?? []);
  };

  const buscarRegras = async () => {
    const { data } = await supabase.from("regras_comissao").select("nome");
    setRegras(data?.map((r) => r.nome) ?? []);
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Comissões", 14, 16);
    autoTable(doc, {
      startY: 22,
      head: [["Colaborador", "Regra", "Valor", "Período"]],
      body: relatorioFiltrado.map((item) => [item.colaborador, item.regra, item.valor, item.periodo])
    });
    doc.save("relatorio-comissoes.pdf");
  };

  const relatorioFiltrado = relatorio.filter((item) => {
    const f = filtros;
    return (
      (!f.colaborador || item.colaborador === f.colaborador) &&
      (!f.regra || item.regra === f.regra) &&
      (!f.periodo || item.periodo.includes(f.periodo))
    );
  });

  return (
    <Layout>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">📄 Relatórios de Comissão</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select label="Colaborador" value={filtros.colaborador} onChange={(e) => setFiltros({ ...filtros, colaborador: e.target.value })}>
            <option value="">Todos</option>
            {colaboradores.map((nome) => (
              <option key={nome}>{nome}</option>
            ))}
          </Select>

          <Select label="Regra" value={filtros.regra} onChange={(e) => setFiltros({ ...filtros, regra: e.target.value })}>
            <option value="">Todas</option>
            {regras.map((nome) => (
              <option key={nome}>{nome}</option>
            ))}
          </Select>

          <Input
            type="month"
            value={filtros.periodo}
            onChange={(e) => setFiltros({ ...filtros, periodo: e.target.value })}
            placeholder="Filtrar por período"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {relatorioFiltrado.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p><strong>Colaborador:</strong> {item.colaborador}</p>
                <p><strong>Regra:</strong> {item.regra}</p>
                <p><strong>Valor:</strong> R$ {item.valor}</p>
                <p><strong>Período:</strong> {item.periodo}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-right mt-6">
          <Button onClick={exportarPDF} className="bg-indigo-600 text-white">
            📄 Exportar PDF
          </Button>
        </div>
      </main>
    </Layout>
  );
}
