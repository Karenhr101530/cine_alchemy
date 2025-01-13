import { CONFIG } from "../config.js";
import { navigateTo } from "../router.js";

document.getElementById("registerForm").addEventListener("click", async (e) => {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;
  const confirmPassword = document.getElementById("confirmPassword").value;

  // Validar que todos los campos estén llenos
  if (!name || !email || !password || !confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia!😮",
      text: "Todos los campos son obligatorios.",
      showConfirmButton: false,
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  // Validar formato de correo electrónico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia!😮",
      text: "Ingresa un correo electrónico válido.",
      showConfirmButton: false,
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  // Validar que la contraseña tenga al menos 8 caracteres
  if (password.length < 8) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia!😮",
      text: "La contraseña debe tener al menos 8 caracteres.",
      showConfirmButton: false,
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }


  // Validar que las contraseñas coincidan
  if (password !== confirmPassword) {
    Swal.fire({
      icon: "warning",
      title: "Advertencia!😮",
      text: "Las contraseñas no coinciden.",
      showConfirmButton: false,
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
    });
    return;
  }

  // Petición a la API
  const response = await fetch(`${CONFIG.API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (response.ok) {
    Swal.fire({
      icon: "success",
      title: "Registro Exitoso! 🎉",
      text: "Cuenta creada correctamente. Ahora inicia sesión.",
      showConfirmButton: false,
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
    });

   navigateTo("/login");
  } else {
    const errorData = await response.json();
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: errorData.message || "No se pudo crear la cuenta.",
      showConfirmButton: false,
      toast: true,
      position: "top",
      timer: 3000,
      timerProgressBar: true,
    });
  }
});
