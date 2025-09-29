import { Router } from "express";
import {
  login,
  logout,
  getProfile,
  register,
} from "../controllers/auth.controller.js";
import { validator } from "../middlewares/validator.middleware.js";
import { registerValidation } from "../middlewares/validations/auth.validations.js";

export const authRoutes = Router();

// TODO: proteger las rutas con middlewares de autenticación y autorización faltantes (si fuera necesario)

// * registrar un usuario (publico)
authRoutes.post("/auth/register", registerValidation, validator, register);

// * loguearse (publico)
authRoutes.post("/auth/login", login);

// * obtener perfil (usuario autenticado)
authRoutes.get("/auth/profile", getProfile);

// * cerrar sesión (usuario autenticado)
authRoutes.post("/auth/logout", logout);
