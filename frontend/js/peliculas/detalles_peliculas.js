import { CONFIG } from "../config.js";

// Obtener la URL actual
const urlParams = new URLSearchParams(window.location.search);

async function getMovie() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/movies/findMovie`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            token: localStorage.getItem("token"),
            movieId: urlParams.get('movie_id')
        }),
    });

    if (response.ok) {
        /* Pelicula bd */
        const dataMovie = await response.json();
        console.log(dataMovie);

        /* Pelicula en la API */
        const url = `https://api.themoviedb.org/3/movie/${dataMovie.movie.external_id}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
            }
        };

        const responseApi = await fetch(url, options);

        const movieApi = await responseApi.json();

        console.log(movieApi);

        /* Pelicula en la API */
        const urlTrailer = `https://api.themoviedb.org/3/movie/${dataMovie.movie.external_id}/videos?language=en-US`;
        const optionsTrailer = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
            }
        };

        const responseTrailer = await fetch(urlTrailer, optionsTrailer);

        const movieTrailer = await responseTrailer.json();
        console.log(movieTrailer);

        let keyTrailer = 0;
        for (let i = 0; i < movieTrailer.results.length; i++) {
            const trailer = movieTrailer.results[i];
            if (trailer.type === "Teaser" && trailer.site === "YouTube") {
                keyTrailer = trailer.key;
                break;
            }
        }

        console.log(keyTrailer);
        document.getElementById("trailer").src = `https://www.youtube.com/embed/${keyTrailer}`;
    } else {
        console.error("Algo salió mal al obtener la pelicula.");
    }
}

getMovie();