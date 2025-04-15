import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface Colaborador {
  id: string;
  nome: string;
  cpf: string;
  cargo: string;
}

export default function Colaboradores() {
  const [colaboradores, setColaboradores] = useState<Colaborador[]>([]);
  const [novo, setNovo] = useState({ nome: "", cpf: "", cargo: "" });

  useEffect(() => {
    buscarColaboradores();
  }, []);

  const buscarColaboradores = async () => {
    const { data } = await supabase.from("colaboradores").select("*");
    setColaboradores(data ?? []);
  };

  const salvarColaborador = async () => {
    if (!novo.nome || !novo.cpf || !novo.cargo) return;
    await supabase.from("colaboradores").insert([novo]);
    setNovo({ nome: "", cpf: "", cargo: "" });
    buscarColaboradores();
  };

  const excluir = async (id: string) => {
    await supabase.from("colaboradores").delete().eq("id", id);
    buscarColaboradores();
  };

  return (
    <Layout>
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-4">👥 Cadastro de Colaboradores</h1>

        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <Input
            placeholder="Nome"
            value={novo.nome}
            onChange={(e) => setNovo({ ...novo, nome: e.target.value })}
          />
          <Input
            placeholder="CPF"
            value={novo.cpf}
            onChange={(e) => setNovo({ ...novo, cpf: e.target.value })}
          />
          <Input
            placeholder="Cargo"
            value={novo.cargo}
            onChange={(e) => setNovo({ ...novo, cargo: e.target.value })}
          />
        </div>

        <Button className="mb-6 bg-green-600 text-white" onClick={salvarColaborador}>
          ➕ Adicionar Colaborador
        </Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {colaboradores.map((colab) => (
            <Card key={colab.id}>
              <CardContent className="p-4">
                <p><strong>Nome:</strong> {colab.nome}</p>
                <p><strong>CPF:</strong> {colab.cpf}</p>
                <p><strong>Cargo:</strong> {colab.cargo}</p>
                <Button
                  variant="destructive"
                  onClick={() => excluir(colab.id)}
                  className="mt-2"
                >
                  ❌ Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
