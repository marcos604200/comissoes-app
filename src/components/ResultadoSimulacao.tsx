import { useEffect, useState } from "react";

interface ResultadoSimulacaoProps {
  camposBase: string[];
  formula: string;
}

export default function ResultadoSimulacao({ camposBase, formula }: ResultadoSimulacaoProps) {
  const [expressaoInterpretada, setExpressaoInterpretada] = useState<string>("");
  const [resultado, setResultado] = useState<number | null>(null);
  const [erro, setErro] = useState<string>("");

  useEffect(() => {
    const dadosSimulados: Record<string, number> = {
      frete: 1000,
      pedagio: 200,
      taxa: 50,
      armazenagem: 3000,
      "ct-e": 800,
      guia: 150,
      seguro: 120,
      agenciamento: 400,
    };

    try {
      let expr = formula
        .replace(/=/g, "")
        .replace(/\[/g, "")
        .replace(/\]/g, "")
        .replace(/([a-zA-Z0-9\-]+)/g, (match) => {
          const valor = dadosSimulados[match];
          if (typeof valor !== "undefined") {
            return valor.toString();
          }
          return match;
        })
        // Funções Excel simuladas
        .replace(/MEDIA\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          const soma = val.reduce((a: number, b: number) => a + b, 0);
          return (soma / val.length).toString();
        })
        .replace(/SOMA\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          const soma = val.reduce((a: number, b: number) => a + b, 0);
          return soma.toString();
        })
        .replace(/MÍNIMO\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          return Math.min(...val).toString();
        })
        .replace(/MÁXIMO\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          return Math.max(...val).toString();
        })
        .replace(/ABS\(([^)]+)\)/gi, (_, valor) => {
          return Math.abs(parseFloat(valor.trim())).toString();
        })
        .replace(/DESVPAD\(([^)]+)\)/gi, (_, valores) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          const media = val.reduce((a: number, b: number) => a + b, 0) / val.length;
          const somaQuadrados = val.map((v: number) => Math.pow(v - media, 2)).reduce((a: number, b: number) => a + b, 0);
          return Math.sqrt(somaQuadrados / val.length).toString();
        })
        .replace(/ARRED\(([^,]+),\s*([^)]+)\)/gi, (_, valor, casas) => {
          return parseFloat(valor.trim()).toFixed(parseInt(casas.trim()));
        });

      const resultadoCalculado = Function(`"use strict"; return (${expr})`)();

      setExpressaoInterpretada("=" + expr);
      setResultado(resultadoCalculado);
      setErro("");
    } catch (err) {
      setErro("Erro ao interpretar a fórmula. Verifique a sintaxe.");
      setExpressaoInterpretada("=" + formula);
      setResultado(null);
    }
  }, [camposBase, formula]);

  return (
    <div className="mt-6 p-4 border rounded bg-gray-50">
      <h3 className="font-bold text-lg mb-2">📈 Resultado da Simulação</h3>
      {erro ? (
        <p className="text-red-600 text-sm mb-2">{erro}</p>
      ) : (
        <p className="text-green-700 text-sm mb-2">Expressão interpretada: {expressaoInterpretada}</p>
      )}

      {resultado !== null && (
        <p className="text-blue-800 font-semibold text-xl">Resultado: {resultado.toFixed(2)}</p>
      )}
    </div>
  );
}
