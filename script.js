const API_URL = "https://69dad9b4560857310a072633.mockapi.io/partido";


document.addEventListener("DOMContentLoaded", () => {
  const formPartido = document.getElementById("formPartido");
  const listaPartidos = document.getElementById("listaPartidos");

  cargarPartidos();

  formPartido.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoPartido = {
      nombre: document.getElementById("nombrePartido").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      lugar: document.getElementById("lugar").value,
      jugadores: document.getElementById("jugadores").value,
      inscriptos: []
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPartido)
    })
    .then(() => cargarPartidos())
    .catch(err => console.error("Error al publicar partido:", err));

    formPartido.reset();
  });

  function cargarPartidos() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        console.log("Partidos cargados:", data);
        renderPartidos(data);
      })
      .catch(err => console.error("Error al cargar partidos:", err));
  }

  function renderPartidos(partidos) {
    listaPartidos.innerHTML = "";
    if (partidos.length === 0) {
      listaPartidos.innerHTML = "<p>No hay partidos publicados todavía.</p>";
      return;
    }

    partidos.forEach(p => {
      const card = document.createElement("div");
      card.className = "partido-card";
      card.innerHTML = `
        <h3>${p.nombre}</h3>
        <p><strong>Fecha:</strong> ${p.fecha}</p>
        <p><strong>Hora:</strong> ${p.hora}</p>
        <p><strong>Lugar:</strong> ${p.lugar}</p>
        <p><strong>Jugadores:</strong> ${p.jugadores}</p>
        <p><strong>Inscriptos:</strong> ${p.inscriptos ? p.inscriptos.length : 0}</p>
      `;
      listaPartidos.appendChild(card);
    });
  }
});


