import { useEffect, useState, ChangeEvent } from "react";
import { supabase } from "@/utils/supabase";
import ResultadoSimulacao from "./ResultadoSimulacao";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  const funcoesDisponiveis = [
    { label: "SOMA", exemplo: "=frete + pedagio" },
    { label: "SE", exemplo: "=SE(frete > 1000, 10, 5)" },
    { label: "MÉDIA", exemplo: "=MÉDIA(valor1, valor2, ...)" },
    { label: "DESVPAD", exemplo: "=DESVPAD(valor1, valor2, ...)" },
    { label: "MÍNIMO", exemplo: "=MÍNIMO(valor1, valor2, ...)" },
    { label: "MÁXIMO", exemplo: "=MÁXIMO(valor1, valor2, ...)" },
    { label: "RECEITA", exemplo: '=RECEITA("João", "frete")' },
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

  const excluirRegra = async (id: string) => {
    await supabase.from("regras_comissao").delete().eq("id", id);
    buscarRegras();
  };

  useEffect(() => {
    buscarRegras();
    buscarTiposReceita();
  }, []);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="space-y-4 p-4">
            <Input placeholder="Nome da Regra" value={nome} onChange={(e) => setNome(e.target.value)} />
            <div>
              <p className="font-medium">Campos disponíveis:</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {tiposReceita.map((campo) => (
                  <Button key={campo} variant="outline" size="sm" onClick={() => adicionarCampo(campo)}>
                    {campo}
                  </Button>
                ))}
              </div>
            </div>
            <Input
              type="text"
              value={formula}
              onChange={(e: ChangeEvent<HTMLInputElement>) => setFormula(e.target.value)}
              placeholder='Ex: =frete * 0.1 + RECEITA("João", "frete")'
            />
            <div className="flex gap-2">
              <Button className="bg-green-600 text-white" onClick={salvarRegra}>Salvar</Button>
              <Button className="bg-purple-600 text-white" onClick={() => setSimular(true)}>Simular</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <h4 className="font-semibold mb-2">📚 Funções Disponíveis</h4>
            <ul className="list-disc list-inside text-sm space-y-1">
              {funcoesDisponiveis.map((f) => (
                <li key={f.label}><strong>{f.label}:</strong> <code>{f.exemplo}</code></li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      {simular && formula && (
        <ResultadoSimulacao camposBase={camposBase} formula={formula} />
      )}

      <div>
        <h3 className="text-lg font-bold mb-2">📂 Regras Salvas</h3>
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
                <Button variant="destructive" size="sm" onClick={() => excluirRegra(regra.id!)}>Excluir</Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
