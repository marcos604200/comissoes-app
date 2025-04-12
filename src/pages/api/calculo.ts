
import { calcularComissaoCentral } from "@/motores/calcularComissaoCentral";
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { dados, regra } = req.body;
    const resultado = calcularComissaoCentral(dados, regra);
    return res.status(200).json(resultado);
  } else {
    return res.status(405).json({ erro: "Método não permitido" });
  }
}

