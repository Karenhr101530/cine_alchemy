/* Navegador */
export const navigateTo = (route) => {
  history.pushState({}, "", route);
  handleRouting(route);
};

/* Enrutador */
export const handleRouting = async (route) => {
  toogleNavButtons();
  const app = document.getElementById("app");
  switch (route) {
    /* Rutas publicas */
    case "/":
      app.innerHTML = await (await fetch("views/home.html")).text();
      break;
      case "/index.html":
      app.innerHTML = await (await fetch("views/home.html")).text();
      break;
    case "/login":
      app.innerHTML = await (await fetch("views/login.html")).text();
      loadScript("login/login");
      break;
    case "/logout":
      localStorage.removeItem("token");
      navigateTo("/login");
      break;
    case "/register":
      app.innerHTML = await (await fetch("views/register.html")).text();
      loadScript("register/register");
      break;
    /* Rutas privadas */
    case "/peliculas":
      if (verifiedToken()) {
        app.innerHTML = await (await fetch("views/peliculas.html")).text();
      }
      break;
    case "/compras":
        app.innerHTML = await (await fetch("views/compras.html")).text();
      break;
    default:
      app.innerHTML = `<h1>404 - Not Found</h1>`;
  }
};

/* Cargar js dinámicamente */
const loadScript = (viewName) => {
  const scriptSrc = `js/${viewName}.js`;

  /* Verificar si el script ya existe */
  const existingScript = Array.from(document.scripts).find(
    (script) => script.src === new URL(scriptSrc, document.baseURI).href
  );

  if (existingScript) {
    return;
  }

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

  if (token) {
    /* Activos */
    logoutButton.style.display = "block";
    peliculasButton.style.display = "block";
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
  }
};
