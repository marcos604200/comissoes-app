// src/components/RelatorioMemoriaCalculo.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useReactToPrint } from "react-to-print";

interface RelatorioMemoriaCalculoProps {
  colaborador: string;
  receitas: { tipo: string; valor: number; percentual: number }[];
  total: number;
  formula: string;
}

export default function RelatorioMemoriaCalculo({ colaborador, receitas, total, formula }: RelatorioMemoriaCalculoProps) {
  const relatorioRef = useRef(null);

  const handlePrint = useReactToPrint({
    content: () => relatorioRef.current,
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">🧾 Relatório de Memória de Cálculo</h2>
        <Button onClick={handlePrint}>Exportar PDF</Button>
      </div>

      <Card ref={relatorioRef} className="p-4 text-sm">
        <CardContent className="space-y-4">
          <p><strong>Colaborador:</strong> {colaborador}</p>
          <p><strong>Fórmula Aplicada:</strong> <code>{formula}</code></p>

          <table className="w-full border mt-4">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="p-2 border">Tipo de Receita</th>
                <th className="p-2 border">Valor</th>
                <th className="p-2 border">% Comissão</th>
                <th className="p-2 border">Comissão</th>
              </tr>
            </thead>
            <tbody>
              {receitas.map((r, idx) => (
                <tr key={idx}>
                  <td className="p-2 border">{r.tipo}</td>
                  <td className="p-2 border">R$ {r.valor.toFixed(2)}</td>
                  <td className="p-2 border">{r.percentual}%</td>
                  <td className="p-2 border">R$ {(r.valor * (r.percentual / 100)).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="font-bold text-right mt-4">Total da Comissão: R$ {total.toFixed(2)}</p>
        </CardContent>
      </Card>
    </div>
  );
}
