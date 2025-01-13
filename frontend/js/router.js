/* Navegador */
export const navigateTo = (route, id = null) => {
  let routeString = route;
  if (id) {
    routeString = route + '?' + id;
  }
  history.pushState({}, "", routeString);
  handleRouting(route);
};

/* Enrutador */
export const handleRouting = async (route) => {

  toogleNavButtons();
  const app = document.getElementById("app");

  /* Borrar los js que cargabamos dinamicamente */
  const scripts = document.querySelectorAll("script[src]");
  scripts.forEach(script => script.remove());

  switch (route) {
    /* Rutas publicas */
    case "/":
      app.innerHTML = await (await fetch("views/home.html")).text();
      document.getElementById("explorerMovies").addEventListener("click", (e) => {
        if (verifiedToken()) {
          const route = e.target.getAttribute("data-route");
          navigateTo(route);
        } else {
          navigateTo('/login');
        }
      });
      break;
    case "/index.html":
      app.innerHTML = await (await fetch("views/home.html")).text();
      break;
    case "/login":
      app.innerHTML = await (await fetch("views/login.html")).text();
      document.getElementById("signupLink").addEventListener("click", (e) => {
        navigateTo('/register');
      });
      loadScript("auth/login");
      break;
    case "/logout":
      localStorage.removeItem("token");
      navigateTo("/login");
      break;
    case "/register":
      app.innerHTML = await (await fetch("views/register.html")).text();
      document.getElementById("loginLink").addEventListener("click", (e) => {
        navigateTo('/login');
      });
      loadScript("auth/register");
      break;
    /* Rutas privadas */
    case "/peliculas":
      if (verifiedToken()) {
        app.innerHTML = await (await fetch("views/peliculas.html")).text();
        loadScript("peliculas/peliculas");
      }
      break;
    case "/detalles_peliculas":
      if (verifiedToken()) {
        app.innerHTML = await (await fetch("views/detalles_peliculas.html")).text();
        loadScript("peliculas/detalles_peliculas");
      }
      break;
    case "/carrito":
      if (verifiedToken()) {
        app.innerHTML = await (await fetch(`views/carrito.html`)).text();
        document.getElementById("continue-shopping").addEventListener("click", (e) => {
          navigateTo('/peliculas');
        });
        loadScript("carrito/carrito");
      }
      break;
    case "/recibo":
      if (verifiedToken()) {
        app.innerHTML = await (await fetch(`views/recibo.html`)).text();
        loadScript("carrito/recibo");
      }
      break;
    case "/compras":
      if (verifiedToken()) {
        app.innerHTML = await (await fetch(`views/compras.html`)).text();
        loadScript("carrito/compras");
      }
      break;
    default:
      app.innerHTML = `<h1>404 - Not Found</h1>`;
  }
};

/* Cargar js dinámicamente */
const loadScript = (viewName) => {
  const scriptSrc = `js/${viewName}.js?timestamp=${new Date().getTime()}`;

  const script = document.createElement("script");
  script.src = scriptSrc;
  script.type = "module";
  document.body.appendChild(script);
};

/* Verificar token de inicio de sesion */
const verifiedToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    return true;
  } else {
    navigateTo("/login");
    return false;
  }
};

/* Alternar botones de navegacion */
const toogleNavButtons = () => {
  const token = localStorage.getItem("token");
  const loginButton = document.getElementById("loginButton");
  const register = document.getElementById("registerButton");
  const logoutButton = document.getElementById("logoutButton");
  const peliculasButton = document.getElementById("peliculasButton");
  const cartIcon = document.getElementById("cartIcon");
  const cartCount = document.getElementById("cart-count");
  const comprasButton = document.getElementById("comprasButton");

  if (token) {
    /* Activos */
    logoutButton.style.display = "block";
    peliculasButton.style.display = "block";
    cartIcon.style.display = "block";
    cartCount.style.display = "inline"; // Asegura que el contador sea visible
    comprasButton.style.display = "block";
    /* Inactivos */
    loginButton.style.display = "none";
    register.style.display = "none";
  } else {
    /* Activos */
    loginButton.style.display = "block";
    register.style.display = "block";
    /* Inactivos */
    logoutButton.style.display = "none";
    peliculasButton.style.display = "none";
    cartIcon.style.display = "none";
    cartCount.style.display = "none"; // Oculta el contador para usuarios no autenticados
    comprasButton.style.display = "none";
  }
};
