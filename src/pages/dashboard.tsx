// src/pages/dashboard.tsx
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Download } from "lucide-react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const dadosComissao = [
  { colaborador: "João", valor: 1500 },
  { colaborador: "Maria", valor: 2000 },
  { colaborador: "Carlos", valor: 1200 },
  { colaborador: "Ana", valor: 1800 },
];

const cores = ["#2563EB", "#10B981", "#F59E0B", "#EF4444"];

export default function Dashboard() {
  const [filtro, setFiltro] = useState("");

  const dadosFiltrados = dadosComissao.filter((d) =>
    d.colaborador.toLowerCase().includes(filtro.toLowerCase())
  );

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text("Relatório de Comissões", 14, 16);
    autoTable(doc, {
      head: [["Colaborador", "Valor"]],
      body: dadosFiltrados.map((d) => [d.colaborador, `R$ ${d.valor.toFixed(2)}`]),
      startY: 24,
    });
    doc.save("relatorio-dashboard.pdf");
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">📊 Dashboard de Comissões</h1>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Filtrar por colaborador"
            value={filtro}
            onChange={(e) => setFiltro(e.target.value)}
          />
          <Button onClick={gerarPDF} variant="outline">
            <Download className="w-4 h-4 mr-2" /> Exportar
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">📈 Gráfico de Barras</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={dadosFiltrados}>
                <XAxis dataKey="colaborador" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="valor" fill="#2563EB" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">🍩 Gráfico de Pizza</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dadosFiltrados}
                  dataKey="valor"
                  nameKey="colaborador"
                  outerRadius={80}
                  label
                >
                  {dadosFiltrados.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={cores[index % cores.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-4">
          <h2 className="text-lg font-semibold mb-4">📋 Detalhes</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Colaborador</th>
                <th className="text-left py-2">Valor da Comissão</th>
              </tr>
            </thead>
            <tbody>
              {dadosFiltrados.map((d) => (
                <tr key={d.colaborador} className="border-b">
                  <td className="py-2">{d.colaborador}</td>
                  <td className="py-2 text-green-600 font-semibold">R$ {d.valor.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
