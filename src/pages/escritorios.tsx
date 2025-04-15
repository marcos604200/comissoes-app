// src/pages/escritorios.tsx
import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/utils/supabase";

interface Escritorio {
  id: string;
  nome: string;
  cidade: string;
  estado: string;
}

export default function Escritorios() {
  const [nome, setNome] = useState("");
  const [cidade, setCidade] = useState("");
  const [estado, setEstado] = useState("");
  const [escritorios, setEscritorios] = useState<Escritorio[]>([]);

  const carregarEscritorios = async () => {
    const { data, error } = await supabase.from("escritorios").select("*").order("nome");
    if (!error && data) setEscritorios(data);
  };

  const salvarEscritorio = async () => {
    if (!nome || !cidade || !estado) return;
    const { error } = await supabase.from("escritorios").insert({ nome, cidade, estado });
    if (!error) {
      setNome("");
      setCidade("");
      setEstado("");
      carregarEscritorios();
    }
  };

  useEffect(() => {
    carregarEscritorios();
  }, []);

  return (
    <Layout>
      <main className="p-6 space-y-6">
        <h1 className="text-2xl font-bold">🏢 Escritórios</h1>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
          <Input placeholder="Cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} />
          <Input placeholder="Estado" value={estado} onChange={(e) => setEstado(e.target.value)} />
          <div className="md:col-span-3">
            <Button onClick={salvarEscritorio}>Salvar Escritório</Button>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {escritorios.map((e) => (
            <Card key={e.id} className="bg-white">
              <CardContent className="p-4">
                <p className="font-bold">{e.nome}</p>
                <p>{e.cidade} - {e.estado}</p>
              </CardContent>
            </Card>
          ))}
        </section>
      </main>
    </Layout>
  );
}

