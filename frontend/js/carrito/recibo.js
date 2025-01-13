import { CONFIG } from "../config.js";

// Obtener la URL actual
const urlParams = new URLSearchParams(window.location.search);

async function getBuy() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/buys/findBuy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            cart: JSON.parse(localStorage.getItem("cart")),
            token: localStorage.getItem("token"),
            buyId:  urlParams.get('buy_id')
        }),
    });

    if (response.ok) {
        const dataBuy = await response.json();
        const dataRecibo = JSON.parse(dataBuy.buy.json_recibo);

        console.log(dataBuy.buy);
        console.log(dataRecibo);

        // Usar la fecha actual para la compra
        const purchaseDate = new Date(dataBuy.buy.creacion);
        const formattedDate = purchaseDate.toLocaleDateString();

        // Obtener la fecha límite
        const limitDate = new Date(dataBuy.buy.fecha_limite);
        const formattedLimitDate = limitDate.toLocaleDateString();

        // Llenar la información del recibo en el HTML
        document.getElementById("fecha").innerHTML = `Fecha: ${formattedDate}`;
        document.getElementById("ordenId").innerText = dataBuy.buy.id;
        document.getElementById("total-precio").innerText = `$${dataBuy.buy.precio}`;

        // Insertar los detalles del comprador y la fecha límite
        const itemsContainer = document.getElementById("items-container");
        let contenidoHTML = `
            <div class="usuario-info">
                <p><strong>Nombre:</strong> ${dataRecibo.nombre}</p>
                <p><strong>Email:</strong> ${dataRecibo.email}</p>
                <p><strong>Teléfono:</strong> ${dataRecibo.telefono}</p>
            </div>
            <div class="detalle-fecha-limite">
                <p><strong>Fecha Límite de Alquiler:</strong> ${formattedLimitDate}</p>
            </div>
        `;

        // Agregar la seccion de la pelicula
        contenidoHTML += '<div class="movies-container">';
        try {
            const movieResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${dataBuy.buy.movie_id}?language=es-ES`,
                {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
                    }
                }
            );

            if (movieResponse.ok) {
                const movieData = await movieResponse.json();
                contenidoHTML += `
                            <div class="movie-item">
                                <img class="movie-poster" 
                                    src="https://image.tmdb.org/t/p/w500${movieData.poster_path}" 
                                    alt="${movieData.title}">
                                <div class="movie-details">
                                    <h4>${movieData.title}</h4>
                                    <p><strong>Año:</strong> ${movieData.release_date ? movieData.release_date.split('-')[0] : 'N/A'}</p>
                                    <p><strong>Precio:</strong> $${dataBuy.buy.precio}</p>
                                </div>
                            </div>
                        `;
            }
        } catch (error) {
            console.error(`Error al obtener la película:`, error);
        }
        contenidoHTML += '</div>';


        // Actualizar el contenedor con todo el HTML junto
        itemsContainer.innerHTML = contenidoHTML;
    } else {
        console.error("Algo salió mal al obtener el recibo.");
    }
}

getBuy();