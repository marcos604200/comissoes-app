
export type RegraComissaoExcelAvancada = {
  descricao: string;
  tipo: "comissao_dependente_excel";
  destinatario: string;
  dependencias: {
    colaborador: string;
    porcentagens: {
      [tipoReceita: string]: number;
    };
  }[];
  funcoes_extra?: string[];
};

export function executarRegraExcelAvancada(
  dados: Record<string, Record<string, number>>,
  regra: RegraComissaoExcelAvancada
): Record<string, number> {
  let total = 0;

  for (const dependencia of regra.dependencias) {
    const colaboradorDados = dados[dependencia.colaborador] || {};
    for (const tipo in dependencia.porcentagens) {
      const percentual = dependencia.porcentagens[tipo] || 0;
      const valorBase = colaboradorDados[tipo] || 0;
      total += (valorBase * percentual) / 100;
    }
  }

  // Aplica funções extras
  if (regra.funcoes_extra?.length) {
    for (const func of regra.funcoes_extra) {
      switch (func) {
        case "media":
          total = total / regra.dependencias.length;
          break;

        case "potencia":
          total = total ** 2;
          break;

        case "desvio":
          const valores: number[] = [];
          for (const d of regra.dependencias) {
            const v = Object.entries(d.porcentagens)
              .map(([tipo, perc]) => ((dados[d.colaborador]?.[tipo] || 0) * perc) / 100)
              .reduce((a, b) => a + b, 0);
            valores.push(v);
          }
          const media = valores.reduce((a, b) => a + b, 0) / valores.length;
          const variancia = valores.reduce((sum, v) => sum + (v - media) ** 2, 0) / valores.length;
          total = Math.sqrt(variancia);
          break;

        case "minmax":
          const valoresMM: number[] = [];
          for (const d of regra.dependencias) {
            const v = Object.entries(d.porcentagens)
              .map(([tipo, perc]) => ((dados[d.colaborador]?.[tipo] || 0) * perc) / 100)
              .reduce((a, b) => a + b, 0);
            valoresMM.push(v);
          }
          total = Math.max(...valoresMM) + Math.min(...valoresMM);
          break;

        case "se":
          if (total > 10000) {
            total = total * 1.1;
          }
          break;

        case "ses":
          if (total > 20000 && regra.destinatario.startsWith("g")) {
            total = total * 1.2;
          }
          break;

        case "somase":
          total = 0;
          for (const d of regra.dependencias) {
            for (const [tipo, perc] of Object.entries(d.porcentagens)) {
              if (tipo.includes("frete")) {
                const valor = (dados[d.colaborador]?.[tipo] || 0) * perc / 100;
                total += valor;
              }
            }
          }
          break;

        case "somases":
          total = 0;
          for (const d of regra.dependencias) {
            if (d.colaborador.startsWith("a")) {
              for (const [tipo, perc] of Object.entries(d.porcentagens)) {
                if (tipo.includes("armazenagem")) {
                  const valor = (dados[d.colaborador]?.[tipo] || 0) * perc / 100;
                  total += valor;
                }
              }
            }
          }
          break;

        default:
          break;
      }
    }
  }

  return {
    [regra.destinatario]: parseFloat(total.toFixed(2))
  };
}
