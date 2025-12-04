import { Request, Response } from "express";
import { supabase } from "../config/supabase";
import { gerarPDFHistorico } from "../services/pdfService";
import { enviarMensagem } from "../services/whatsappService";

export async function gerarHistoricoPDF(req: any, res: Response) {
  const cliente_id = req.params.cliente_id;

  const { data: cliente } = await supabase
    .from("clientes")
    .select("*")
    .eq("id", cliente_id)
    .single();

  if (!cliente) return res.status(404).json({ error: "Cliente não encontrado" });

  const { data: emprestimos } = await supabase
    .from("emprestimos")
    .select("*")
    .eq("cliente_id", cliente_id);

  const { data: parcelas } = await supabase
    .from("parcelas")
    .select("*")
    .in(
      "emprestimo_id",
      emprestimos.map((e: any) => e.id)
    );

  const caminhoPDF: any = await gerarPDFHistorico(
    cliente,
    emprestimos,
    parcelas
  );

  // ⭐ CORRIGIDO: Apenas dois argumentos!
  await enviarMensagem(
    cliente.telefone,
    "Seu histórico foi gerado com sucesso! (PDF salvo no servidor)"
  );

  res.json({
    message: "PDF gerado com sucesso!",
    arquivo: caminhoPDF
  });
}
