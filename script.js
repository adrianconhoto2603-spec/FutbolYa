// URL de tu recurso en MockAPI
const API_URL = "https://69dad9b4560857310a072633.mockapi.io/partidos";

document.addEventListener("DOMContentLoaded", () => {
  const formPartido = document.getElementById("formPartido");
  const listaPartidos = document.getElementById("listaPartidos");

  // 🔹 Cargar partidos desde la API al iniciar
  fetch(API_URL)
    .then(res => res.json())
    .then(data => renderPartidos(data))
    .catch(err => console.error("Error al cargar partidos:", err));

  // 🔹 Publicar partido nuevo
  formPartido.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoPartido = {
      nombre: document.getElementById("nombrePartido").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      lugar: document.getElementById("lugar").value,
      jugadores: document.getElementById("jugadores").value
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPartido)
    })
    .then(() => fetch(API_URL)) // recargar lista
    .then(res => res.json())
    .then(data => renderPartidos(data))
    .catch(err => console.error("Error al publicar partido:", err));

    formPartido.reset();
  });

  // 🔹 Renderizar partidos en pantalla
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
      `;
      listaPartidos.appendChild(card);
    });
  }
});
