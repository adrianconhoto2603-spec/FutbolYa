// Registro
document.getElementById('formRegistro').addEventListener('submit', (e) => {
  e.preventDefault();
  const nombre = document.getElementById('nombre').value;
  const email = document.getElementById('email').value;
  const celular = document.getElementById('celular').value;
  const password = document.getElementById('passwordReg').value;

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  if (usuarios.find(u => u.email === email)) {
    alert('Este email ya está registrado.');
    return;
  }

  usuarios.push({ nombre, email, celular, password });
  localStorage.setItem('usuarios', JSON.stringify(usuarios));
  alert('Registro exitoso. Ahora podés iniciar sesión.');
  e.target.reset();
});

// Login
document.getElementById('formLogin').addEventListener('submit', (e) => {
  e.preventDefault();
  const email = document.getElementById('emailLogin').value;
  const password = document.getElementById('passwordLogin').value;

  let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const usuario = usuarios.find(u => u.email === email && u.password === password);

  if (!usuario) {
    alert('Email o contraseña incorrectos.');
    return;
  }

  localStorage.setItem('usuarioActivo', JSON.stringify(usuario));
  alert(`Bienvenido, ${usuario.nombre}`);
  e.target.reset();
});

// Crear partido
document.getElementById('formPartido').addEventListener('submit', (e) => {
  e.preventDefault();
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuarioActivo) {
    alert('Debes iniciar sesión para crear un partido.');
    return;
  }

  const nombrePartido = document.getElementById('nombrePartido').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;
  const lugar = document.getElementById('lugar').value;
  const jugadores = document.getElementById('jugadores').value;

  const nuevoPartido = {
    nombrePartido,
    fecha,
    hora,
    lugar,
    jugadores,
    inscritos: [],
    creador: usuarioActivo.nombre
  };

  let partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  partidos.push(nuevoPartido);
  localStorage.setItem('partidos', JSON.stringify(partidos));
  mostrarPartidos();
  e.target.reset();
});

// Mostrar partidos
function mostrarPartidos() {
  const listaPartidos = document.getElementById('listaPartidos');
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
      <h3>${p.nombrePartido}</h3>
      <p>${p.fecha} - ${p.hora}</p>
      <p>${p.lugar}</p>
      <p><strong>${p.inscritos.length} / ${p.jugadores} jugadores</strong></p>
      <p>Inscritos: ${p.inscritos.join(', ') || 'Nadie aún'}</p>
    `;

    if (p.inscritos.length >= p.jugadores) {
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
  const usuarioActivo = JSON.parse(localStorage.getItem('usuarioActivo'));
  if (!usuarioActivo) {
    alert('Debes iniciar sesión para unirte a un partido.');
    return;
  }

  let partidos = JSON.parse(localStorage.getItem('partidos')) || [];
  const partido = partidos[index];

  if (partido.inscritos.length < partido.jugadores) {
    if (!partido.inscritos.includes(usuarioActivo.nombre)) {
      partido.inscritos.push(usuarioActivo.nombre);
      localStorage.setItem('partidos', JSON.stringify(partidos));
      mostrarPartidos();
    } else {
      alert('Ya estás inscrito en este partido.');
    }
  } else {
    alert('Este partido ya está completo.');
  }
}
