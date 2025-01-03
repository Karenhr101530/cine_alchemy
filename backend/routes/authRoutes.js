import express from "express";
import { login, register } from "../controllers/authController.js";

const router = express.Router();
// Endpoint : http://localhost:3000/api/auth/login
router.post("/login", login);
// Endpoint : http://localhost:3000/api/auth/register
router.post("/register", register);

export default router;
