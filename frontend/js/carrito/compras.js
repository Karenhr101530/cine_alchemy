import { CONFIG } from "../config.js";
import { navigateTo } from "../router.js";

async function loadPurchases() {
    const response = await fetch(`${CONFIG.API_BASE_URL}/buys/list`, {
        method: "GET",
        headers: { "Content-Type": "application/json" }
    });
    
    const { buys } = await response.json();
    const tbody = document.getElementById("buys");
    
    if (buys.length > 0) {
        const purchaseRows = await Promise.all(buys.map(async buy => {
            const movieResponse = await fetch(
                `https://api.themoviedb.org/3/movie/${buy.movie_id}?language=en-US`,
                {
                    method: 'GET',
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${CONFIG.THEMOVIEDB_API_TOKEN}`
                    }
                }
            );
            
            const movie = await movieResponse.json();
            
            return `
                <tr>
                    <td>${buy.id}</td>
                    <td>
                        <img 
                            src="https://image.tmdb.org/t/p/w200${movie.poster_path}" 
                            alt="${movie.title}" 
                            class="movie-poster"
                        >
                    </td>
                    <td>${movie.title}</td>
                    <td>$${buy.precio}</td>
                    <td>${new Date(buy.fecha_limite).toLocaleDateString()}</td>
                    <td>${new Date(buy.creacion).toLocaleDateString()}</td>
                    <td>
                        <button class="data-buy-id" data-buy-id="${buy.id}">
                            Ver recibo
                        </button>
                    </td>
                </tr>
            `;
        }));
        
        tbody.innerHTML = purchaseRows.join('');
        
        document.querySelectorAll("[data-buy-id]").forEach(button => {
            button.addEventListener("click", (e) => {
                const buyId = e.target.getAttribute("data-buy-id");
                navigateTo("/recibo", "buy_id=" + buyId);
            });
        });
    } else {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="no-purchases">
                    No hay compras registradas
                </td>
            </tr>
        `;
    }
}

loadPurchases();
