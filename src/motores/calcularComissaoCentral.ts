type RegraComissao = {
  tipo: string;
  [chave: string]: any;
};

export function calcularComissaoCentral(dados: any, regra: RegraComissao) {
  switch (regra.tipo) {
    case "comissao_dependente_excel":
      return executarRegraExcelAvancada(dados, regra);
    case "comissao_dependente_avancada":
      return executarRegraDependenteAvancada(dados, regra);
    case "comissao_dependente":
      return executarRegraDependente(dados, regra);
    default:
      return executarRegra(dados, regra);
  }
}
