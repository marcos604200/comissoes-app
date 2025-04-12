
'use client';
import { useState, useEffect } from "react";
import { calcularComissaoCentral } from "@/motores/calcularComissaoCentral";
import { supabase } from "@/utils/supabase";
import ResultadoSimulacao from "./ResultadoSimulacao";

export default function ConstrutorRegras() {
  const [destinatario, setDestinatario] = useState("");
  const [colaboradores, setColaboradores] = useState([
    { nome: "", tiposReceita: [{ tipo: "", percentual: 0 }] }
  ]);
  const [funcoesExtras, setFuncoesExtras] = useState<string[]>([]);
  const [simular, setSimular] = useState(false);
  const [resultadoSimulacao, setResultadoSimulacao] = useState<Record<string, any> | null>(null);
  const [regrasSalvas, setRegrasSalvas] = useState<{ id: number; regra_json: any }[]>([]);

  const tiposFuncoes = [
    "media", "desvio", "potencia", "minmax",
    "se", "ses", "somase", "somases",
    "cont.se", "cont.ses", "indice_corresp", "procv", "procx"
  ];

  const atualizarColaborador = (
  index: number,
  campo: "nome" | "tiposReceita",
  valor: any
) => {
  const atualizado = [...colaboradores];
  atualizado[index] = {
    ...atualizado[index],
    [campo]: valor,
  };
  setColaboradores(atualizado);
};

 const atualizarTipoReceita = (
  colabIndex: number,
  tipoIndex: number,
  campo: "tipo" | "percentual",
  valor: string | number
) => {
  const atualizado = [...colaboradores];
  atualizado[colabIndex].tiposReceita[tipoIndex][campo] = valor as never;
  setColaboradores(atualizado);
};

  const adicionarColaborador = () => {
    setColaboradores([...colaboradores, { nome: "", tiposReceita: [{ tipo: "", percentual: 0 }] }]);
  };

  const adicionarTipoReceita = (index: number) => {
    const atualizado = [...colaboradores];
    atualizado[index].tiposReceita.push({ tipo: "", percentual: 0 });
    setColaboradores(atualizado);
  };

  const alternarFuncao = (func: string) => {
    setFuncoesExtras(prev =>
      prev.includes(func) ? prev.filter(f => f !== func) : [...prev, func]
    );
  };

  const regra = {
    descricao: "Regra criada via interface",
    tipo: "comissao_dependente_excel",
    destinatario,
    dependencias: colaboradores.map(c => ({
      colaborador: c.nome,
      porcentagens: Object.fromEntries(c.tiposReceita.map(tr => [tr.tipo, tr.percentual]))
    })),
    funcoes_extra: funcoesExtras
  };

  const dadosTeste = {
    amanda: { frete: 12000, armazenagem: 3000 },
    bruno: { frete: 5000, comissao_terceiros: 7000 },
    lucas: { armazenagem: 10000 }
  };

  const simularCalculo = () => {
    const resultado = calcularComissaoCentral(dadosTeste, regra);
    setResultadoSimulacao(resultado);
    setSimular(true);
  };

  const salvarRegra = async () => {
    const { error } = await supabase.from("regras_comissao").insert([{ regra_json: regra }]);
    if (!error) buscarRegras();
  };

  const buscarRegras = async () => {
    const { data } = await supabase.from("regras_comissao").select("id, regra_json").order("id", { ascending: false });
    setRegrasSalvas(data);
  };

  const excluirRegra = async (id) => {
    await supabase.from("regras_comissao").delete().eq("id", id);
    buscarRegras();
  };

  useEffect(() => {
    buscarRegras();
  }, []);

  return (
    <div className="p-4 bg-white rounded-xl shadow-md">
      <h2 className="text-xl font-bold mb-4">🔧 Construtor de Regra de Comissão</h2>

      <label>Destinatário (Gerente)</label>
      <input value={destinatario} onChange={e => setDestinatario(e.target.value)} className="border p-2 w-full mb-4" />

      {colaboradores.map((colab, i) => (
        <div key={i} className="mb-4 border p-2 rounded">
          <label>Colaborador</label>
          <input value={colab.nome} onChange={e => atualizarColaborador(i, "nome", e.target.value)} className="border p-1 w-full mb-2" />

          {colab.tiposReceita.map((tr, j) => (
            <div key={j} className="flex gap-2 mb-2">
              <input placeholder="Tipo Receita" value={tr.tipo} onChange={e => atualizarTipoReceita(i, j, "tipo", e.target.value)} className="border p-1 w-1/2" />
              <input placeholder="%" type="number" value={tr.percentual} onChange={e => atualizarTipoReceita(i, j, "percentual", +e.target.value)} className="border p-1 w-1/4" />
            </div>
          ))}

          <button onClick={() => adicionarTipoReceita(i)} className="text-blue-600 text-sm">+ Tipo de Receita</button>
        </div>
      ))}

      <button onClick={adicionarColaborador} className="bg-blue-500 text-white px-4 py-2 rounded mb-4">+ Colaborador</button>

      <h3 className="font-semibold mb-2">Funções Avançadas</h3>
      <div className="grid grid-cols-2 gap-2 mb-4">
        {tiposFuncoes.map(func => (
          <label key={func} className="flex items-center gap-2">
            <input type="checkbox" checked={funcoesExtras.includes(func)} onChange={() => alternarFuncao(func)} />
            {func}
          </label>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={simularCalculo} className="bg-green-600 text-white px-4 py-2 rounded">Simular Cálculo</button>
        <button onClick={salvarRegra} className="bg-blue-700 text-white px-4 py-2 rounded">Salvar Regra</button>
      </div>

      <h4 className="font-bold">📦 JSON da Regra</h4>
      <pre className="bg-gray-100 p-2 rounded text-sm overflow-x-auto">
        {JSON.stringify(regra, null, 2)}
      </pre>

      {simular && resultadoSimulacao && (
        <ResultadoSimulacao resultado={resultadoSimulacao} />
      )}

      <h3 className="font-bold mt-6">📋 Regras Cadastradas</h3>
      {regrasSalvas.map(r => (
        <div key={r.id} className="border p-2 my-2 rounded bg-gray-50">
          <div className="text-sm">#{r.id}</div>
          <pre className="text-xs overflow-x-auto">{JSON.stringify(r.regra_json, null, 2)}</pre>
          <button onClick={() => excluirRegra(r.id)} className="text-red-600 text-sm mt-1">Excluir</button>
        </div>
      ))}
    </div>
  );
}
