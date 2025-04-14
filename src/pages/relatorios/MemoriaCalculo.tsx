// src/pages/relatorios/MemoriaCalculo.tsx

import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";

interface SimulacaoDetalhada {
  colaborador: string;
  receita: string;
  regra: string;
  baseCalculo: number;
  percentual: number;
  valorCalculado: number;
  data: string;
}

export default function MemoriaCalculo() {
  const [dados, setDados] = useState<SimulacaoDetalhada[]>([]);
  const [filtroColaborador, setFiltroColaborador] = useState("");
  const [filtroPeriodo, setFiltroPeriodo] = useState("");

  const buscarMemoria = async () => {
    let query = supabase.from("memoria_calculo").select("*");
    if (filtroColaborador) {
      query = query.ilike("colaborador", `%${filtroColaborador}%`);
    }
    if (filtroPeriodo) {
      query = query.ilike("data", `%${filtroPeriodo}%`);
    }
    const { data, error } = await query;
    if (!error && data) {
      setDados(data);
    }
  };

  const exportarPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text("Relatório de Memória de Cálculo de Comissão", 10, 10);

    dados.forEach((item, index) => {
      const posY = 20 + index * 30;
      doc.setFontSize(11);
      doc.text(`Colaborador: ${item.colaborador}`, 10, posY);
      doc.text(`Receita: ${item.receita}`, 10, posY + 6);
      doc.text(`Regra: ${item.regra}`, 10, posY + 12);
      doc.text(`Base de Cálculo: R$ ${item.baseCalculo.toFixed(2)}`, 10, posY + 18);
      doc.text(`Percentual: ${item.percentual}%`, 90, posY + 18);
      doc.text(`Valor Calculado: R$ ${item.valorCalculado.toFixed(2)}`, 10, posY + 24);
    });

    doc.save("memoria_calculo.pdf");
  };

  useEffect(() => {
    buscarMemoria();
  }, [filtroColaborador, filtroPeriodo]);

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-2xl font-bold mb-4">📋 Relatório - Memória de Cálculo</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Filtrar por colaborador"
          value={filtroColaborador}
          onChange={(e) => setFiltroColaborador(e.target.value)}
        />
        <Input
          placeholder="Filtrar por período (ex: 04/2025)"
          value={filtroPeriodo}
          onChange={(e) => setFiltroPeriodo(e.target.value)}
        />
      </div>

      <Button onClick={exportarPDF} className="bg-green-600 text-white">
        📄 Exportar PDF
      </Button>

      {dados.map((item, idx) => (
        <Card key={idx} className="shadow-md">
          <CardContent className="space-y-1 text-sm py-4">
            <p><strong>Colaborador:</strong> {item.colaborador}</p>
            <p><strong>Receita:</strong> {item.receita}</p>
            <p><strong>Regra Aplicada:</strong> {item.regra}</p>
            <p><strong>Base de Cálculo:</strong> R$ {item.baseCalculo.toFixed(2)}</p>
            <p><strong>Percentual:</strong> {item.percentual}%</p>
            <p><strong>Valor Calculado:</strong> R$ {item.valorCalculado.toFixed(2)}</p>
            <p><strong>Data:</strong> {item.data}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

