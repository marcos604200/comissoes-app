
// utils/motorComissaoDependente.ts

type ReceitaPorColaborador = {
  [colaborador: string]: number;
};

type RegraComissaoDependente = {
  descricao: string;
  tipo: "comissao_dependente";
  destinatario: string;
  dependencias: {
    colaborador: string;
    percentual: number;
  }[];
};

export function executarRegraDependente(
  receitas: ReceitaPorColaborador,
  regra: RegraComissaoDependente
) {
  let total = 0;
  const detalhes: { colaborador: string; receita: number; percentual: number; valor: number }[] = [];

  for (const dep of regra.dependencias) {
    const receita = receitas[dep.colaborador] || 0;
    const valor = (receita * dep.percentual) / 100;
    total += valor;
    detalhes.push({
      colaborador: dep.colaborador,
      receita,
      percentual: dep.percentual,
      valor
    });
  }

  return {
    destinatario: regra.destinatario,
    total_comissao: total,
    detalhes,
    justificativa: regra.descricao
  };
}

