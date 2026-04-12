// URL de tu recurso en MockAPI
const API_URL = "https://69dad9b4560857310a072633.mockapi.io/partidos";

document.addEventListener("DOMContentLoaded", () => {
  const formPartido = document.getElementById("formPartido");
  const listaPartidos = document.getElementById("listaPartidos");

  // 🔹 Cargar partidos al iniciar
  cargarPartidos();

  // 🔹 Publicar partido nuevo
  formPartido.addEventListener("submit", (e) => {
    e.preventDefault();

    const nuevoPartido = {
      nombre: document.getElementById("nombrePartido").value,
      fecha: document.getElementById("fecha").value,
      hora: document.getElementById("hora").value,
      lugar: document.getElementById("lugar").value,
      jugadores: document.getElementById("jugadores").value,
      inscriptos: [] // lista vacía al inicio
    };

    fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nuevoPartido)
    })
    .then(() => cargarPartidos()) // recargar lista
    .catch(err => console.error("Error al publicar partido:", err));

    formPartido.reset();
  });

  // 🔹 Función para cargar partidos
  function cargarPartidos() {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => renderPartidos(data))
      .catch(err => console.error("Error al cargar partidos:", err));
  }

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
        <button class="inscribirse" data-id="${p.id}">Inscribirse</button>
      `;
      listaPartidos.appendChild(card);
    });

    // 🔹 Botones de inscripción
    document.querySelectorAll(".inscribirse").forEach(btn => {
      btn.addEventListener("click", (e) => {
        const usuarioActivo = JSON.parse(localStorage.getItem("usuarioActivo"));
        if (!usuarioActivo) {
          alert("Debes iniciar sesión para inscribirte.");
          window.location.href = "login.html";
          return;
        }

        const partidoId = e.target.dataset.id;

        // Buscar partido en la API y actualizar inscriptos
        fetch(`${API_URL}/${partidoId}`)
          .then(res => res.json())
          .then(partido => {
            if (!partido.inscriptos) partido.inscriptos = [];
            if (partido.inscriptos.includes(usuarioActivo.email)) {
              alert("Ya estás inscripto en este partido.");
              return;
            }

            partido.inscriptos.push(usuarioActivo.email);

            return fetch(`${API_URL}/${partidoId}`, {
              method: "PUT",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(partido)
            });
          })
          .then(() => cargarPartidos())
          .catch(err => console.error("Error al inscribirse:", err));
      });
    });
  }
});
