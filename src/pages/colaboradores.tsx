import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Colaboradores() {
  const [nome, setNome] = useState("");
  const [colaboradores, setColaboradores] = useState<{ id: string; nome: string }[]>([]);

  useEffect(() => {
    buscarColaboradores();
  }, []);

  const buscarColaboradores = async () => {
    const { data } = await supabase.from("colaboradores").select("id, nome").order("nome");
    if (data) setColaboradores(data);
  };

  const adicionarColaborador = async () => {
    if (!nome) return;
    const { error } = await supabase.from("colaboradores").insert({ nome });
    if (!error) {
      setNome("");
      buscarColaboradores();
    }
  };

  const excluirColaborador = async (id: string) => {
    await supabase.from("colaboradores").delete().eq("id", id);
    buscarColaboradores();
  };

  return (
    <Layout>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Cadastro de Colaboradores</h1>

        <div className="flex gap-2 mb-4">
          <Input
            type="text"
            placeholder="Nome do colaborador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Button onClick={adicionarColaborador} className="bg-green-600 text-white">
            ➕ Adicionar
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {colaboradores.map((c) => (
            <Card key={c.id} className="flex justify-between items-center p-4">
              <CardContent className="p-0">
                <p className="font-medium">{c.nome}</p>
              </CardContent>
              <Button onClick={() => excluirColaborador(c.id)} className="bg-red-500 text-white">
                ❌
              </Button>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
