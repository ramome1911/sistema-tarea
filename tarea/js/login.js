document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const registerForm = document.getElementById("registerForm");
  const goToRegister = document.getElementById("goToRegister");
  const goToLogin = document.getElementById("goToLogin");

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  // Registro
  registerForm.addEventListener("submit", e => {
    e.preventDefault();
    const usuario = document.getElementById("regUsuario").value.trim();
    const clave = document.getElementById("regClave").value.trim();

    if (usuarios.find(u => u.usuario === usuario)) {
      alert("Este usuario ya existe");
      return;
    }

    usuarios.push({ usuario, clave });
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    alert("Usuario registrado correctamente.");
    registerForm.reset();
  });

  // Login
  loginForm.addEventListener("submit", e => {
    e.preventDefault();
    const usuario = document.getElementById("loginUsuario").value.trim();
    const clave = document.getElementById("loginClave").value.trim();

    const user = usuarios.find(u => u.usuario === usuario && u.clave === clave);

    if (user) {
      localStorage.setItem("usuarioActivo", usuario);
      window.location.href = "dashboard.html";
    } else {
      alert("Usuario o contraseña incorrectos");
    }
  });

  goToRegister.addEventListener("click", e => {
    e.preventDefault();
    loginForm.classList.add("hidden");
    registerForm.classList.remove("hidden");
  });

  goToLogin.addEventListener("click", e => {
    e.preventDefault();
    registerForm.classList.add("hidden");
    loginForm.classList.remove("hidden");
  });
});
