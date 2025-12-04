import { Request, Response } from "express";
import { supabase } from "../config/supabase";

export async function listarParcelas(req: any, res: Response) {
  const emprestimo_id = req.params.emprestimo_id;

  const { data, error } = await supabase
    .from("parcelas")
    .select("*")
    .eq("emprestimo_id", emprestimo_id)
    .order("numero");

  if (error) return res.status(400).json(error);

  res.json(data);
}

export async function registrarPagamento(req: any, res: Response) {
  const parcela_id = req.params.parcelas_id;
  const { valor_pago } = req.body;

  const { data, error } = await supabase
    .from("parcelas")
    .update({
      pago: true,
      data_pagamento: new Date(),
      valor_pago
    })
    .eq("id", parcela_id)
    .select();

  if (error) return res.status(400).json(error);

  res.json({ message: "Pagamento registrado", parcela: data[0] });
}
