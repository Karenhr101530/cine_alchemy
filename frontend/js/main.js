import { navigateTo, handleRouting } from "./router.js";

document.addEventListener("DOMContentLoaded", () => {
  handleRouting(window.location.pathname);

  document.querySelectorAll("[data-route]").forEach((button) => {
    button.addEventListener("click", (e) => {
      const route = e.target.getAttribute("data-route");
      navigateTo(route);
    });
  });

  window.addEventListener("popstate", () => {
    handleRouting(window.location.pathname);
  });
});

// Efecto de navbar al hacer scroll
window.addEventListener('scroll', function () {
  const navbar = document.querySelector('.navbar');
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});

// Crear efecto de películas flotantes
function createFloatingMovies() {
  const container = document.querySelector('.floating-movies');
  const numberOfCards = 10;

  for (let i = 0; i < numberOfCards; i++) {
    const card = document.createElement('div');
    card.classList.add('movie-card');
    card.style.left = `${Math.random() * 100}%`;
    card.style.animationDelay = `${Math.random() * 15}s`;
    container.appendChild(card);
  }
}

createFloatingMovies();