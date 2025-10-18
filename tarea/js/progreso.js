document.addEventListener("DOMContentLoaded", () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const avatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");
  avatar.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAADmr0l2AAAAMFBMVEX///8AAADm5ubR0dG6urrx8fHf39/V1dWnp6eTk5PGxsbv7+/Z2dnNzc2hoaHHx8f8/f21hj9WAAABpklEQVR4nO3aUW6DMAwF0Awx/z9uZPZ1qYbBgpE3Z58xJ7omB6BtVh7AAAAAAAAAAAAALDPHj7Drg9Vu+EdaH0aa+9bHn6bfAdbwUO4eZn4C6Pw4znZpvVJ6Xzk76Ac2aHYjzlmV0+c+JbEo3xyx3E9b/MixplkcpPzv3X9Ib4bO28U/n9x3GiyKMzZPH40U/qbLhb7e/kP38wI5bZcnxEukpQJq6Ux8zKpV6MbDkK8VFYZr+Fz/bZtHt/Um7c0l8Jx2td/ZZD9i+rVf6kvr/Zx3dRmvT1InXNe8v4lwcAAAAAAADQnhd3jslBPHL9t0QAAAAASUVORK5CYII=";
  userName.textContent = usuarioActivo;

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  const tareas = JSON.parse(localStorage.getItem(`tareas_${usuarioActivo}`)) || [];
  const total = tareas.length;
  const pendientes = tareas.filter(t => t.estado === "Pendiente").length;
  const enProgreso = tareas.filter(t => t.estado === "En progreso").length;
  const completadas = tareas.filter(t => t.estado === "Completada").length;

  document.getElementById("countPendientes").textContent = pendientes;
  document.getElementById("countProgreso").textContent = enProgreso;
  document.getElementById("countCompletadas").textContent = completadas;

  const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
  const barra = document.getElementById("progressBar");
  barra.style.width = `${porcentaje}%`;
  barra.textContent = `${porcentaje}%`;

  const lista = document.getElementById("listaProgreso");
  lista.innerHTML = tareas.map(t => `
    <tr>
      <td>${t.titulo}</td>
      <td><span class="badge bg-${colorEstado(t.estado)}">${t.estado}</span></td>
      <td><span class="badge bg-${colorPrioridad(t.prioridad)}">${t.prioridad}</span></td>
    </tr>
  `).join('');
});

function colorPrioridad(p) {
  if (p === "Alta") return "danger";
  if (p === "Media") return "warning";
  return "success";
}

function colorEstado(e) {
  if (e === "Pendiente") return "secondary";
  if (e === "En progreso") return "warning";
  return "success";
}
