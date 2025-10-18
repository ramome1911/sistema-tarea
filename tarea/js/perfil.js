document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
  const user = usuarios.find(u => u.usuario === usuarioActivo);

  if (!user) {
    alert("Error: usuario no encontrado.");
    window.location.href = "index.html";
    return;
  }

  // --- Elementos del DOM ---
  const avatar = document.getElementById("userAvatar");
  const avatarNav = document.getElementById("userAvatarNav");
  const nombre = document.getElementById("userName");
  const nombreNav = document.getElementById("userNameNav");
  const inputNombre = document.getElementById("nombreUsuario");
  const inputClave = document.getElementById("claveUsuario");
  const inputImagen = document.getElementById("nuevaImagen");

  // Mostrar datos actuales
  avatar.src = user.avatar;
  avatarNav.src = user.avatar;
  nombre.textContent = user.usuario;
  nombreNav.textContent = user.usuario;
  inputNombre.value = user.usuario;
  inputClave.value = user.clave;

  // --- Guardar cambios ---
  document.getElementById("perfilForm").addEventListener("submit", e => {
    e.preventDefault();

    const nuevoNombre = inputNombre.value.trim();
    const nuevaClave = inputClave.value.trim();

    // Validación
    if (nuevoNombre === "" || nuevaClave === "") {
      alert("Por favor completa todos los campos.");
      return;
    }

    // Si el usuario cambia su nombre, verificar que no exista otro igual
    if (nuevoNombre !== usuarioActivo && usuarios.find(u => u.usuario === nuevoNombre)) {
      alert("El nombre de usuario ya está en uso.");
      return;
    }

    // Actualizar la imagen si el usuario seleccionó una nueva
    if (inputImagen.files.length > 0) {
      const lector = new FileReader();
      lector.onload = () => {
        actualizarUsuario(nuevoNombre, nuevaClave, lector.result);
      };
      lector.readAsDataURL(inputImagen.files[0]);
    } else {
      actualizarUsuario(nuevoNombre, nuevaClave, user.avatar);
    }
  });

  // --- Cerrar sesión ---
  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    localStorage.removeItem("avatarActivo");
    window.location.href = "index.html";
  });

  // --- Función para guardar cambios ---
  function actualizarUsuario(nuevoNombre, nuevaClave, nuevoAvatar) {
    // Actualizar los datos del usuario activo
    user.usuario = nuevoNombre;
    user.clave = nuevaClave;
    user.avatar = nuevoAvatar;

    // Actualizar en el array global
    const index = usuarios.findIndex(u => u.usuario === usuarioActivo);
    usuarios[index] = user;

    // Actualizar almacenamiento
    localStorage.setItem("usuarios", JSON.stringify(usuarios));
    localStorage.setItem("usuarioActivo", nuevoNombre);
    localStorage.setItem("avatarActivo", nuevoAvatar);

    alert("Perfil actualizado correctamente.");
    window.location.reload();
  }
});
