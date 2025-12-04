import { Router } from "express";
import { supabase } from "../config/supabase";

const router = Router();

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.json({
    message: "Login realizado com sucesso",
    token: data.session?.access_token,
    user: data.user,
  });
});

// CRIAR USUÁRIO (ADMIN OU USUÁRIO NORMAL)
router.post("/register", async (req, res) => {
  const { email, password, nome, telefone, role, permissoes } = req.body;

  const { data, error } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      nome,
      telefone,
      role: role || "user",
      permissoes: permissoes || {},
    },
  });

  if (error) {
    return res.status(400).json(error);
  }

  res.json({
    message: "Usuário criado com sucesso",
    user: data.user,
  });
});

export default router;
