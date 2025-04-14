import { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <header className="text-xl font-bold text-center mb-6">💼 Sistema de Cálculo de Comissão</header>
      <main className="max-w-4xl mx-auto bg-white shadow-md rounded-lg p-6">{children}</main>
    </div>
  );
}
