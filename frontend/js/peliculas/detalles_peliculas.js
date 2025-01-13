import { CONFIG } from "../config.js";

// Obtener la URL actual
const urlParams = new URLSearchParams(window.location.search);

// Variable global para el reproductor de YouTube
let player;

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
        /* Pelicula BD */
        const dataMovie = await response.json();
        console.log(dataMovie);

        /* Obtener información de la API externa */
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

        /* Trailer */
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

        // Modificar el src del iframe para incluir el trailer de YouTube
        const trailerIframe = document.getElementById("trailer");
        trailerIframe.src = `https://www.youtube.com/embed/${keyTrailer}?autoplay=1&enablejsapi=1`;

        // Agregar el script de la API de YouTube
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

        // Agregar la información dinámica al HTML
        document.getElementById("movie-title").innerText = movieApi.title;
        document.getElementById("movie-description").innerText = movieApi.overview;

        // Metadatos
        const metadataDiv = document.getElementById("movie-metadata");
        metadataDiv.innerHTML = `
            <span>IMDb: ${movieApi.vote_average}</span>
            <span>Duración: ${movieApi.runtime} min</span>
            <span>Año: ${movieApi.release_date.split('-')[0]}</span>
        `;

        // Etiquetas
        const tagsDiv = document.getElementById("movie-tags");
        movieApi.genres.forEach(genre => {
            const tagElement = document.createElement('span');
            tagElement.classList.add('genre-tag');
            tagElement.innerText = genre.name;
            tagsDiv.appendChild(tagElement);
        });

        // Agregar el ícono del trailer al lado de los tags
        const trailerIcon = document.createElement('span');
        trailerIcon.classList.add('trailer-icon');
        trailerIcon.setAttribute('title', 'Ver Trailer');
        trailerIcon.innerHTML = '<i class="fa fa-film"></i>';
        
        // Agregar el evento de clic al ícono
        trailerIcon.addEventListener('click', function() {
            window.open(`https://www.youtube.com/watch?v=${keyTrailer}`, '_blank');
        });

        // Agregar el ícono después de los tags
        tagsDiv.appendChild(trailerIcon);

    } else {
        console.error("Algo salió mal al obtener la película.");
    }
}

// Función que se llamará cuando la API de YouTube esté lista
window.onYouTubeIframeAPIReady = function() {
    player = new YT.Player('trailer', {
        events: {
            'onReady': function(event) {
            }
        }
    });
};

getMovie();
