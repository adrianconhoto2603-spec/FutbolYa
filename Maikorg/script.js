// script.js

// Obtener elementos
const form = document.getElementById('formPartido');
const listaPartidos = document.getElementById('listaPartidos');

// Cargar partidos guardados al iniciar
document.addEventListener('DOMContentLoaded', mostrarPartidos);

// Manejar envío del formulario
form.addEventListener('submit', (e) => {
  e.preventDefault();

  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const lugar = document.getElementById('lugar').value;
  const jugadores = document.getElementById('jugadores').value;

  if (!fecha || !hora || !lugar) return;

  const nuevoPartido = {
    fecha,
    hora,
    lugar,
    jugadores,
    inscritos: 0
  };

  guardarPartido(nuevoPartido);
  mostrarPartidos();
  form.reset();
});

// Guardar partido en localStorage
function guardarPartido(partido) {
  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  partidos.push(partido);
  localStorage.setItem('partidos', JSON.stringify(partidos));
}

// Mostrar partidos en pantalla
function mostrarPartidos() {
  listaPartidos.innerHTML = '';
  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];

  if (partidos.length === 0) {
    listaPartidos.innerHTML = '<p>No hay partidos organizados aún.</p>';
    return;
  }

  partidos.forEach((p, index) => {
    const card = document.createElement('div');
    card.classList.add('match-card');
    card.innerHTML = `
      <h3>${p.fecha} - ${p.hora}</h3>
      <p>${p.lugar}</p>
      <p><strong>${p.inscritos} / ${p.jugadores} jugadores</strong></p>
      <button class="join" onclick="unirme(${index})">¡Unirme!</button>
    `;
    listaPartidos.appendChild(card);
  });
}

// Función para inscribirse a un partido
function unirme(index) {
  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  if (partidos[index].inscritos < partidos[index].jugadores) {
    partidos[index].inscritos++;
    localStorage.setItem('partidos', JSON.stringify(partidos));
    mostrarPartidos();
  } else {
    alert('Este partido ya está completo.');
  }
}