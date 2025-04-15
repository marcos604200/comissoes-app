import Link from "next/link";
import { ReactNode } from "react";

const menuItems = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Simulação", href: "/simulacao" },
  { label: "Cadastro de Regras", href: "/regras" },
  { label: "Relatórios", href: "/relatorios" },
];

export default function SidebarLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-white border-r shadow-md">
        <div className="p-4 text-xl font-bold text-blue-700">📊 ComissãoApp</div>
        <nav className="mt-6 space-y-2">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href} legacyBehavior>
              <a className="block py-2 px-6 text-gray-700 hover:bg-blue-100 hover:text-blue-700">
                {item.label}
              </a>
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}
