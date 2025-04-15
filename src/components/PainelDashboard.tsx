import { Card, CardContent } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const data = [
  { colaborador: "João", comissao: 1250 },
  { colaborador: "Maria", comissao: 1980 },
  { colaborador: "Carlos", comissao: 880 },
  { colaborador: "Ana", comissao: 1570 },
];

export default function PainelDashboard() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-lg font-semibold mb-4">Comissão por Colaborador</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data}>
              <XAxis dataKey="colaborador" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="comissao" fill="#4f46e5" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
