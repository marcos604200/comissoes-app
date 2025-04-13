// src/components/ResultadoSimulacao.tsx
interface Props {
  camposBase: string[];
  formula: string;
}

export default function ResultadoSimulacao({ camposBase, formula }: Props) {
  const dadosSimulados: Record<string, number> = {
    frete: 12000,
    armazenagem: 3000,
    pedagio: 800,
    taxa: 500,
  };

  const substituirFuncoesAvancadas = (input: string): string => {
    return input
      .replace(/SOMASE\(([^,]+),([^,]+),([^)]+)\)/gi, (_, intervalo, criterio, soma) => {
        return `${soma}.filter((_: any, i: number) => ${intervalo}[i] === ${criterio}).reduce((a: number, b: number) => a + b, 0)`;
      })
      .replace(/SOMASES\(([^)]+)\)/gi, (_, args) => {
        const partes = args.split(",").map((p: string) => p.trim());
        const condicoes: string[] = [];
        for (let i = 0; i < partes.length - 1; i += 2) {
          condicoes.push(`(${partes[i]}[i] === ${partes[i + 1]})`);
        }
        return `${partes.at(-1)}.filter((_: any, i: number) => ${condicoes.join(" && ")}).reduce((a: number, b: number) => a + b, 0)`;
      })
      .replace(/PROCV\(([^,]+),([^,]+),([^)]+)\)/gi, (_, valor, matriz, coluna) => {
        return `${matriz}.find((r: any[]) => r[0] === ${valor})?.[${coluna} - 1] ?? 0`;
      })
      .replace(/CONT\.SE\(([^,]+),([^)]+)\)/gi, (_, intervalo, criterio) => {
        return `${intervalo}.filter((v: any) => v === ${criterio}).length`;
      })
      .replace(/CONT\.SES\(([^)]+)\)/gi, (_, args) => {
        const partes = args.split(",").map((p: string) => p.trim());
        const condicoes: string[] = [];
        for (let i = 0; i < partes.length; i += 2) {
          condicoes.push(`(${partes[i]}[i] === ${partes[i + 1]})`);
        }
        return `${partes[0]}.filter((_: any, i: number) => ${condicoes.join(" && ")}).length`;
      })
      .replace(/ÍNDICE\(([^,]+),([^)]+)\)/gi, (_, array, linha) => {
        return `${array}[${linha} - 1]`;
      })
      .replace(/CORRESP\(([^,]+),([^)]+)\)/gi, (_, valor, intervalo) => {
        return `${intervalo}.indexOf(${valor}) + 1`;
      })
      .replace(/MÉDIA\(([^)]+)\)/gi, (_, valores) => {
        return `(${valores}.reduce((a: number, b: number) => a + b, 0) / ${valores}.length)`;
      })
      .replace(/DESVPAD\(([^)]+)\)/gi, (_, valores) => {
        return `(() => {
          const m = ${valores}.reduce((a: number, b: number) => a + b, 0) / ${valores}.length;
          return Math.sqrt(${valores}.map((v: number) => Math.pow(v - m, 2)).reduce((a: number, b: number) => a + b, 0) / ${valores}.length);
        })()`;
      })
      .replace(/MÍNIMO\(([^)]+)\)/gi, (_, valores) => {
        return `Math.min(...${valores})`;
      })
      .replace(/MÁXIMO\(([^)]+)\)/gi, (_, valores) => {
        return `Math.max(...${valores})`;
      })
      .replace(/ABS\(([^)]+)\)/gi, (_, valor) => {
        return `Math.abs(${valor})`;
      })
      .replace(/ARRED\(([^,]+),([^)]+)\)/gi, (_, valor, casas) => {
        return `Number(${valor}).toFixed(${casas})`;
      })
      .replace(/SE\(([^,]+),([^,]+),([^)]+)\)/gi, (_, cond, vTrue, vFalse) => {
        return `(${cond}) ? (${vTrue}) : (${vFalse})`;
      });
  };

  const formulaComFuncoes = substituirFuncoesAvancadas(formula);

  const formulaInterpretada = formulaComFuncoes.replace(/\[([^\]]+)\]/g, (_, campo: string) => {
    return String(dadosSimulados[campo] ?? 0);
  });

  let resultadoFinal = 0;
  let erro: string | null = null;

  try {
    const jsFormula = formulaInterpretada.replace(/^=/, "");
    resultadoFinal = Function(`"use strict"; return (${jsFormula})`)();
  } catch (e) {
    erro = "Erro ao interpretar a fórmula. Verifique a sintaxe.";
  }

  return (
    <div className="bg-gray-50 p-4 rounded mt-4 border">
      <h4 className="font-bold mb-2">🧪 Resultado da Simulação</h4>
      {erro ? (
        <p className="text-red-600">{erro}</p>
      ) : (
        <p className="text-green-700">
          Valor com base em <strong>{camposBase.join(", ")}</strong>:{" "}
          <span className="font-bold">R$ {resultadoFinal.toFixed(2)}</span>
        </p>
      )}
      <p className="text-sm text-gray-500 mt-1">Expressão interpretada: {formulaInterpretada}</p>
    </div>
  );
}
