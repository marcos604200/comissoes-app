import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const kpiData = [
  { title: "Total de Colaboradores", value: 12 },
  { title: "Regras de Comissão", value: 8 },
  { title: "Relatórios Emitidos", value: 24 },
  { title: "Simulações Realizadas", value: 42 },
];

const chartData = [
  { name: "Jan", comissao: 2400 },
  { name: "Fev", comissao: 1398 },
  { name: "Mar", comissao: 9800 },
  { name: "Abr", comissao: 3908 },
];

export default function Dashboard() {
  return (
    <Layout>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">📊 Painel de Comissões</h1>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          {kpiData.map((item, index) => (
            <Card key={index}>
              <CardContent className="p-4">
                <p className="text-sm text-gray-500">{item.title}</p>
                <p className="text-2xl font-bold text-indigo-600">{item.value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardContent className="p-4">
            <h2 className="text-lg font-semibold mb-2">📈 Comissões por Mês</h2>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="comissao" fill="#4F46E5" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-right">
          <Button onClick={() => window.print()} className="bg-indigo-600 text-white">
            📄 Exportar Relatório PDF
          </Button>
        </div>
      </main>
    </Layout>
  );
}
