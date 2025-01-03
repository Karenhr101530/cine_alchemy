import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/userModel.js";

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    //Validaciones
    if (!email) return res.status(400).json({ message: "El email es requerido" });
    if (!password) return res.status(400).json({ message: "La password es requerida" });
    //Buscar usuario
    const user = await User.findByEmail(email);
    if (!user) return res.status(400).json({ message: "Usuario no encontrado" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Credenciales inválidas" });
    } 
    //Crear token
    const token = jwt.sign({ id: user.id, name: user.name }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({ token }); //Responder con el token
  } catch (err) {
    res.status(500).json({ message: "Algo salió mal" });
  }
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const user = await User.findByEmail(email);
    if (user) return res.status(400).json({ message: "El usuario ya existe" });
    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create( name, email, hashPassword );
    res.status(200).json({ message: "Usuario creado" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Algo salió mal" });
  }
};
 // Primer paso cargar js
 // Segundo paso validaciones
 // Tercer paso tener en cuenta retornar cuando las validaciones falle