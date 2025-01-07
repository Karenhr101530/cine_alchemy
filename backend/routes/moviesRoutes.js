import express from "express";
import { listMovies } from "../controllers/moviesController.js";

/* Enrutador express */
const router = express.Router();

/* EN ESTE ARCHIVO DEFINIMOS LOS ENDPOINTS (PUNTOS FINALES) */

/* Endpoint: http://localhost:3000/api/movies/list */

/* router.metododelendpoint('nombredelendpoint', unaFuncion(){..}) */

router.get("/list", listMovies); 

export default router;
