import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";

interface Contratante {
  id: string;
  nome: string;
  cnpj: string;
}

export default function Contratantes() {
  const [nome, setNome] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [contratantes, setContratantes] = useState<Contratante[]>([]);

  const buscarContratantes = async () => {
    const { data } = await supabase.from("contratantes").select("*");
    setContratantes(data ?? []);
  };

  const salvarContratante = async () => {
    if (!nome || !cnpj) return;
    await supabase.from("contratantes").insert([{ nome, cnpj }]);
    setNome("");
    setCnpj("");
    buscarContratantes();
  };

  const excluirContratante = async (id: string) => {
    await supabase.from("contratantes").delete().eq("id", id);
    buscarContratantes();
  };

  useEffect(() => {
    buscarContratantes();
  }, []);

  return (
    <Layout>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🏢 Cadastro de Contratantes</h1>

        <div className="grid md:grid-cols-2 gap-4">
          <Input
            label="Nome do Contratante"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Digite o nome"
          />
          <Input
            label="CNPJ"
            value={cnpj}
            onChange={(e) => setCnpj(e.target.value)}
            placeholder="Digite o CNPJ"
          />
        </div>

        <div className="text-right">
          <Button onClick={salvarContratante} className="bg-blue-600 text-white">
            💾 Salvar
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {contratantes.map((item) => (
            <Card key={item.id}>
              <CardContent className="p-4">
                <p><strong>Nome:</strong> {item.nome}</p>
                <p><strong>CNPJ:</strong> {item.cnpj}</p>
                <Button onClick={() => excluirContratante(item.id)} variant="destructive" className="mt-2">
                  🗑️ Excluir
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
