import { CONFIG } from "../config.js";

/* Actualizar contador */
let movies = localStorage.getItem("cart");
const countCart = document.getElementById("cart-count");
const totalCarritoShow = document.getElementById("totalCarritoShow");
if (movies) {
    const cartArray = JSON.parse(movies);
    countCart.innerText = cartArray.length;
}

/* Mostrar carrito */
movies = JSON.parse(localStorage.getItem("cart"));
console.log(movies);
const cartItemsContainer = document.getElementById("cart-items");
cartItemsContainer.innerHTML = '';

/* Funciones flecha:  
    async function(movie){}   
    async (movie, para2) => {} 
    async movie => {} 
*/
let sumaCarrito = 0;
if (movies.length > 0) {
    movies.map(
        async movie => {
            const url = `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
                }
            };

            /*De la API se recibe un Json*/
            /*Con la función fetch me devuelve un objeto tipo promesa porque es una función asincrónica */
            const responseJSON = await fetch(url, options);

            /* JSON(): Transforma una promesa para usarla como un objeto JavaScrispt */
            const json = await responseJSON.json();
            console.log(json);

            const cartItem = `
            <div class="cart-item">
                <img src="https://image.tmdb.org/t/p/w500/${json.poster_path}" alt="${json.original_title}">
                <div class="cart-item-info">
                    <h3>${json.original_title}</h3>
                    <p>Año: ${json.release_date}</p>
                    ${json.genres.map(function (genre) {
                return `<span class="genre-tag">${genre.name}</span>`
            })
                }
                </div>
                <div class="price">${movie.price}</div>
                <button class="delete-btn" onclick="removeItem(${movie.id})">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
            cartItemsContainer.innerHTML += cartItem;
            sumaCarrito = parseInt(movie.price) + sumaCarrito;
            console.log(sumaCarrito)
            totalCarritoShow.innerHTML = sumaCarrito;
        }
    );

} else {
    cartItemsContainer.innerHTML = '<p>Tu carrito está vacío.</p>';
}

// Actualizar contador y total
function updateCartSummary() {
    let movies = JSON.parse(localStorage.getItem("cart")) || [];
    const countCart = document.getElementById("cart-count");
    const cartSummary = document.getElementById("cart-summary");

    countCart.innerText = movies.length;
    cartSummary.innerText = `Tienes ${movies.length} artículo(s)`;
}

// Ejecutar al cargar la página
updateCartSummary();
