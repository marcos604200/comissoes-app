// src/components/ResultadoSimulacao.tsx
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ResultadoSimulacaoProps {
  camposBase: string[];
  formula: string;
}

export default function ResultadoSimulacao({ camposBase, formula }: ResultadoSimulacaoProps) {
  const [resultado, setResultado] = useState<number | null>(null);
  const [dadosSimulados, setDadosSimulados] = useState<Record<string, number>>({});
  const [dependencias, setDependencias] = useState<Record<string, number>>({});

  useEffect(() => {
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
        .replace(/PROCV\(([^,]+),([^,]+),([^,]+)\)/gi, (_, valor, matriz, coluna) => {
          return "0"; // Implementação futura
        })
        .replace(/DEPENDENCIA\("([^"]+)",\s*"([^"]+)"\)/gi, (_, colaborador, campo) => {
          return String(dependencias[`${colaborador}_${campo}`] ?? 0);
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
  }, [dadosSimulados, dependencias, formula]);

  const handleChange = (campo: string, valor: string) => {
    setDadosSimulados({ ...dadosSimulados, [campo]: parseFloat(valor) || 0 });
  };

  const handleDependenciaChange = (colaborador: string, campo: string, valor: string) => {
    const chave = `${colaborador}_${campo}`;
    setDependencias({ ...dependencias, [chave]: parseFloat(valor) || 0 });
  };

  const gerarPDF = () => {
    const doc = new jsPDF();
    doc.text("Memória de Cálculo da Comissão", 14, 16);

    autoTable(doc, {
      head: [["Campo", "Valor"]],
      body: [...Object.entries(dadosSimulados), ...Object.entries(dependencias)].map(([key, value]) => [key, value.toFixed(2)]),
      startY: 24,
    });

    doc.text(`Fórmula: ${formula}`, 14, doc.autoTable.previous.finalY + 10);
    doc.text(`Resultado: R$ ${resultado?.toFixed(2) ?? "Erro"}`, 14, doc.autoTable.previous.finalY + 20);

    doc.save("relatorio-comissao.pdf");
  };

  return (
    <Card className="mt-6">
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">🔍 Resultado da Simulação</h2>
          <button
            onClick={gerarPDF}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Exportar PDF
          </button>
        </div>

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

        <h3 className="text-md font-semibold mt-6">📎 Dependências entre Colaboradores</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {["João", "Maria"].flatMap((colab) =>
            camposBase.map((campo) => (
              <div key={`${colab}_${campo}`}>
                <label className="text-sm text-gray-700">{`${colab} - ${campo}`}</label>
                <input
                  type="number"
                  value={dependencias[`${colab}_${campo}`] ?? ""}
                  onChange={(e) => handleDependenciaChange(colab, campo, e.target.value)}
                  className="w-full border px-2 py-1 rounded"
                />
              </div>
            ))
          )}
        </div>

        <div className="pt-4 border-t">
          <p className="text-gray-600">Fórmula: <code>{formula}</code></p>
          <p className="text-xl font-bold text-green-600">
            Resultado: {resultado !== null ? `R$ ${resultado.toFixed(2)}` : "Erro na fórmula"}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
