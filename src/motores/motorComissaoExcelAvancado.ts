
// utils/motorComissaoExcelAvancado.ts

type ReceitaPorTipo = {
  [tipo_receita: string]: number;
};

type ReceitaColaborador = {
  [colaborador: string]: ReceitaPorTipo;
};

type RegraComissaoExcelAvancada = {
  descricao: string;
  tipo: "comissao_dependente_excel";
  destinatario: string;
  dependencias: {
    colaborador: string;
    porcentagens: {
      [tipo_receita: string]: number;
    };
  }[];
  funcoes_extra?: string[];
};

type DetalhamentoComissao = {
  colaborador: string;
  tipo_receita: string;
  receita: number;
  percentual: number;
  valor: number;
};

// Funções Excel-like
function somases(valores: number[], criterios: ((v: number) => boolean)[]): number {
  return valores.reduce((acc, v) => criterios.every(f => f(v)) ? acc + v : acc, 0);
}

function contSe(valores: number[], criterio: (v: number) => boolean): number {
  return valores.filter(criterio).length;
}

function contSes(valores: number[], criterios: ((v: number) => boolean)[]): number {
  return valores.filter(v => criterios.every(c => c(v))).length;
}

function indice(matriz: any[][], linha: number, coluna: number): any {
  return matriz[linha - 1]?.[coluna - 1];
}

function corresp(valor: any, intervalo: any[]): number {
  return intervalo.findIndex(v => v === valor) + 1;
}

function procv(valor: any, matriz: any[][], coluna: number): any {
  const linha = matriz.find(r => r[0] === valor);
  return linha ? linha[coluna - 1] : null;
}

function procx(valor: any, pesquisa: any[], resultado: any[]): any {
  const idx = pesquisa.findIndex(v => v === valor);
  return idx >= 0 ? resultado[idx] : null;
}

export function executarRegraExcelAvancada(
  receitas: ReceitaColaborador,
  regra: RegraComissaoExcelAvancada
) {
  let total = 0;
  const detalhes: DetalhamentoComissao[] = [];
  const todosValores: number[] = [];

  for (const dep of regra.dependencias) {
    const receitasColab = receitas[dep.colaborador] || {};
    for (const tipo in dep.porcentagens) {
      const percentual = dep.porcentagens[tipo];
      const receita = receitasColab[tipo] || 0;
      const valor = (receita * percentual) / 100;
      total += valor;
      detalhes.push({
        colaborador: dep.colaborador,
        tipo_receita: tipo,
        receita,
        percentual,
        valor
      });
      todosValores.push(receita);
    }
  }

  const extras: any = {};

  if (regra.funcoes_extra) {
    if (regra.funcoes_extra.includes("somases")) {
      extras.somases = somases(todosValores, [(v) => v > 10000]);
    }
    if (regra.funcoes_extra.includes("cont.se")) {
      extras.cont_se = contSe(todosValores, (v) => v > 5000);
    }
    if (regra.funcoes_extra.includes("cont.ses")) {
      extras.cont_ses = contSes(todosValores, [(v) => v > 5000, (v) => v < 20000]);
    }
    if (regra.funcoes_extra.includes("indice_corresp")) {
      const matriz = [[1000, "A"], [5000, "B"], [10000, "C"]];
      const idx = corresp(5000, matriz.map(r => r[0]));
      extras.indice_corresp = indice(matriz, idx, 2);
    }
    if (regra.funcoes_extra.includes("procv")) {
      const matriz = [[1000, "Baixo"], [5000, "Médio"], [10000, "Alto"]];
      extras.procv = procv(5000, matriz, 2);
    }
    if (regra.funcoes_extra.includes("procx")) {
      extras.procx = procx(5000, [1000, 5000, 10000], ["Baixo", "Médio", "Alto"]);
    }
  }

  return {
    destinatario: regra.destinatario,
    total_comissao: total,
    detalhes,
    extras,
    justificativa: regra.descricao
  };
}

