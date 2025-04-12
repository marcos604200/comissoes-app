type ResultadoSimulacaoProps = {
  resultado: any; // Você pode substituir 'any' por um tipo mais específico se quiser
};

export default function ResultadoSimulacao({ resultado }: ResultadoSimulacaoProps) {
  return (
    <div>
      <h4 className="font-bold mt-4">🧪 Resultado da Simulação</h4>
      <pre className="bg-yellow-50 p-2 rounded text-sm overflow-x-auto">
        {JSON.stringify(resultado, null, 2)}
      </pre>
    </div>
  );
}
