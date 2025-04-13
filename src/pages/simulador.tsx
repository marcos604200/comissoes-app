import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase";
import { calcularComissaoCentral } from "@/motores/calcularComissaoCentral";

export default function Simulador() {
  const [regras, setRegras] = useState<{ id: number; regra_json: any }[]>([]);
  const [regraSelecionada, setRegraSelecionada] = useState<any>(null);
  const [dadosSimulados, setDadosSimulados] = useState<Record<string, Record<string, number>>>({});
  const [resultado, setResultado] = useState<any>(null);

  const carregarRegras = async () => {
    const { data } = await supabase
      .from("regras_comissao")
      .select("id, regra_json")
      .order("id", { ascending: false });
    setRegras(data ?? []);
  };

  const simular = () => {
    if (!regraSelecionada) return;
    const resultado = calcularComissaoCentral(dadosSimulados, regraSelecionada);
    setResultado(resultado);
  };

  const adicionarDado = (colab: string, tipo: string, valor: number) => {
    setDadosSimulados((prev) => ({
      ...prev,
      [colab]: {
        ...(prev[colab] ?? {}),
        [tipo]: valor,
      },
    }));
  };

  useEffect(() => {
    carregarRegras();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-bold mb-4">🧮 Simulador de Comissão</h2>

      <label className="block font-semibold mb-1">Selecionar Regra</label>
      <select
        className="border p-2 w-full mb-4"
        onChange={(e) => {
          const id = Number(e.target.value);
          const selecionada = regras.find((r) => r.id === id);
          setRegraSelecionada(selecionada?.regra_json ?? null);
        }}
      >
        <option value="">-- Escolha uma regra --</option>
        {regras.map((r) => (
          <option key={r.id} value={r.id}>
            #{r.id} - {r.regra_json?.descricao ?? "Sem descrição"}
          </option>
        ))}
      </select>

      <h3 className="font-semibold mb-2">Inserir Dados de Teste</h3>
      <div className="grid grid-cols-3 gap-2 mb-4">
        <input
          placeholder="Colaborador"
          className="border p-1"
          onBlur={(e) => e.target.value && setDadosSimulados({ [e.target.value]: {} })}
        />
        <input
          placeholder="Tipo Receita"
          className="border p-1"
          id="tipo-receita"
        />
        <input
          placeholder="Valor"
          className="border p-1"
          id="valor-receita"
          type="number"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const colaboradorInput = (document.querySelector("input[placeholder='Colaborador']") as HTMLInputElement)?.value;
              const tipo = (document.getElementById("tipo-receita") as HTMLInputElement).value;
              const valor = parseFloat((document.getElementById("valor-receita") as HTMLInputElement).value);
              if (colaboradorInput && tipo && !isNaN(valor)) {
                adicionarDado(colaboradorInput, tipo, valor);
              }
            }
          }}
        />
      </div>

      <button onClick={simular} className="bg-blue-600 text-white px-4 py-2 rounded mb-4">
        ▶️ Rodar Simulação
      </button>

      {resultado && (
        <div className="bg-green-50 p-4 rounded shadow">
          <h4 className="font-semibold">Resultado da Comissão:</h4>
          <pre className="text-sm">{JSON.stringify(resultado, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
