import { useState, useEffect } from "react";
import { Input } from "./Input";
import { Button } from "./Button";
import { Card, CardContent } from "./Card";
import { Select } from "./Select";
import { supabase } from "@/utils/supabase";

export default function InterfaceSimulacao() {
  const [nome, setNome] = useState("");
  const [formula, setFormula] = useState("");
  const [tiposReceita, setTiposReceita] = useState<string[]>([]);
  const [colaboradores, setColaboradores] = useState<string[]>([]);

  const salvar = async () => {
    if (!nome || !formula) return;
    await supabase.from("regras_comissao").insert([{ nome, formula }]);
    setNome("");
    setFormula("");
  };

  const buscarDados = async () => {
    const { data: receitas } = await supabase.from("tipos_receita").select("descricao");
    const { data: colaboradores } = await supabase.from("colaboradores").select("nome");
    setTiposReceita(receitas?.map((r) => r.descricao) || []);
    setColaboradores(colaboradores?.map((c) => c.nome) || []);
  };

  useEffect(() => {
    buscarDados();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card>
        <CardContent>
          <h2 className="text-xl font-bold">🔧 Criar Regra de Comissão</h2>
          <div className="space-y-2">
            <Input placeholder="Nome da Regra" value={nome} onChange={(e) => setNome(e.target.value)} />
            <Input placeholder='Ex: =frete * 0.1 + RECEITA("João", "frete")' value={formula} onChange={(e) => setFormula(e.target.value)} />
            <div className="flex gap-2">
              <Button onClick={salvar}>Salvar</Button>
              <Button variant="outline">Simular</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <h3 className="text-lg font-semibold">📋 Funções Disponíveis</h3>
          <ul className="text-sm list-disc list-inside">
            <li>=SOMA(valor1, valor2)</li>
            <li>=SE(condição, valor_se_verdadeiro, valor_se_falso)</li>
            <li>=RECEITA("João", "frete")</li>
            <li>=COLABORADOR("João", "meta")</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
