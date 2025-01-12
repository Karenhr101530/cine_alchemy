import Buys from "../models/buysModel.js";
import jwt from "jsonwebtoken";

export const createBuys = (req, res) => {
  const { cart, token, jsonRecibo } = req.body;
  try {
    /* Desncriptar el token */
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    cart.forEach(async element => {
      await Buys.create(element.id, element.price, getFutureDate(7), JSON.stringify(jsonRecibo));
    });

    res.status(200).json({ message: "Venta exitosa" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const findBuy = async (req, res) => {
  const { movie_id } = req.body;
  try {
    const buy = await Buys.findBuy(movie_id);
    res.status(200).json({buy});
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};