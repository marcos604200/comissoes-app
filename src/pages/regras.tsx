// src/pages/regras.tsx
import Layout from "@/components/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Regra {
  id: number;
  nome: string;
  camposBase: string[];
  formula: string;
}

export default function ListaRegras() {
  const [regras, setRegras] = useState<Regra[]>([]);
  const [busca, setBusca] = useState("");

  const buscarRegras = async () => {
    const { data } = await supabase
      .from("regras_comissao")
      .select("id, nome, camposBase, formula")
      .order("id", { ascending: false });

    setRegras(data ?? []);
  };

  const excluirRegra = async (id: number) => {
    await supabase.from("regras_comissao").delete().eq("id", id);
    buscarRegras();
  };

  useEffect(() => {
    buscarRegras();
  }, []);

  const regrasFiltradas = regras.filter((r) =>
    r.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <Layout>
      <main className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">📁 Regras de Comissão</h1>
          <Link href="/construtor">
            <Button className="bg-indigo-600 text-white">➕ Nova Regra</Button>
          </Link>
        </div>

        <Input
          type="text"
          placeholder="🔎 Buscar regra por nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="mb-4 w-full md:w-1/3"
        />

        <div className="grid gap-4">
          {regrasFiltradas.map((regra) => (
            <Card key={regra.id}>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-lg font-semibold">{regra.nome}</h2>
                    <p className="text-sm text-gray-500">Campos: {regra.camposBase.join(", ")}</p>
                    <p className="text-sm text-gray-700">
                      Fórmula: <code>{regra.formula}</code>
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Link href={`/construtor?id=${regra.id}`}>
                      <Button className="bg-yellow-500 text-white">✏️ Editar</Button>
                    </Link>
                    <Button
                      className="bg-red-600 text-white"
                      onClick={() => excluirRegra(regra.id)}
                    >
                      🗑️ Excluir
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {regrasFiltradas.length === 0 && (
            <p className="text-gray-500 text-sm">Nenhuma regra encontrada.</p>
          )}
        </div>
      </main>
    </Layout>
  );
}
