import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Receitas() {
  const [descricao, setDescricao] = useState("");
  const [receitas, setReceitas] = useState<any[]>([]);

  const buscarReceitas = async () => {
    const { data } = await supabase.from("tipos_receita").select("*").order("descricao");
    setReceitas(data ?? []);
  };

  const salvarReceita = async () => {
    if (!descricao) return;
    await supabase.from("tipos_receita").insert([{ descricao }]);
    setDescricao("");
    buscarReceitas();
  };

  const excluirReceita = async (id: string) => {
    await supabase.from("tipos_receita").delete().eq("id", id);
    buscarReceitas();
  };

  useEffect(() => {
    buscarReceitas();
  }, []);

  return (
    <Layout>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">📑 Cadastro de Tipos de Receita</h1>

        <div className="flex gap-4 mb-6">
          <Input
            type="text"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            placeholder="Descrição da receita"
          />
          <Button onClick={salvarReceita} className="bg-green-600 text-white">
            ➕ Cadastrar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {receitas.map((r) => (
            <Card key={r.id}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>{r.descricao}</span>
                <Button
                  variant="outline"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                  onClick={() => excluirReceita(r.id)}
                >
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
