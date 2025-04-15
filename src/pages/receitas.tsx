import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Receita {
  id: string;
  descricao: string;
}

export default function Receitas() {
  const [descricao, setDescricao] = useState("");
  const [receitas, setReceitas] = useState<Receita[]>([]);

  useEffect(() => {
    buscarReceitas();
  }, []);

  const buscarReceitas = async () => {
    const { data, error } = await supabase.from("tipos_receita").select("id, descricao").order("descricao");
    if (!error) setReceitas(data);
  };

  const salvarReceita = async () => {
    if (!descricao.trim()) return;
    await supabase.from("tipos_receita").insert({ descricao });
    setDescricao("");
    buscarReceitas();
  };

  const excluirReceita = async (id: string) => {
    await supabase.from("tipos_receita").delete().eq("id", id);
    buscarReceitas();
  };

  return (
    <Layout>
      <main className="flex-1 p-6 space-y-6">
        <h1 className="text-2xl font-bold">🍽️ Cadastro de Tipos de Receita</h1>

        <div className="flex gap-4">
          <Input
            placeholder="Ex: Frete, Armazenagem, Seguro..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="w-full"
          />
          <Button onClick={salvarReceita} className="bg-green-600 text-white">
            ➕ Salvar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {receitas.map((r) => (
            <Card key={r.id} className="bg-white border shadow-sm">
              <CardContent className="p-4 flex justify-between items-center">
                <span className="text-sm font-semibold">{r.descricao}</span>
                <Button onClick={() => excluirReceita(r.id)} className="text-red-600 text-xs" variant="ghost">
                  Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}

