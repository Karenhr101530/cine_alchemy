import express from "express";
import { createBuys, findBuy } from "../controllers/buysController.js";

/* Enrutador express */
const router = express.Router();

router.post("/create", createBuys);
router.post("/findBuy", findBuy);

export default router;
