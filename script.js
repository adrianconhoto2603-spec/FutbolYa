// script.js

const formUsuario = document.getElementById('formUsuario');
const formPartido = document.getElementById('formPartido');
const listaPartidos = document.getElementById('listaPartidos');

// Cargar partidos al iniciar
document.addEventListener('DOMContentLoaded', mostrarPartidos);

// Manejar login/registro
formUsuario.addEventListener('submit', (e) => {
  e.preventDefault();
  const usuario = document.getElementById('usuario').value;
  const password = document.getElementById('password').value;

  if (!usuario || !password) return;

  // Guardar usuario activo en localStorage
  localStorage.setItem('usuarioActivo', usuario);
  alert(`Bienvenido, ${usuario}`);
  formUsuario.reset();
});

// Manejar creación de partido
formPartido.addEventListener('submit', (e) => {
  e.preventDefault();

  const usuarioActivo = localStorage.getItem('usuarioActivo');
  if (!usuarioActivo) {
    alert('Debes iniciar sesión para crear un partido.');
    return;
  }

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
    inscritos: 0,
    creador: usuarioActivo
  };

  guardarPartido(nuevoPartido);
  mostrarPartidos();
  formPartido.reset();
});

// Guardar partido
function guardarPartido(partido) {
  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  partidos.push(partido);
  localStorage.setItem('partidos', JSON.stringify(partidos));
}

// Mostrar partidos
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
    `;

    if (p.inscritos >= p.jugadores) {
      card.classList.add('full');
      card.innerHTML += `<button class="full-btn">Lleno</button>`;
    } else {
      card.innerHTML += `<button class="join" onclick="unirme(${index})">¡Unirme!</button>`;
    }

    listaPartidos.appendChild(card);
  });
}

// Unirse a partido
function unirme(index) {
  const usuarioActivo = localStorage.getItem('usuarioActivo');
  if (!usuarioActivo) {
    alert('Debes iniciar sesión para unirte a un partido.');
    return;
  }

  const partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  if (partidos[index].inscritos < partidos[index].jugadores) {
    partidos[index].inscritos++;
    localStorage.setItem('partidos', JSON.stringify(partidos));
    mostrarPartidos();
  } else {
    alert('Este partido ya está completo.');
  }
}
