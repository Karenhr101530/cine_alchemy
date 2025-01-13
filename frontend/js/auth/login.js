import { CONFIG } from "../config.js";
import { navigateTo } from "../router.js";

document.getElementById("loginForm").addEventListener("click", async (e) => {
  e.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  if (!email || !password) {
    Swal.fire({
      icon: "warning", // danger-peligro, info ? , success- validación correcto
      title: "Advertencia!😮",
      text: "Campos requeridos.",
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  //Petición a API js
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (response.ok) {
    const data = await response.json();
    localStorage.setItem("token", data.token); //Guardar token en el navegador

    navigateTo("/peliculas");
  } else {
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: "Credenciales invalidas.",
      showConfirmButton: false,
      toast: true,
      position: "top-end",
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }
});
