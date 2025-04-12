
// utils/motorComissao.ts

type Contexto = {
  [variavel: string]: number | string;
};

type Condicao = {
  campo: string;
  operador: string;
  valor: number | string;
};

type Efeito = {
  tipo: "percentual" | "fixo";
  valor: number;
  sobre: string; // ex: "receita_individual"
};

type RegraComissao = {
  descricao: string;
  tipo: string;
  condicoes: Condicao[];
  efeito: Efeito;
};

export function avaliarCondicao(contexto: Contexto, condicao: Condicao): boolean {
  const valorCampo = contexto[condicao.campo];
  const valorCondicao = condicao.valor;

  switch (condicao.operador) {
    case ">": return valorCampo > valorCondicao;
    case "<": return valorCampo < valorCondicao;
    case ">=": return valorCampo >= valorCondicao;
    case "<=": return valorCampo <= valorCondicao;
    case "==": return valorCampo == valorCondicao;
    case "!=": return valorCampo != valorCondicao;
    default: return false;
  }
}

export function executarRegra(contexto: Contexto, regra: RegraComissao) {
  const todasCondicoes = regra.condicoes.every(cond => avaliarCondicao(contexto, cond));
  if (!todasCondicoes) {
    return {
      comissao: 0,
      aplicado: false,
      justificativa: "Condições não atendidas"
    };
  }

  const base = contexto[regra.efeito.sobre] as number;
  let comissao = 0;

  if (regra.efeito.tipo === "percentual") {
    comissao = (base * regra.efeito.valor) / 100;
  } else {
    comissao = regra.efeito.valor;
  }

  return {
    comissao,
    aplicado: true,
    percentual: regra.efeito.tipo === "percentual" ? regra.efeito.valor : null,
    base,
    justificativa: regra.descricao
  };
}

