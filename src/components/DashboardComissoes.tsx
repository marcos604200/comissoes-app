import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { supabase } from "@/utils/supabase";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

export default function DashboardComissoes() {
  const [dados, setDados] = useState<any[]>([]);
  const [filtro, setFiltro] = useState<string>("");

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    const { data, error } = await supabase.from("comissoes_importadas").select("*");
    if (data && !error) setDados(data);
  };

  const exportarPDF = async () => {
    const input = document.getElementById("dashboard-pdf");
    if (!input) return;
    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("relatorio-comissao.pdf");
  };

  const dadosAgrupados = Object.values(
    dados.reduce((acc, item) => {
      const chave = item.tipo_receita;
      if (!acc[chave]) acc[chave] = { tipo_receita: chave, total: 0 };
      acc[chave].total += item.valor_receita;
      return acc;
    }, {} as Record<string, { tipo_receita: string; total: number }>)
  );

  return (
    <div>
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">📊 Dashboard de Comissões</h2>
        <Button onClick={exportarPDF}>Exportar PDF</Button>
      </div>

      <div id="dashboard-pdf">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dadosAgrupados.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p className="font-bold text-sm">{item.tipo_receita}</p>
                <p className="text-lg">R$ {item.total.toLocaleString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-8 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosAgrupados}>
              <XAxis dataKey="tipo_receita" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="total" fill="#4F46E5" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
