const turnos = [
    {
        nombre: "Ana Pérez",
        telefono: "345-678-9012",
        email: "ana.perez@gmail.com",
        mascota: "Perro",
        fecha: "2026-02-25",
        hora: "09:00",
        servicio: "Consulta Veterinaria",
        profesional: "Dr. Juan Martínez"
    },
    {
        nombre: "Carlos Gómez",
        telefono: "456-789-0123",
        email: "carlos.gomez@gmail.com",
        mascota: "Gato",
        fecha: "2026-02-25",
        hora: "10:30",
        servicio: "Peluquería",
        profesional: "Laura Sánchez"
    },
    {
        nombre: "Marta López",
        telefono: "567-890-1234",
        email: "marta@mail.com",
        mascota: "Conejo",
        fecha: "2026-02-26",
        hora: "11:00",
        servicio: "Vacunación",
        profesional: "Dr. Juan Martínez"
    }
];

const tbody = document.getElementById("tablaTurnos");
const contador = document.getElementById("contador");
const btnFiltrar = document.querySelector(".btn-primary");

const fechaInput = document.getElementById("fechaFiltro");
const fechaTexto = document.getElementById("fechaActualTexto");

// ===============================
// UTILIDADES
// ===============================
function formatearFecha(fechaISO) {
    const [y, m, d] = fechaISO.split("-");
    return `${d}/${m}/${y}`;
}

function filtrarPorFecha(fecha) {
    return turnos.filter(t => t.fecha === fecha);
}

// ===============================
// RENDER
// ===============================
function renderTabla(lista) {
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    No hay turnos para la fecha seleccionada
                </td>
            </tr>
        `;
        contador.textContent = "Mostrando 0 turnos";
        return;
    }

    lista.forEach(t => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.nombre}</td>
            <td>${t.telefono}</td>
            <td>${t.email}</td>
            <td>${t.mascota}</td>
            <td>${formatearFecha(t.fecha)} ${t.hora}</td>
            <td>${t.servicio}</td>
            <td>${t.profesional}</td>
        `;
        tbody.appendChild(tr);
    });

    contador.textContent = `Mostrando ${lista.length} turnos`;
}

// ===============================
// INICIALIZACIÓN
// ===============================
const hoy = new Date().toISOString().split("T")[0];

// Setear fecha actual
fechaInput.value = hoy;
fechaTexto.textContent = formatearFecha(hoy);

// Render inicial FILTRADO
renderTabla(filtrarPorFecha(hoy));

// ===============================
// EVENTOS
// ===============================
btnFiltrar.addEventListener("click", () => {
    const fechaSeleccionada = fechaInput.value;

    fechaTexto.textContent = formatearFecha(fechaSeleccionada);
    renderTabla(filtrarPorFecha(fechaSeleccionada));
});
