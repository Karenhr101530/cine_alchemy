import express from "express";

const router = express.Router();

router.post("/list", (req, res) => {
  console.log("Listado de productos");
});

export default router;
