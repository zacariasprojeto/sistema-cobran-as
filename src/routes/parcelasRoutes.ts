import { Router } from "express";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";
import * as controller from "../controllers/parcelasController";

const router = Router();

router.get("/:emprestimo_id", auth, permitir("ver_parcelas"), controller.listarParcelas);
router.post("/:parcelas_id/pagar", auth, permitir("registrar_pagamento"), controller.registrarPagamento);

export default router;
