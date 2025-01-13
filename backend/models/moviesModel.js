import db from "../config/db.js";

export const Movie = {
    list: async () => {
        const [rows] = await db.query("SELECT * FROM movies");
        return rows;
    },
    findMovie: async (id) => {
        const [rows] = await db.query("SELECT * FROM movies WHERE external_id  = ?", [
            id
        ]);
        return rows[0];
    },
}