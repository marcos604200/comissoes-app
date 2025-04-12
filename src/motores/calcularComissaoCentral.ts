import { executarRegra } from "./motorComissao";
import { executarRegraDependente } from "./motorComissaoDependente";
import { executarRegraDependenteAvancada } from "./motorComissaoDependenteAvancado";
import { executarRegraExcelAvancada } from "./motorComissaoExcelAvancado";

// NÃO precisa importar tipos específicos com muitas linhas

export function calcularComissaoCentral(dados: any, regra: any) {
  switch (regra.tipo) {
    case "comissao_dependente_excel":
      return executarRegraExcelAvancada(dados, regra); // ← aceita regra como 'any'
    case "comissao_dependente_avancada":
      return executarRegraDependenteAvancada(dados, regra);
    case "comissao_dependente":
      return executarRegraDependente(dados, regra);
    default:
      return executarRegra(dados, regra);
  }
}
