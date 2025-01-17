import Buys from "../models/buysModel.js";
import jwt from "jsonwebtoken";

export const createBuys = (req, res) => {
  const { cart, token, jsonRecibo } = req.body;

  try {
    // Desencriptar el token y obtener el user_id
    const tokenDecoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validar que el token contiene el user_id
    const user_id = tokenDecoded.id;
    if (!user_id) {
      return res.status(400).json({ message: "User ID no encontrado en el token" });
    }

    // Insertar cada compra en la base de datos
    cart.forEach(async (element) => {
      await Buys.create(user_id, element.id, element.price, getFutureDate(7), JSON.stringify(jsonRecibo));
    });

    res.status(200).json({ message: "Venta exitosa" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const findBuy = async (req, res) => {
  const { buyId } = req.body;

  try {
    const buy = await Buys.findBuy(buyId);

    if (!buy) {
      return res.status(404).json({ message: "Compra no encontrada" });
    }

    res.status(200).json({ buy });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const listBuys = async (req, res) => {
  try {
    const buys = await Buys.list();

    res.status(200).json({ buys });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Algo salió mal" });
  }
};

// Función auxiliar para calcular la fecha límite
const getFutureDate = (days) => {
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
};
