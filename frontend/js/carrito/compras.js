import { CONFIG } from "../config.js";
import { navigateTo } from "../router.js";

/* IDS DE LA BASE DE DATOS */
const response = await fetch(`${CONFIG.API_BASE_URL}/buys/list`, {
    method: "GET",
    headers: { "Content-Type": "application/json" }
});

let { buys } = await response.json();
const tbody = document.getElementById("buys");

if (buys.length > 0) {
    await Promise.all(buys.map(async buy => {
        const url = `https://api.themoviedb.org/3/movie/${buy.movie_id}?language=en-US`;
        const options = {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
            }
        };

        const response = await fetch(url, options);

        /* La pelicula */
        const movie = await response.json();
        // console.log(movie);

        tbody.innerHTML += `
            <tr>
                <td>${buy.id}</td>
                <td>${buy.movie_id}</td>
                <td>${buy.precio}</td>
                <td>${buy.fecha_limite}</td>
                <td>${buy.creacion}</td>
                <td><button data-buy-id="${buy.id}">Ver recibo</button></td>
            </tr>
        `;
    }));

    const buyButtons = document.querySelectorAll("[data-buy-id]");

    buyButtons.forEach(button => {
        button.addEventListener("click", async (e) => {
            const buyId = e.target.getAttribute("data-buy-id");
            console.log(buyId);
            navigateTo("/recibo", "buy_id=" + buyId);
        });
    });
} else {
    tbody.innerHTML = `
        <tr>
            <td colspan="6">No hay compras</td>
        </tr>
    `;
}
