document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  const avatarActivo = localStorage.getItem("avatarActivo");

  // Verificar sesión
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  // Mostrar datos en el navbar si existen los elementos
  const avatarNav = document.getElementById("userAvatarNav");
  const nombreNav = document.getElementById("userNameNav");

  if (avatarNav) {
    avatarNav.src = avatarActivo || "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAADmr0l2AAAAMFBMVEX///8AAADm5ubR0dG6urrx8fHf39/V1dWnp6eTk5PGxsbv7+/Z2dnNzc2hoaHHx8f8/f21hj9WAAABpklEQVR4nO3aUW6DMAwF0Awx/z9uZPZ1qYbBgpE3Z58xJ7omB6BtVh7AAAAAAAAAAAAALDPHj7Drg9Vu+EdaH0aa+9bHn6bfAdbwUO4eZn4C6Pw4znZpvVJ6Xzk76Ac2aHYjzlmV0+c+JbEo3xyx3E9b/MixplkcpPzv3X9Ib4bO28U/n9x3GiyKMzZPH40U/qbLhb7e/kP38wI5bZcnxEukpQJq6Ux8zKpV6MbDkK8VFYZr+Fz/bZtHt/Um7c0l8Jx2td/ZZD9i+rVf6kvr/Zx3dRmvT1InXNe8v4lwcAAAAAAADQnhd3jslBPHL9t0QAAAAASUVORK5CYII=";
  }

  if (nombreNav) {
    nombreNav.textContent = usuarioActivo;
  }

  // Cerrar sesión
  const cerrar = document.getElementById("cerrarSesion");
  if (cerrar) {
    cerrar.addEventListener("click", () => {
      localStorage.removeItem("usuarioActivo");
      localStorage.removeItem("avatarActivo");
      window.location.href = "index.html";
    });
  }
});
