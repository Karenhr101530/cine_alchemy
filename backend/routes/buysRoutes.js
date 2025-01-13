import express from "express";
import { createBuys, findBuy, listBuys} from "../controllers/buysController.js";

/* Enrutador express */
const router = express.Router();

router.post("/create", createBuys);
router.post("/findBuy", findBuy);
router.get("/list", listBuys);

export default router;
