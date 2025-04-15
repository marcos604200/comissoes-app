import Layout from "@/components/Layout";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";

export default function ImportarComissoes() {
  const [dados, setDados] = useState<any[]>([]);

  const handleImportar = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const bstr = evt.target?.result;
      const wb = XLSX.read(bstr, { type: "binary" });
      const wsname = wb.SheetNames[0];
      const ws = wb.Sheets[wsname];
      const data = XLSX.utils.sheet_to_json(ws, { header: 1 });

      const colunas = data[0];
      const linhas = data.slice(1).map((row: any) => {
        const obj: any = {};
        colunas.forEach((col: string, i: number) => {
          obj[col] = row[i];
        });
        return obj;
      });

      setDados(linhas);
    };
    reader.readAsBinaryString(file);
  };

  return (
    <Layout>
      <main className="flex-1 p-6">
        <h1 className="text-2xl font-bold mb-4">📥 Importar Comissão</h1>

        <div className="mb-4">
          <Input type="file" accept=".xlsx, .xls" onChange={handleImportar} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {dados.map((item, i) => (
            <Card key={i}>
              <CardContent className="p-4">
                <p><strong>Escritório:</strong> {item["Escritório"]}</p>
                <p><strong>Colaborador:</strong> {item["Colaborador"]}</p>
                <p><strong>Tipo Receita:</strong> {item["Tipo Receita"]}</p>
                <p><strong>Valor Receita:</strong> R$ {item["Valor Receita"]}</p>
                <p><strong>Documento:</strong> {item["Documento"]}</p>
                <p><strong>Emitente:</strong> {item["Emitente"]}</p>
                <p><strong>Cliente:</strong> {item["Cliente"]}</p>
                <p><strong>Data Emissão:</strong> {item["Data Emissão"]}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </Layout>
  );
}
