
// utils/motorComissaoDependenteAvancado.ts

type ReceitaPorTipo = {
  [tipo_receita: string]: number;
};

type ReceitaColaborador = {
  [colaborador: string]: ReceitaPorTipo;
};

type RegraComissaoDependenteAvancada = {
  descricao: string;
  tipo: "comissao_dependente_avancada";
  destinatario: string;
  dependencias: {
    colaborador: string;
    porcentagens: {
      [tipo_receita: string]: number;
    };
  }[];
  funcoes_extra?: string[]; // exemplo: ["media", "desvio"]
};

type DetalhamentoComissao = {
  colaborador: string;
  tipo_receita: string;
  receita: number;
  percentual: number;
  valor: number;
};

function calcularMedia(valores: number[]): number {
  if (valores.length === 0) return 0;
  return valores.reduce((a, b) => a + b, 0) / valores.length;
}

function calcularDesvioPadrao(valores: number[]): number {
  const media = calcularMedia(valores);
  const variancia = calcularMedia(valores.map(x => Math.pow(x - media, 2)));
  return Math.sqrt(variancia);
}

function calcularPotencia(base: number, expoente: number): number {
  return Math.pow(base, expoente);
}

function calcularMinMax(valores: number[]): { min: number; max: number } {
  return {
    min: Math.min(...valores),
    max: Math.max(...valores)
  };
}

export function executarRegraDependenteAvancada(
  receitas: ReceitaColaborador,
  regra: RegraComissaoDependenteAvancada
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

  // Aplicar funções extras se houver
  const extras: any = {};
  if (regra.funcoes_extra) {
    if (regra.funcoes_extra.includes("media")) {
      extras.media = calcularMedia(todosValores);
    }
    if (regra.funcoes_extra.includes("desvio")) {
      extras.desvio_padrao = calcularDesvioPadrao(todosValores);
    }
    if (regra.funcoes_extra.includes("minmax")) {
      extras.minmax = calcularMinMax(todosValores);
    }
    if (regra.funcoes_extra.includes("potencia")) {
      extras.potencia = todosValores.map(v => calcularPotencia(v, 2));
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

