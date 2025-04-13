import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ResultadoSimulacao from "./ResultadoSimulacao";

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
    { label: "RECEITA", exemplo: '=RECEITA("João", "frete")' }
  ];

  const adicionarCampo = (campo: string) => {
    if (!camposBase.includes(campo)) {
      setCamposBase([...camposBase, campo]);
    }
  };

  const salvarRegra = async () => {
    const novaRegra = { nome, camposBase, formula };
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
    <div className="space-y-6 p-6 bg-gray-50 rounded-xl shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block font-bold text-sm mb-1">Nome da Regra</label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Comissão padrão" />

          <label className="block font-bold text-sm mt-6 mb-1">Campos Base</label>
          <div className="flex flex-wrap gap-2">
            {tiposReceita.map((campo) => (
              <Button key={campo} variant="outline" size="sm" onClick={() => adicionarCampo(campo)}>
                {campo}
              </Button>
            ))}
          </div>
          {camposBase.length > 0 && (
            <p className="text-xs text-gray-500 mt-2">Selecionados: {camposBase.join(", ")}</p>
          )}

          <label className="block font-bold text-sm mt-6 mb-1">Fórmula</label>
          <Input
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder='Ex: =frete * 0.1 + RECEITA("João", "frete")'
          />

          <div className="mt-4 flex gap-2">
            <Button onClick={salvarRegra}>Salvar Regra</Button>
            <Button variant="secondary" onClick={() => setSimular(true)}>Simular</Button>
          </div>
        </div>

        <div>
          <h3 className="font-bold text-base mb-2">📌 Funções Disponíveis</h3>
          <ul className="list-disc list-inside text-sm space-y-1">
            {funcoesDisponiveis.map((f) => (
              <li key={f.label}>
                <strong>{f.label}</strong>: <code>{f.exemplo}</code>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {simular && formula && <ResultadoSimulacao camposBase={camposBase} formula={formula} />}

      <div className="mt-10">
        <h3 className="font-bold text-lg mb-2">📂 Regras Salvas</h3>
        {regrasSalvas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma regra cadastrada.</p>
        ) : (
          <ul className="space-y-3">
            {regrasSalvas.map((regra) => (
              <li
                key={regra.id}
                className="bg-white border p-4 rounded-lg shadow-sm flex justify-between items-start"
              >
                <div>
                  <p className="font-semibold text-sm">{regra.nome}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Campos: {regra.camposBase.join(", ")}<br />
                    Fórmula: <code>{regra.formula}</code>
                  </p>
                </div>
                <Button variant="destructive" size="sm" onClick={() => excluirRegra(regra.id!)}>
                  Excluir
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
