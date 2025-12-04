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

  const { data: emprestimos } = await supabase
    .from("emprestimos")
    .select("*")
    .eq("cliente_id", cliente_id);

  const { data: parcelas } = await supabase
    .from("parcelas")
    .select("*")
    .eq("emprestimo_id", emprestimos[0].id);

  const caminhoPDF = await gerarPDFHistorico(cliente, emprestimos, parcelas);

  await enviarMensagem(cliente.telefone, "Segue seu histórico completo", {
    document: { url: caminhoPDF }
  });

  res.json({ message: "PDF gerado e enviado!", arquivo: caminhoPDF });
}
