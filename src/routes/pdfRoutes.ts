import { Router } from "express";
import { auth } from "../middlewares/auth";
import { permitir } from "../middlewares/permissoes";
import * as controller from "../controllers/pdfController";

const router = Router();

router.get("/:cliente_id", auth, permitir("gerar_pdf"), controller.gerarHistoricoPDF);

export default router;
