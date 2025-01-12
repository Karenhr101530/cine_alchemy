import express from "express";
import authRoutes from "./routes/authRoutes.js";
import moviesRoutes from "./routes/moviesRoutes.js";
import buysRoutes from "./routes/buysRoutes.js";
import dotenv from "dotenv";
import cors from "cors";

dotenv.config(); //Para usar las variables en el .env

const app = express(); //Para crear el servidor y hacer rutas
const PORT = process.env.PORT || 3000;

/* Cors */
app.use(
  cors({ 
    origin: "http://127.0.0.7:5500",
    methods: ["GET", "POST"],
  })
);

/* Midlewares */
app.use(express.json());

/* Rutas */
app.use("/api/auth", authRoutes);
app.use("/api/movies", moviesRoutes);
app.use("/api/buys", buysRoutes);


app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
