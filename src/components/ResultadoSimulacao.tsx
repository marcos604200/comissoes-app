import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";

interface Props {
  camposBase: string[];
  formula: string;
}

export default function ResultadoSimulacao({ camposBase, formula }: Props) {
  const [resultado, setResultado] = useState<string>("");

  const dadosSimulados: Record<string, number> = {
    frete: 800,
    pedagio: 50,
    taxa: 25,
    armazenagem: 300,
    guia: 60,
    seguro: 45,
    agenciamento: 90,
    "ct-e": 150
  };

  const interpretarFormula = async () => {
    try {
      let expressao = formula
        .replace(/=+/g, "")
        .replace(/\b([a-zA-Z0-9\-_]+)\b/g, (match) => {
          if (Object.keys(dadosSimulados).includes(match)) {
            return `(${dadosSimulados[match]})`;
          }
          return match;
        })
        .replace(/MEDIA\(([^)]+)\)/gi, (_: string, valores: string) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          const soma = val.reduce((a: number, b: number) => a + b, 0);
          return (soma / val.length).toString();
        })
        .replace(/DESVPAD\(([^)]+)\)/gi, (_: string, valores: string) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          const m = val.reduce((a: number, b: number) => a + b, 0) / val.length;
          const somaQuadrados = val.reduce((a: number, b: number) => a + Math.pow(b - m, 2), 0);
          return Math.sqrt(somaQuadrados / val.length).toString();
        })
        .replace(/MINIMO\(([^)]+)\)/gi, (_: string, valores: string) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          return Math.min(...val).toString();
        })
        .replace(/MAXIMO\(([^)]+)\)/gi, (_: string, valores: string) => {
          const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
          return Math.max(...val).toString();
        })
        .replace(/ABS\(([^)]+)\)/gi, (_: string, valor: string) => {
          return Math.abs(parseFloat(valor.trim())).toString();
        })
        .replace(/ARRED\(([^,]+),\s*([^)]+)\)/gi, (_: string, val: string, casas: string) => {
          return parseFloat(parseFloat(val.trim()).toFixed(parseInt(casas.trim()))).toString();
        });

      if (/RECEITA\(([^)]+)\)/gi.test(expressao)) {
        const matches = [...expressao.matchAll(/RECEITA\(([^,]+),\s*([^)]+)\)/gi)];
        for (const match of matches) {
          const [completo, colab, receita] = match;
          const colabClean = colab.replace(/['"]+/g, '').trim();
          const receitaClean = receita.replace(/['"]+/g, '').trim();

          const { data, error } = await supabase
            .from("receitas")
            .select("valor")
            .eq("colaborador", colabClean)
            .eq("tipo_receita", receitaClean);

          const valor = data && data[0] ? data[0].valor : 0;
          expressao = expressao.replace(completo, valor.toString());
        }
      }

      const resultadoFinal = eval(expressao);
      setResultado(resultadoFinal.toFixed(2));
    } catch (error) {
      setResultado("Erro ao interpretar a fórmula. Verifique a sintaxe.");
    }
  };

  useEffect(() => {
    interpretarFormula();
  }, [formula]);

  return (
    <div className="mt-4 bg-yellow-100 p-4 rounded shadow">
      <h4 className="font-bold mb-2">📉 Resultado da Simulação</h4>
      <p><strong>Expressão interpretada:</strong> {formula}</p>
      <p><strong>Resultado:</strong> {resultado}</p>
    </div>
  );
}
