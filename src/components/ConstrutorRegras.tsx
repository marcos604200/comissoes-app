// src/components/ConstrutorRegras.tsx

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase";
import ResultadoSimulacao from "./ResultadoSimulacao";

interface RegraComissao {
  id?: string;
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
  const [colaboradores, setColaboradores] = useState<string[]>([]);

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
      formula,
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
    const { data } = await supabase.from("tipos_receita").select("descricao").order("descricao");
    if (data) {
      setTiposReceita(data.map((r) => r.descricao));
    }
  };

  const buscarColaboradores = async () => {
    const { data } = await supabase.from("colaboradores").select("nome").order("nome");
    if (data) {
      setColaboradores(data.map((c) => c.nome));
    }
  };

  const excluirRegra = async (id: string) => {
    await supabase.from("regras_comissao").delete().eq("id", id);
    buscarRegras();
  };

  useEffect(() => {
    buscarRegras();
    buscarTiposReceita();
    buscarColaboradores();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block font-bold">Nome da Regra</label>
          <Input value={nome} onChange={(e) => setNome(e.target.value)} />

          <label className="block font-bold mt-4">Campos Base (clique para adicionar)</label>
          <div className="flex flex-wrap gap-2">
            {tiposReceita.map((campo) => (
              <Button key={campo} onClick={() => adicionarCampo(campo)}>{campo}</Button>
            ))}
          </div>

          <div className="mt-2">
            {camposBase.length > 0 && (
              <p className="text-sm text-gray-600">Selecionados: {camposBase.join(", ")}</p>
            )}
          </div>

          <label className="block font-bold mt-4">Fórmula</label>
          <Input
            value={formula}
            onChange={(e) => setFormula(e.target.value)}
            placeholder='Exemplo: =frete * 0.1 + RECEITA("João", "frete")'
          />

          <div className="flex gap-2 mt-4">
            <Button onClick={salvarRegra}>Salvar Regra</Button>
            <Button variant="secondary" onClick={() => setSimular(true)}>Simular</Button>
          </div>
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
        <Card className="mt-8">
          <CardContent>
            <ResultadoSimulacao camposBase={camposBase} formula={formula} />
          </CardContent>
        </Card>
      )}

      <div className="mt-10">
        <h3 className="font-bold text-lg mb-2">📂 Regras Salvas</h3>
        {regrasSalvas.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhuma regra cadastrada.</p>
        ) : (
          <ul className="space-y-2">
            {regrasSalvas.map((regra) => (
              <li key={regra.id} className="bg-white border p-3 rounded shadow-sm flex justify-between items-center">
                <div>
                  <p className="font-semibold">{regra.nome}</p>
                  <p className="text-sm text-gray-500">
                    Campos: {regra.camposBase.join(", ")}<br />
                    Fórmula: <code>{regra.formula}</code>
                  </p>
                </div>
                <Button variant="ghost" onClick={() => excluirRegra(regra.id!)} className="text-red-600 text-sm">
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
