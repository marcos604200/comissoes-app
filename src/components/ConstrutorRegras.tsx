import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase";
import ResultadoSimulacao from "./ResultadoSimulacao";

interface RegraComissao {
  colaborador: string;
  base: string[];
  formula: string;
  tipo: "simples" | "avancado";
  funcoesExtras?: string[];
  id?: number;
}

export default function ConstrutorRegras() {
  const [modo, setModo] = useState<"simples" | "avancado">("simples");
  const [colaborador, setColaborador] = useState("");
  const [base, setBase] = useState<string[]>([]);
  const [formula, setFormula] = useState("");
  const [funcoesExtras, setFuncoesExtras] = useState<string[]>([]);
  const [regrasSalvas, setRegrasSalvas] = useState<RegraComissao[]>([]);
  const [edicaoId, setEdicaoId] = useState<number | null>(null);
  const [filtro, setFiltro] = useState("");

  const camposDisponiveis = ["frete", "armazenagem", "pedagio", "taxa"].sort();
  const opcoesFuncoes = ["media", "desvio", "potencia", "somase", "somases", "procv", "se"];

  const alternarCampoBase = (campo: string) => {
    setBase((prev) =>
      prev.includes(campo) ? prev.filter((c) => c !== campo) : [...prev, campo]
    );
  };

  const alternarFuncaoExtra = (func: string) => {
    setFuncoesExtras((prev) =>
      prev.includes(func) ? prev.filter((f) => f !== func) : [...prev, func]
    );
  };

  const salvarRegra = async () => {
    const novaRegra: RegraComissao = {
      colaborador,
      base,
      formula,
      tipo: modo,
      funcoesExtras,
    };
    if (edicaoId !== null) {
      await supabase.from("regras_comissao").update({ regra_json: novaRegra }).eq("id", edicaoId);
      setEdicaoId(null);
    } else {
      await supabase.from("regras_comissao").insert([{ regra_json: novaRegra }]);
    }
    buscarRegras();
  };

  const buscarRegras = async () => {
    const { data } = await supabase.from("regras_comissao").select("id, regra_json").order("id", { ascending: false });
    if (data) {
      const regras = data.map((d) => ({ ...d.regra_json, id: d.id }));
      setRegrasSalvas(regras);
    }
  };

  const excluirRegra = async (id: number) => {
    await supabase.from("regras_comissao").delete().eq("id", id);
    buscarRegras();
  };

  const editarRegra = (regra: RegraComissao) => {
    setColaborador(regra.colaborador);
    setBase(regra.base);
    setFormula(regra.formula);
    setModo(regra.tipo);
    setFuncoesExtras(regra.funcoesExtras || []);
    setEdicaoId(regra.id ?? null);
  };

  const exportarJson = () => {
    const blob = new Blob([JSON.stringify(regrasSalvas, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "regras_comissao.json";
    a.click();
  };

  useEffect(() => {
    buscarRegras();
  }, []);

  const regrasFiltradas = regrasSalvas.filter((r) =>
    r.colaborador.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <div className="bg-white p-6 rounded shadow-md">
      <div className="mb-4">
        <label className="font-semibold mr-4">Modo:</label>
        <button
          className={`px-2 py-1 border rounded mr-2 ${modo === "simples" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setModo("simples")}
        >Simples</button>
        <button
          className={`px-2 py-1 border rounded ${modo === "avancado" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
          onClick={() => setModo("avancado")}
        >Avançado</button>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Colaborador:</label>
        <input
          type="text"
          className="border p-2 w-full"
          value={colaborador}
          onChange={(e) => setColaborador(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Campos base:</label>
        <div className="flex flex-wrap gap-2">
          {camposDisponiveis.map((campo) => (
            <label key={campo} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={base.includes(campo)}
                onChange={() => alternarCampoBase(campo)}
              />
              <span>{campo}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Fórmula (estilo Excel):</label>
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="=SE([frete]>10000; [frete]*0.1; [frete]*0.05) + [armazenagem]*0.02"
          value={formula}
          onChange={(e) => setFormula(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="block font-medium">Funções avançadas:</label>
        <div className="flex flex-wrap gap-2">
          {opcoesFuncoes.map((func) => (
            <label key={func} className="flex items-center space-x-1">
              <input
                type="checkbox"
                checked={funcoesExtras.includes(func)}
                onChange={() => alternarFuncaoExtra(func)}
              />
              <span>{func}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <button
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={salvarRegra}
        >{edicaoId !== null ? "Atualizar Regra" : "Salvar Regra"}</button>

        <button
          className="bg-gray-700 text-white px-4 py-2 rounded hover:bg-gray-800"
          onClick={exportarJson}
        >Exportar JSON</button>
      </div>

      {formula && base.length > 0 && (
        <ResultadoSimulacao camposBase={base} formula={formula} />
      )}

      <div className="mb-2">
        <input
          type="text"
          className="border p-2 w-full"
          placeholder="🔍 Buscar por colaborador..."
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
      </div>

      <h2 className="text-lg font-bold mt-4">📋 Regras Salvas</h2>
      <div className="space-y-2 mt-2">
        {regrasFiltradas.map((regra) => (
          <div key={regra.id} className="border p-2 rounded flex justify-between items-center">
            <div>
              <strong>{regra.colaborador}</strong> → {regra.formula}
            </div>
            <div className="space-x-2">
              <button onClick={() => editarRegra(regra)} className="text-blue-600">Editar</button>
              <button onClick={() => excluirRegra(regra.id!)} className="text-red-600">Excluir</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
