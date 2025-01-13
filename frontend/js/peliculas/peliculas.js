import { CONFIG } from "../config.js";
import { navigateTo } from "../router.js";

const moviesSection = document.getElementById("movies-grid");

/* IDS DE LA BASE DE DATOS */
const response = await fetch(`${CONFIG.API_BASE_URL}/movies/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
});

let { movies } = await response.json();

await Promise.all(movies.map(async movie => {
    const url = `https://api.themoviedb.org/3/movie/${movie.external_id}?language=en-US`;
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
        }
    };

    const response = await fetch(url, options);

    const json = await response.json();

    const movieCard = `
            <article class="movies-card">
            <img src="https://image.tmdb.org/t/p/w500/${json.poster_path}" alt="Culpa tuya" class="movies-image">
            <div class="movies-info">
                <div class="preview-container">
                    <img data-movie-view-id="${movie.external_id}" src="https://image.tmdb.org/t/p/w500/${json.backdrop_path}" alt="Vista previa película 1" class="preview-image">
                </div>
                <div class="info-content">
                    <h2 class="movies-title">${json.original_title}</h2>
                    <p class="movies-description">
                        ${json.overview}
                    </p>
                    <p class="movies-price">$${movie.precio}</p>
                    <br>
                    <div class="actions-container">
                        <button class="btn-cart buyMovie" data-movie-id="${json.id}" data-movie-price="${movie.precio}">
                            🛒 Añadir al carrito
                        </button>
                    </div>
                </div>
            </div>
        </article>
        `
    moviesSection.innerHTML += movieCard;
}));

/* Agregar al carrito */
const btnsBuyMovie = document.querySelectorAll(".buyMovie");
const countCart = document.getElementById("cart-count");

const cart = localStorage.getItem("cart");
if (cart) {
    const cartArray = JSON.parse(cart);
    countCart.innerText = cartArray.length;
}

btnsBuyMovie.forEach(btn => {
    btn.addEventListener("click", (e) => {
        e.preventDefault();

        const cart = localStorage.getItem("cart");
        if (cart) {
            const cartArray = JSON.parse(cart);

            if (!cartArray.some(item => item.id === btn.dataset.movieId)) {
                cartArray.push({
                    id: btn.dataset.movieId,
                    price: btn.dataset.moviePrice
                });
            } else {
                return Swal.fire({
                    icon: "error",
                    title: "Ya tienes esta película en el carrito",
                    text: "No puedes agregarla de nuevo",
                    showConfirmButton: false,
                    toast: true,
                    position: "top",
                    timer: 3000,
                    timerProgressBar: true,
                });
            }

            localStorage.setItem("cart", JSON.stringify(cartArray));

            countCart.innerText = cartArray.length;
        } else {
            localStorage.setItem("cart", JSON.stringify([
                {
                    id: btn.dataset.movieId,
                    price: btn.dataset.moviePrice
                }
            ]));

            const cartArray = JSON.parse(localStorage.getItem("cart"));

            countCart.innerText = cartArray.length;
        }

        Swal.fire({
            icon: "success",
            title: "Excelente compra!😮",
            text: "wow!!!",
            showConfirmButton: false,
            toast: true,
            position: "top",
            timer: 3000,
            timerProgressBar: true,
        });
    });
});

/* Detalles de las peliculas */
const viewMovie = document.querySelectorAll("[data-movie-view-id]");

viewMovie.forEach(button => {
    button.addEventListener("click", async (e) => {
        const movieId = e.target.getAttribute("data-movie-view-id");
        navigateTo("/detalles_peliculas", "movie_id=" + movieId);
    });
});
