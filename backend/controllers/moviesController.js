import { Movie } from "../models/moviesModel.js";

export const listMovies = async (req, res) => {
    try {
        const movies = await Movie.list();
        res.status(200).json({ movies });
    } catch (error) {
        console.log(err);
        res.status(500).json({ message: "Algo salió mal" });
    }
};
