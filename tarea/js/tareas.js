document.addEventListener('DOMContentLoaded', () => {
  const usuarioActivo = localStorage.getItem("usuarioActivo");
  if (!usuarioActivo) {
    window.location.href = "index.html";
    return;
  }

  const tareasKey = `tareas_${usuarioActivo}`;
  const notificacionesKey = `notificaciones_${usuarioActivo}`;

  const btnNuevaTarea = document.getElementById('btnNuevaTarea');
  const btnBorrarTodo = document.getElementById('btnBorrarTodo');
  const formTareaContainer = document.getElementById('formTareaContainer');
  const formTarea = document.getElementById('formTarea');
  const listaTareas = document.getElementById('listaTareas');
  const avatar = document.getElementById("userAvatar");
  const userName = document.getElementById("userName");

  // --- Perfil del usuario
  avatar.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAADmr0l2AAAAMFBMVEX///8AAADm5ubR0dG6urrx8fHf39/V1dWnp6eTk5PGxsbv7+/Z2dnNzc2hoaHHx8f8/f21hj9WAAABpklEQVR4nO3aUW6DMAwF0Awx/z9uZPZ1qYbBgpE3Z58xJ7omB6BtVh7AAAAAAAAAAAAALDPHj7Drg9Vu+EdaH0aa+9bHn6bfAdbwUO4eZn4C6Pw4znZpvVJ6Xzk76Ac2aHYjzlmV0+c+JbEo3xyx3E9b/MixplkcpPzv3X9Ib4bO28U/n9x3GiyKMzZPH40U/qbLhb7e/kP38wI5bZcnxEukpQJq6Ux8zKpV6MbDkK8VFYZr+Fz/bZtHt/Um7c0l8Jx2td/ZZD9i+rVf6kvr/Zx3dRmvT1InXNe8v4lwcAAAAAAADQnhd3jslBPHL9t0QAAAAASUVORK5CYII=";
  userName.textContent = usuarioActivo;

  document.getElementById("cerrarSesion").addEventListener("click", () => {
    localStorage.removeItem("usuarioActivo");
    window.location.href = "index.html";
  });

  let tareas = JSON.parse(localStorage.getItem(tareasKey)) || [];
  let tareaAEditarIndex = null;

  const registrarNotificacion = (mensaje) => {
    let notificaciones = JSON.parse(localStorage.getItem(notificacionesKey)) || [];
    notificaciones.push(`${new Date().toLocaleString()} - ${mensaje}`);
    localStorage.setItem(notificacionesKey, JSON.stringify(notificaciones));
  };

  const guardarTareas = () => {
    localStorage.setItem(tareasKey, JSON.stringify(tareas));
  };

  const actualizarListaTareas = () => {
    listaTareas.innerHTML = '';
    tareas.forEach((tarea, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
        <td>${tarea.titulo}</td>
        <td><span class="badge bg-${colorPrioridad(tarea.prioridad)}">${tarea.prioridad}</span></td>
        <td>${tarea.estado}</td>
        <td>${tarea.documento ? `<a href="${tarea.documento}" target="_blank">Ver archivo</a>` : 'Sin archivo'}</td>
        <td>
          <button class="btn btn-sm btn-warning editarTarea" data-index="${index}">Editar</button>
          <button class="btn btn-sm btn-danger borrarTarea" data-index="${index}">Borrar</button>
        </td>`;
      listaTareas.appendChild(row);
    });

    document.querySelectorAll('.editarTarea').forEach(boton => boton.addEventListener('click', editarTarea));
    document.querySelectorAll('.borrarTarea').forEach(boton => boton.addEventListener('click', borrarTarea));
  };

  const colorPrioridad = (p) => {
    if (p === "Alta") return "danger";
    if (p === "Media") return "warning";
    return "success";
  };

  const editarTarea = (e) => {
    const index = e.target.dataset.index;
    const tarea = tareas[index];
    formTareaContainer.style.display = 'block';
    document.getElementById('titulo').value = tarea.titulo;
    document.getElementById('prioridadTarea').value = tarea.prioridad;
    document.getElementById('descripcion').value = tarea.descripcion;
    document.getElementById('estado').value = tarea.estado;
    tareaAEditarIndex = index;
  };

  const borrarTarea = (e) => {
    const index = e.target.dataset.index;
    const eliminada = tareas[index];
    if (confirm(`¿Eliminar la tarea "${eliminada.titulo}"?`)) {
      tareas.splice(index, 1);
      guardarTareas();
      registrarNotificacion(`Se eliminó la tarea "${eliminada.titulo}"`);
      actualizarListaTareas();
    }
  };

  btnNuevaTarea.addEventListener('click', () => {
    formTareaContainer.style.display = formTareaContainer.style.display === 'none' ? 'block' : 'none';
    formTarea.reset();
    tareaAEditarIndex = null;
  });

  btnBorrarTodo.addEventListener('click', () => {
    if (confirm("¿Borrar todas las tareas?")) {
      tareas = [];
      guardarTareas();
      registrarNotificacion("Se eliminaron todas las tareas");
      actualizarListaTareas();
    }
  });

  formTarea.addEventListener('submit', (e) => {
    e.preventDefault();
    const titulo = document.getElementById('titulo').value.trim();
    const prioridad = document.getElementById('prioridadTarea').value;
    const descripcion = document.getElementById('descripcion').value.trim();
    const estado = document.getElementById('estado').value;
    const docInput = document.getElementById('documento');
    let documento = '';
    if (docInput.files.length > 0) {
      documento = URL.createObjectURL(docInput.files[0]);
    }

    const nuevaTarea = { titulo, prioridad, descripcion, documento, estado };

    if (tareaAEditarIndex !== null) {
      tareas[tareaAEditarIndex] = nuevaTarea;
      registrarNotificacion(`Se editó la tarea "${titulo}"`);
      tareaAEditarIndex = null;
    } else {
      tareas.push(nuevaTarea);
      registrarNotificacion(`Se creó la tarea "${titulo}"`);
    }

    guardarTareas();
    actualizarListaTareas();
    formTarea.reset();
    formTareaContainer.style.display = 'none';
  });

  actualizarListaTareas();
});
