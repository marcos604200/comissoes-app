// src/pages/index.tsx
import Head from "next/head";
import ConstrutorRegras from "@/components/ConstrutorRegras";

export default function Home() {
  return (
    <>
      <Head>
        <title>Comissões App</title>
        <meta name="description" content="Sistema de cálculo de comissões inteligente" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-5xl mx-auto bg-white rounded shadow p-6">
          <h1 className="text-3xl font-bold mb-6 text-blue-800">📊 Sistema de Cálculo de Comissão</h1>
          <ConstrutorRegras />
        </div>
      </main>
    </>
  );
}
