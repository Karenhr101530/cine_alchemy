import { CONFIG } from "../config.js";

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
    console.log(json);
    const movieCard = `
            <article class="movies-card">
            <img src="https://image.tmdb.org/t/p/w500/${json.poster_path}" alt="Culpa tuya" class="movies-image">
            <div class="movies-info">
                <div class="preview-container">
                    <img src="https://image.tmdb.org/t/p/w500/${json.backdrop_path}" alt="Vista previa película 1" class="preview-image">
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

            cartArray.push({
                id: btn.dataset.movieId,
                price: btn.dataset.moviePrice,
            });

            localStorage.setItem("cart", JSON.stringify(cartArray));

            countCart.innerText = cartArray.length;
        } else {
            localStorage.setItem("cart", JSON.stringify([
                {
                    id: btn.dataset.movieId,
                    price: btn.dataset.moviePrice,
                }
            ]));
        }

        Swal.fire({
            icon: "success",
            title: "Excelente compra!😮",
            text: "wow!!!",
            showConfirmButton: false,
            toast: true,
            position: "top-start",
            timer: 3000,
            timerProgressBar: true,
        });
    });
});

