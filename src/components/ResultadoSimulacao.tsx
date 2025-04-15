// src/components/ResultadoSimulacao.tsx
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";

interface ResultadoSimulacaoProps {
  camposBase: string[];
  formula: string;
}

export default function ResultadoSimulacao({ camposBase, formula }: ResultadoSimulacaoProps) {
  const [resultado, setResultado] = useState<number | null>(null);
  const [dadosSimulados, setDadosSimulados] = useState<Record<string, number>>({});

  useEffect(() => {
    // Funções auxiliares para parsing
    const parseFormula = (input: string): string => {
      return input
        .replace(/=+/g, "")
        .replace(/SOMA\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          return val.reduce((a: number, b: number) => a + b, 0).toString();
        })
        .replace(/MÉDIA\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          const soma = val.reduce((a: number, b: number) => a + b, 0);
          return (soma / val.length).toString();
        })
        .replace(/ABS\(([^)]+)\)/gi, (_, valor) => {
          return Math.abs(parseFloat(valor.trim())).toString();
        })
        .replace(/SE\(([^,]+),([^,]+),([^)]+)\)/gi, (_, cond, vTrue, vFalse) => {
          return eval(cond) ? vTrue.trim() : vFalse.trim();
        })
        .replace(/\[([^\]]+)\]/g, (_, campo) => {
          return String(dadosSimulados[campo] ?? 0);
        });
    };

    try {
      const interpretada = parseFormula(formula);
      const valorCalculado = eval(interpretada);
      setResultado(valorCalculado);
    } catch (error) {
      setResultado(null);
    }
  }, [dadosSimulados, formula]);

  const handleChange = (campo: string, valor: string) => {
    setDadosSimulados({ ...dadosSimulados, [campo]: parseFloat(valor) || 0 });
  };

  return (
    <Card className="mt-6">
      <CardContent className="space-y-4">
        <h2 className="text-lg font-semibold">🔍 Resultado da Simulação</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {camposBase.map((campo) => (
            <div key={campo}>
              <label className="text-sm font-medium text-gray-700">{campo}</label>
              <input
                type="number"
                value={dadosSimulados[campo] ?? ""}
                onChange={(e) => handleChange(campo, e.target.value)}
                className="w-full border px-2 py-1 rounded"
              />
            </div>
          ))}
        </div>

        <div className="pt-4 border-t">
          <p className="text-gray-600">Fórmula: <code>{formula}</code></p>
          <p className="text-xl font-bold text-green-600">Resultado: {resultado !== null ? `R$ ${resultado.toFixed(2)}` : "Erro na fórmula"}</p>
        </div>
      </CardContent>
    </Card>
  );
}
