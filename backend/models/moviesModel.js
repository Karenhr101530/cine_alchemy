import db from "../config/db.js";

export const Movie = {
    list: async () => {
        const [rows] = await db.query("SELECT * FROM movies");
        return rows;
    }
}