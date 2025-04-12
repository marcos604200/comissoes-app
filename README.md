
# Motor de Cálculo de Comissões (Avançado)

Este pacote contém múltiplos motores de cálculo de comissões escritos em TypeScript, com suporte para:

- Regras simples (condicionais)
- Dependência entre colaboradores
- Percentuais por tipo de receita
- Funções avançadas inspiradas no Excel

## 📦 Arquivos incluídos

| Arquivo                                 | Descrição |
|----------------------------------------|-----------|
| `motorComissao.ts`                     | Motor básico com condições (if, else) |
| `motorComissaoDependente.ts`           | Percentuais diferentes por colaborador subordinado |
| `motorComissaoDependenteAvancado.ts`   | Percentuais diferentes por colaborador e tipo de receita |
| `motorComissaoExcelAvancado.ts`        | Adiciona suporte a funções como SOMASES, PROCV, CONT.SE |

---

## 🧠 Exemplo de estrutura de regra (dependente avançado)

```ts
const regra = {
  descricao: "Gerente Carlos - Comissão escalonada",
  tipo: "comissao_dependente_excel",
  destinatario: "carlos",
  dependencias: [
    {
      colaborador: "amanda",
      porcentagens: {
        frete: 2,
        armazenagem: 1
      }
    },
    {
      colaborador: "bruno",
      porcentagens: {
        comissao_terceiros: 3
      }
    }
  ],
  funcoes_extra: ["media", "cont.se", "procv"]
};
```

## 📐 Funções Avançadas Disponíveis

| Nome           | Descrição |
|----------------|----------|
| `media`        | Média dos valores de receita |
| `desvio`       | Desvio padrão das receitas |
| `potencia`     | Aplica potência (² por padrão) |
| `minmax`       | Retorna o menor e maior valor |
| `somases`      | Soma valores que atendem a múltiplos critérios |
| `cont.se`      | Conta valores que atendem a 1 critério |
| `cont.ses`     | Conta valores que atendem a múltiplos critérios |
| `indice_corresp` | Simula o comportamento de ÍNDICE + CORRESP |
| `procv`        | Pesquisa vertical como no Excel |
| `procx`        | Pesquisa mais flexível entre listas |

---

## 🔧 Exemplo de uso

```ts
import { executarRegraExcelAvancada } from './motorComissaoExcelAvancado';

const dados = {
  amanda: { frete: 12000, armazenagem: 3000 },
  bruno: { frete: 5000, comissao_terceiros: 7000 }
};

const resultado = executarRegraExcelAvancada(dados, regra);
console.log(resultado);
```

---

## 🧩 Sugestão Extra

Você pode unificar todas as regras criando um **motor centralizador**, que analisa o campo `tipo` da regra e delega para o motor correspondente. Isso permite organizar tudo em um único ponto de entrada.

```ts
export function calcularComissaoCentral(dados, regra) {
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
```

