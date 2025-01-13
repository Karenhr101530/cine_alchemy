import db from "../config/db.js";

const Buys = {
  create: async (movie_id, precio, fecha_limite, json_recibo) => {
    const [result] = await db.query(
      "INSERT INTO buys (movie_id, precio, fecha_limite, json_recibo) VALUES (?, ?, ?, ?)",
      [movie_id, precio, fecha_limite, json_recibo]
    );
    return result;
  },
  findBuy: async (movie_id) => {
    const [rows] = await db.query(`
      SELECT 
        *
      FROM buys WHERE id = ?`, [
      movie_id,
    ]);
    // console.log(rows)
    return rows[0];
  },
  list: async () => {
    const [rows] = await db.query("SELECT * FROM buys");
    return rows;
  }
};

export default Buys;