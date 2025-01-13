import { CONFIG } from "../config.js";
import { navigateTo } from "../router.js";

// Función para eliminar película
window.removeItem = function (movieId) {
    console.log("Removing movie with ID:", movieId);

    // Convertir movieId a string para asegurar la comparación correcta
    movieId = movieId.toString();

    // Obtener el carrito actual
    let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
    console.log("Carrito antes de eliminar:", cartItems);

    // Filtrar el item usando comparación de strings
    const updatedCart = cartItems.filter(item => item.id !== movieId);
    console.log("Carrito después de eliminar:", updatedCart);

    // Actualizar localStorage
    localStorage.setItem("cart", JSON.stringify(updatedCart));

    // Recargar la página
    window.location.reload();
};

/* Actualizar contador */
let movies = localStorage.getItem("cart");
const countCart = document.getElementById("cart-count");
const totalCarritoShow = document.getElementById("totalCarritoShow");
const cartItemsContainer = document.getElementById("cart-items");

if (movies) {
    const cartArray = JSON.parse(movies);
    countCart.innerText = cartArray.length;
}

/* Mostrar carrito */
movies = JSON.parse(localStorage.getItem("cart"));
console.log("Carrito inicial:", movies);

// Limpiar el contenedor antes de agregar elementos
cartItemsContainer.innerHTML = '';

/* Funciones flecha:  
    async function(movie){}   
    async (movie, para2) => {} 
    async movie => {} 
*/
let sumaCarrito = 0;
if (movies && movies.length > 0) {
    movies.forEach(
        async movie => {
            const url = `https://api.themoviedb.org/3/movie/${movie.id}?language=en-US`;
            const options = {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
                }
            };

            try {
                /*De la API se recibe un Json*/
                /*Con la función fetch me devuelve un objeto tipo promesa porque es una función asincrónica */
                const responseJSON = await fetch(url, options);

                /* JSON(): Transforma una promesa para usarla como un objeto JavaScrispt */
                const json = await responseJSON.json();
                console.log("Datos de la película:", json);

                const cartItem = `
                <div class="cart-item" id="movie-${movie.id}">
                    <img src="https://image.tmdb.org/t/p/w500/${json.poster_path}" alt="${json.original_title}">
                    <div class="cart-item-info">
                        <h3>${json.original_title}</h3>
                        <p>Año: ${json.release_date}</p>
                        ${json.genres.map(genre => `<span class="genre-tag">${genre.name}</span>`).join('')}
                    </div>
                    <div class="price">$${movie.price}</div>
                    <button class="delete-btn" onclick="removeItem('${movie.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
                `;

                // Agregar el nuevo elemento
                cartItemsContainer.innerHTML += cartItem;

                // Actualizar la suma del carrito
                sumaCarrito += parseInt(movie.price);
                totalCarritoShow.innerHTML = `$${sumaCarrito}`;
            } catch (error) {
                console.error("Error al cargar la película:", error);
            }
        }
    );
} else {
    cartItemsContainer.innerHTML = `
        <div class="empty-cart">
            <i class="fa-solid fa-face-sad-tear"></i>
            <p>Tu carrito está vacío.</p>
        </div>
    `;
    totalCarritoShow.innerHTML = '$0'
    document.getElementById('checkout-btn').style.display = 'none';
}

// Actualizar contador y total
function updateCartSummary() {
    let movies = JSON.parse(localStorage.getItem("cart")) || [];
    countCart.innerText = movies.length;
    if (document.getElementById('cart-summary')) {
        document.getElementById('cart-summary').innerText = `Tienes ${movies.length} artículo(s)`;
    }
}

// Ejecutar al cargar la página
updateCartSummary();

// Funcionalidad del modal de pago
const checkoutBtn = document.getElementById('checkout-btn');
const paymentModal = document.getElementById('paymentModal');
const receiptModal = document.getElementById('receiptModal');
const closeButtons = document.getElementsByClassName('close');
// const paymentForm = document.getElementById('paymentForm');
// const printReceiptBtn = document.getElementById('printReceipt');

// Abrir modal de pago
checkoutBtn.onclick = function () {
    paymentModal.style.display = "block";
}

// Cerrar modales al hacer clic en X
Array.from(closeButtons).forEach(button => {
    button.onclick = function () {
        paymentModal.style.display = "none";
        receiptModal.style.display = "none";
    }
});

// Cerrar modales al hacer clic fuera de ellos
window.onclick = function (event) {
    if (event.target == paymentModal) {
        paymentModal.style.display = "none";
    }
    if (event.target == receiptModal) {
        receiptModal.style.display = "none";
    }
}

// Enviar formulario de pago
document.getElementById('payConfirm').addEventListener('click', async () => {
    let nombre = document.getElementById('nombre').value;
    let email = document.getElementById('email').value;
    let telefono = document.getElementById('telefono').value;
    let tarjeta = document.getElementById('tarjeta').value;
    let expiracion = document.getElementById('expiracion').value;
    let cvv = document.getElementById('cvv').value;

    if (!nombre || !email || !telefono || !tarjeta || !expiracion || !cvv) {
        Swal.fire({
            icon: "error",
            title: "Faltan datos",
            text: "Por favor, completa todos los campos",
            showConfirmButton: false,
            toast: true,
            position: "top-start",
            timer: 3000,
            timerProgressBar: true,
        });
    } else {
        document.getElementById('payConfirm').disabled = true;
        document.getElementById('payConfirm').innerHTML = `Cargando...`;

        //Petición a API js
        const response = await fetch(`${CONFIG.API_BASE_URL}/buys/create`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                cart: JSON.parse(localStorage.getItem("cart")),
                token: localStorage.getItem("token"),
                jsonRecibo: {
                    nombre: nombre,
                    email: email,
                    telefono: telefono
                }
            }),
        });

        if (response.ok) {
            localStorage.removeItem("cart");

            Swal.fire({
                icon: "success",
                title: "Pago exitoso!",
                text: "Tu compra se ha realizado con éxito",
                showConfirmButton: false,
                toast: true,
                position: "top",
                timer: 3000,
                timerProgressBar: true,
            });

            setTimeout(() => {
                document.getElementById('payConfirm').disabled = false;
                document.getElementById('payConfirm').innerHTML = `Confirmar Pago`;
                navigateTo("/compras");
            }, 3000);
        } else {
            document.getElementById('payConfirm').disabled = false;
            document.getElementById('payConfirm').innerHTML = `Confirmar Pago`;
            Swal.fire({
                icon: "error",
                title: "Error!",
                text: "Algo salió mal",
                showConfirmButton: false,
                toast: true,
                position: "top-start",
                timer: 3000,
                timerProgressBar: true,
            });
        }
    }
});