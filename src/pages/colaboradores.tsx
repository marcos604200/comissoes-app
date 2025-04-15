import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Colaboradores() {
  const [nome, setNome] = useState("");
  const [colaboradores, setColaboradores] = useState<string[]>([]);

  const buscarColaboradores = async () => {
    const { data } = await supabase.from("colaboradores").select("nome");
    setColaboradores(data?.map((c) => c.nome) ?? []);
  };

  const salvarColaborador = async () => {
    if (!nome) return;
    await supabase.from("colaboradores").insert([{ nome }]);
    setNome("");
    buscarColaboradores();
  };

  const excluirColaborador = async (nome: string) => {
    await supabase.from("colaboradores").delete().eq("nome", nome);
    buscarColaboradores();
  };

  useEffect(() => {
    buscarColaboradores();
  }, []);

  return (
    <Layout>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Cadastro de Colaboradores</h1>

        <div className="flex gap-2 mb-6">
          <Input
            type="text"
            placeholder="Nome do colaborador"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <Button onClick={salvarColaborador} className="bg-green-600 text-white">
            ➕ Adicionar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {colaboradores.map((nome) => (
            <Card key={nome}>
              <CardContent className="p-4 flex justify-between items-center">
                <span>{nome}</span>
                <Button onClick={() => excluirColaborador(nome)} className="text-red-600" variant="ghost">
                  🗑️
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
