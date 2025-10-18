document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const tareasKey = `tareas_${usuarioActivo}`;
  const notificacionesKey = `notificaciones_${usuarioActivo}`;

  const tareas = JSON.parse(localStorage.getItem(tareasKey)) || [];
  const notificaciones = JSON.parse(localStorage.getItem(notificacionesKey)) || [];

  const avatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  const listaNotificaciones = document.getElementById("listaNotificaciones");
  const tablaTareas = document.getElementById("tablaTareas");

  // Imagen de perfil genérica (Base64)
  avatar.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAADmr0l2AAAAMFBMVEX///8AAADm5ubR0dG6urrx8fHf39/V1dWnp6eTk5PGxsbv7+/Z2dnNzc2hoaHHx8f8/f21hj9WAAABpklEQVR4nO3aUW6DMAwF0Awx/z9uZPZ1qYbBgpE3Z58xJ7omB6BtVh7AAAAAAAAAAAAALDPHj7Drg9Vu+EdaH0aa+9bHn6bfAdbwUO4eZn4C6Pw4znZpvVJ6Xzk76Ac2aHYjzlmV0+c+JbEo3xyx3E9b/MixplkcpPzv3X9Ib4bO28U/n9x3GiyKMzZPH40U/qbLhb7e/kP38wI5bZcnxEukpQJq6Ux8zKpV6MbDkK8VFYZr+Fz/bZtHt/Um7c0l8Jx2td/ZZD9i+rVf6kvr/Zx3dRmvT1InXNe8v4lwcAAAAAAADQnhd3jslBPHL9t0QAAAAASUVORK5CYII=";
  userName.textContent = usuarioActivo;

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  // --- Cargar tareas en la tabla ---
  if (tareas.length === 0) {
    tablaTareas.innerHTML = `<tr><td colspan="4" class="text-center text-muted">No hay tareas registradas</td></tr>`;
  } else {
    tablaTareas.innerHTML = tareas.map(t => `
      <tr>
        <td>${t.titulo}</td>
        <td>${t.descripcion || '-'}</td>
        <td><span class="badge bg-${colorPrioridad(t.prioridad)}">${t.prioridad}</span></td>
        <td>${t.estado}</td>
      </tr>
    `).join('');
  }

  // --- Mostrar notificaciones ---
  listaNotificaciones.innerHTML = notificaciones.length
    ? notificaciones.slice(-5).reverse().map(n => `<li class="list-group-item small">${n}</li>`).join('')
    : `<li class="list-group-item text-muted">No hay notificaciones</li>`;

  // --- Gráfico de progreso ---
  const total = tareas.length;
  const completadas = tareas.filter(t => t.estado === "Completada").length;
  const enProgreso = tareas.filter(t => t.estado === "En progreso").length;
  const pendientes = tareas.filter(t => t.estado === "Pendiente").length;
  const progreso = total > 0 ? Math.round((completadas / total) * 100) : 0;

  const ctx = document.getElementById("graficoTareas");
  if (ctx) {
    new Chart(ctx, {
      type: "doughnut",
      data: {
        labels: ["Completadas", "En progreso", "Pendientes"],
        datasets: [{
          data: [completadas, enProgreso, pendientes],
          backgroundColor: ["#38b000", "#ffc400ff", "#fc2e2eff"],
          borderWidth: 1
        }]
      },
      options: {
        plugins: {
          legend: { position: "bottom" },
          title: { display: true, text: `Progreso: ${progreso}%` }
        }
      }
    });
  }

  function colorPrioridad(p) {
    if (p === "Alta") return "danger";
    if (p === "Media") return "warning";
    return "success";
  }
});
