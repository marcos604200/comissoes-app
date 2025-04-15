import Layout from "@/components/Layout";
import { DashboardComissoes } from "@/components/DashboardComissoes";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface ResultadoComissao {
  id: number;
  colaborador: string;
  escritorio: string;
  tipo_receita: string;
  valor_receita: number;
  valor_comissao: number;
  regra_aplicada: string;
  data_emissao: string;
}

export default function Relatorios() {
  const [resultados, setResultados] = useState<ResultadoComissao[]>([]);
  const [filtroEscritorio, setFiltroEscritorio] = useState("");
  const [filtroColaborador, setFiltroColaborador] = useState("");

  useEffect(() => {
    const buscarResultados = async () => {
      const { data, error } = await supabase
        .from("comissoes_resultado")
        .select("id, colaborador, escritorio, tipo_receita, valor_receita, valor_comissao, regra_aplicada, data_emissao")
        .order("data_emissao", { ascending: false });

      if (!error && data) setResultados(data);
    };

    buscarResultados();
  }, []);

  const resultadosFiltrados = resultados.filter((r) => {
    return (
      r.escritorio.toLowerCase().includes(filtroEscritorio.toLowerCase()) &&
      r.colaborador.toLowerCase().includes(filtroColaborador.toLowerCase())
    );
  });

  return (
    <Layout>
      <main className="flex-1 p-6 space-y-8">
        <h1 className="text-2xl font-bold">📊 Relatórios de Comissão</h1>

        <div className="flex flex-col md:flex-row gap-4">
          <Input
            placeholder="Filtrar por escritório..."
            value={filtroEscritorio}
            onChange={(e) => setFiltroEscritorio(e.target.value)}
          />
          <Input
            placeholder="Filtrar por colaborador..."
            value={filtroColaborador}
            onChange={(e) => setFiltroColaborador(e.target.value)}
          />
        </div>

        <DashboardComissoes resultados={resultadosFiltrados} />

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {resultadosFiltrados.map((r) => (
            <Card key={r.id} className="bg-white shadow-sm">
              <CardContent className="p-4 space-y-1">
                <p><strong>Colaborador:</strong> {r.colaborador}</p>
                <p><strong>Escritório:</strong> {r.escritorio}</p>
                <p><strong>Receita:</strong> {r.tipo_receita} — R$ {r.valor_receita.toFixed(2)}</p>
                <p><strong>Comissão:</strong> R$ {r.valor_comissao.toFixed(2)}</p>
                <p><strong>Regra Aplicada:</strong> {r.regra_aplicada}</p>
                <p className="text-sm text-gray-500">{new Date(r.data_emissao).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </Layout>
  );
}
