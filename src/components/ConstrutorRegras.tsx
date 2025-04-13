import { useEffect, useState } from "react";
import ResultadoSimulacao from "./ResultadoSimulacao";
import { supabase } from "@/utils/supabase";

interface RegraComissao {
  id?: number;
  nome: string;
  camposBase: string[];
  formula: string;
}

export default function ConstrutorRegras() {
  const [nome, setNome] = useState("");
  const [camposBase, setCamposBase] = useState<string[]>([]);
  const [formula, setFormula] = useState("");
  const [regrasSalvas, setRegrasSalvas] = useState<RegraComissao[]>([]);
  const [simular, setSimular] = useState(false);
  const [tiposReceita, setTiposReceita] = useState<string[]>([]);

  const funcoesDisponiveis = [
    { label: "SOMA", exemplo: "=frete + pedagio" },
    { label: "SE", exemplo: "=SE(frete > 1000, 10, 5)" },
    { label: "SOMASE", exemplo: "=SOMASE(intervalo, criterio, soma)" },
    { label: "SOMASES", exemplo: "=SOMASES(campo1, crit1, campo2, crit2, ..., campo_soma)" },
    { label: "PROCV", exemplo: "=PROCV(valor, matriz, coluna)" },
    { label: "CONT.SE", exemplo: "=CONT.SE(intervalo, criterio)" },
    { label: "CONT.SES", exemplo: "=CONT.SES(campo1, crit1, campo2, crit2)" },
    { label: "ÍNDICE", exemplo: "=ÍNDICE(intervalo, posição)" },
    { label: "CORRESP", exemplo: "=CORRESP(valor, intervalo)" },
    { label: "MÉDIA", exemplo: "=MÉDIA(valor1, valor2, ...)" },
    { label: "DESVPAD", exemplo: "=DESVPAD(valor1, valor2, ...)" },
    { label: "MÍNIMO", exemplo: "=MÍNIMO(valor1, valor2, ...)" },
    { label: "MÁXIMO", exemplo: "=MÁXIMO(valor1, valor2, ...)" },
    { label: "ABS", exemplo: "=ABS(valor)" },
    { label: "ARRED", exemplo: "=ARRED(valor, casas_decimais)" },
    { label: "RECEITA", exemplo: "=RECEITA(\"João\", \"frete\")" },
  ];

  const adicionarCampo = (campo: string) => {
    if (!camposBase.includes(campo)) {
      setCamposBase([...camposBase, campo]);
    }
  };

  const salvarRegra = async () => {
    const novaRegra = {
      nome,
      camposBase,
      formula
    };
    const { error } = await supabase.from("regras_comissao").insert([novaRegra]);
    if (!error) {
      buscarRegras();
      setNome("");
      setCamposBase([]);
      setFormula("");
    }
  };

  const buscarRegras = async () => {
    const { data } = await supabase.from("regras_comissao").select("id, nome, camposBase, formula").order("id", { ascending: false });
    setRegrasSalvas(data ?? []);
  };

  const buscarTiposReceita = async () => {
    const { data, error } = await supabase.from("tipos_receita").select("descricao").order("descricao");
    if (data && !error) {
      setTiposReceita(data.map((r) => r.descricao));
    }
  };

  const excluirRegra = async (id: number) => {
    await supabase.from("regras_comissao").delete().eq("id", id);
    buscarRegras();
  };

  useEffect(() => {
    buscarRegras();
    buscarTiposReceita();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold">Nome da Regra</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full border px-2 py-1 rounded"
          />

          <label className="block font-bold mt-4">Campos Base</label>
          <div className="flex flex-wrap gap-2">
            {tiposReceita.map((campo) => (
              <button
                key={campo}
                onClick={() => adicionarCampo(campo)}
                className="px-2 py-1 bg-blue-100 rounded text-sm"
              >
                {campo}
              </button>
            ))}
          </div>

          <div className="mt-2">
            {camposBase.length > 0 && (
              <p className="text-sm text-gray-600">
                Selecionados: {camposBase.join(", ")}
              </p>
            )}
          </div>

          <label className="block font-bold mt-4">Fórmula</label>
          <input
            type="text"
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder="Exemplo: =frete * 0.1 + RECEITA(\"João\", \"frete\")"
            className="w-full border px-2 py-1 rounded"
          />

          <button
            onClick={salvarRegra}
            className="mt-4 bg-green-600 text-white px-4 py-2 rounded"
          >
            Salvar Regra
          </button>

          <button
            onClick={() => setSimular(true)}
            className="ml-2 mt-4 bg-purple-600 text-white px-4 py-2 rounded"
          >
            Simular
          </button>
        </div>

        <div>
          <h3 className="font-bold mb-2">📌 Funções Disponíveis</h3>
          <ul className="list-disc list-inside text-sm">
            {funcoesDisponiveis.map((f) => (
              <li key={f.label} title={f.label} className="hover:underline cursor-help">
                <strong>{f.label}</strong>: <code>{f.exemplo}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {simular && formula && (
        <ResultadoSimulacao camposBase={camposBase} formula={formula} />
      )}

      <div className="mt-10">
        <h3 className="font-bold text-lg mb-2">📂 Regras Salvas</h3>
        {regrasSalvas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma regra cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {regrasSalvas.map((regra) => (
              <li
                key={regra.id}
                className="bg-white border p-3 rounded shadow-sm flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">{regra.nome}</p>
                  <p className="text-sm text-gray-500">
                    Campos: {regra.camposBase.join(", ")}<br />
                    Fórmula: <code>{regra.formula}</code>
                  </p>
                </div>
                <button
                  onClick={() => excluirRegra(regra.id!)}
                  className="text-red-600 text-sm"
                >
                  Excluir
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
