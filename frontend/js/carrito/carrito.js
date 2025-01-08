/* Actualizar contador */
let movies = localStorage.getItem("cart");
const countCart = document.getElementById("cart-count");
if (movies) {
    const cartArray = JSON.parse(movies);
    countCart.innerText = cartArray.length;
}

/* Mostrar carrito */
movies = JSON.parse(localStorage.getItem("cart"));
console.log(movies);

const listMovies = document.getElementById("listMovies");

if (movies) {
    movies.forEach(movie => {

        /* Hacer peticion a la api de tmdb */


        const li = `
            <li>${movie.id} - ${movie.price}</li>
        `
        listMovies.innerHTML += li;
    });
}