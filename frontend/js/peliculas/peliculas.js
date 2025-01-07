import { CONFIG } from "../config.js";

const moviesSection = document.getElementById("movies-grid");

/* IDS DE LA BASE DE DATOS */
const response = await fetch(`${CONFIG.API_BASE_URL}/movies/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
});

let { movies } = await response.json();

movies.forEach(movie => {
    const url = `https://api.themoviedb.org/3/movie/${movie.external_id}?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
        }
    };

    fetch(url, options)
        .then(res => res.json())
        .then(json => {
            console.log(json);
            const movieCard = `
            <article class="movies-card">
            <img src="https://image.tmdb.org/t/p/w500/${json.poster_path}" alt="Culpa tuya" class="movies-image">
            <div class="movies-info">
                <div class="preview-container">
                    <img src="../img/culpa_tuya2.jpg" alt="Vista previa película 1" class="preview-image">
                </div>
                <div class="info-content">
                    <h2 class="movies-title">${json.original_title}</h2>
                    <p class="movies-description">
                        ${json.overview}
                    </p>
                    <p class="movies-price">$${movie.precio}</p>
                    <div class="actions-container">
                        <button class="btn-cart">
                            🛒 Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        </article>
        `
            moviesSection.innerHTML += movieCard;
        })
        .catch(err => console.error(err));
});