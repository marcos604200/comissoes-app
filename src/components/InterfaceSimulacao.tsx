import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import ResultadoSimulacao from "./ResultadoSimulacao";

export default function InterfaceSimulacao() {
  const [frete, setFrete] = useState(0);
  const [guia, setGuia] = useState(0);
  const [taxa, setTaxa] = useState(0);
  const [formula, setFormula] = useState("=frete * 0.1 + guia * 0.05");
  const [executar, setExecutar] = useState(false);

  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">
          <div>
            <label className="font-semibold">Frete</label>
            <Input type="number" value={frete} onChange={(e) => setFrete(+e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Guia</label>
            <Input type="number" value={guia} onChange={(e) => setGuia(+e.target.value)} />
          </div>
          <div>
            <label className="font-semibold">Taxa</label>
            <Input type="number" value={taxa} onChange={(e) => setTaxa(+e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6 space-y-4">
          <label className="font-semibold block">Fórmula de Comissão</label>
          <Input value={formula} onChange={(e) => setFormula(e.target.value)} />
          <Button onClick={() => setExecutar(true)}>Simular</Button>
        </CardContent>
      </Card>

      {executar && (
        <ResultadoSimulacao
          camposBase={{ frete, guia, taxa }}
          formula={formula}
        />
      )}
    </div>
  );
}
