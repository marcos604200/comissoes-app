import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ResultadoSimulacaoProps {
  camposBase: string[];
  formula: string;
}

export default function ResultadoSimulacao({ camposBase, formula }: ResultadoSimulacaoProps) {
  const [dados, setDados] = useState<any[]>([]);
  const [resultado, setResultado] = useState<string[]>([]);

  useEffect(() => {
    const buscarDados = async () => {
      const { data, error } = await supabase.from("dados_simulacao").select("*");
      if (data && !error) {
        setDados(data);
      }
    };
    buscarDados();
  }, []);

  useEffect(() => {
    if (dados.length === 0) return;

    const interpretada = formula
      .replace(/RECEITA\("([^"]+)",\s*"([^"]+)"\)/gi, (_: string, colaborador: string, campo: string) => {
        const colaboradorDados = dados.find((d) => d.colaborador === colaborador);
        return colaboradorDados?.[campo] ?? 0;
      })
      .replace(/SE\(([^,]+),([^,]+),([^)]+)\)/gi, (_, cond, v1, v2) => `(${cond} ? ${v1} : ${v2})`)
      .replace(/SOMA\(([^)]+)\)/gi, (_, valores) => {
        const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
        return val.reduce((a: number, b: number) => a + b, 0).toString();
      })
      .replace(/MÉDIA\(([^)]+)\)/gi, (_, valores) => {
        const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
        const soma = val.reduce((a: number, b: number) => a + b, 0);
        return (soma / val.length).toString();
      })
      .replace(/DESVPAD\(([^)]+)\)/gi, (_, valores) => {
        const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
        const m = val.reduce((a: number, b: number) => a + b, 0) / val.length;
        const dp = Math.sqrt(val.reduce((acc: number, curr: number) => acc + Math.pow(curr - m, 2), 0) / val.length);
        return dp.toString();
      })
      .replace(/MÍNIMO\(([^)]+)\)/gi, (_, valores) => {
        const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
        return Math.min(...val).toString();
      })
      .replace(/MÁXIMO\(([^)]+)\)/gi, (_, valores) => {
        const val = valores.split(",").map((v: string) => parseFloat(v.trim()));
        return Math.max(...val).toString();
      });

    const novoResultado = dados.map((item) => {
      let f = interpretada;
      camposBase.forEach((campo) => {
        const regex = new RegExp(`\\b${campo}\\b`, "g");
        f = f.replace(regex, item[campo] ?? 0);
      });

      try {
        return eval(f.replace("=", "")).toFixed(2);
      } catch {
        return "Erro na fórmula";
      }
    });

    setResultado(novoResultado);
  }, [dados, camposBase, formula]);

  return (
    <div className="mt-8">
      <h3 className="text-xl font-bold mb-6">💡 Resultado da Simulação</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dados.map((item, index) => (
          <Card key={index} className="shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="p-4">
              <p className="font-semibold text-sm text-gray-800">Colaborador: {item.colaborador}</p>
              <p className="text-sm text-gray-600 mt-1">
                Resultado: <span className="font-bold text-green-600">{resultado[index]}</span>
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
