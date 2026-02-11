// ===============================
// PROTECCIÓN DE ACCESO
// ===============================
(function verificarAcceso() {
    const usuarioLogueado = localStorage.getItem("isAuthenticated");
    
    // Si no está logueado, redirigir al login
    if (!usuarioLogueado || usuarioLogueado !== "true") {
        window.location.href = "../html/index.html";
        return;
    }
    
    // Si está logueado, mostrar el contenido
    document.body.classList.add("loaded");
})();

// ===============================
// CÓDIGO EXISTENTE
// ===============================
let turnos = JSON.parse(localStorage.getItem("reservas")) || [];

const tbody = document.getElementById("tablaTurnos");
const contador = document.getElementById("contador");
const btnFiltrar = document.querySelector(".btn-primary");

const fechaInput = document.getElementById("fechaFiltro");
const fechaTexto = document.getElementById("fechaActualTexto");

// ===============================
// UTILIDADES
// ===============================
function formatearFecha(fechaISO) {
    const [year, month, day] = fechaISO.split("-");
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString("es-ES");
}

function obtenerFechaISO(diaHora) {
    return diaHora.split("T")[0];
}

function ordenarTurnos(listaTurnos) {
    return listaTurnos.sort((a, b) => {
        // 1. Primero ordenar por fecha y hora
        const fechaA = new Date(a.diaHora);
        const fechaB = new Date(b.diaHora);
        
        if (fechaA.getTime() !== fechaB.getTime()) {
            return fechaA - fechaB;
        }
        
        // 2. Si la fecha y hora son iguales, ordenar por profesional
        return a.profesional.localeCompare(b.profesional);
    });
}

function filtrarPorFecha(fecha) {
    const turnosFiltrados = turnos.filter(t => obtenerFechaISO(t.diaHora) === fecha);
    return ordenarTurnos(turnosFiltrados);
}

function obtenerTurnosFuturos(fechaReferencia) {
    const hoy = new Date(fechaReferencia);
    hoy.setHours(0, 0, 0, 0);
    
    const turnosFuturos = turnos.filter(t => {
        const fechaTurno = new Date(t.diaHora);
        return fechaTurno >= hoy;
    });
    
    return ordenarTurnos(turnosFuturos);
}

// ===============================
// RENDER
// ===============================
function renderTabla(lista, esModoFuturo = false) {
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    ${esModoFuturo ? 'No hay turnos futuros' : 'No hay turnos para la fecha seleccionada'}
                </td>
            </tr>
        `;
        contador.textContent = "Mostrando 0 turnos";
        return;
    }

    lista.forEach(t => {
        const fecha = new Date(t.diaHora);

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${t.nombre}</td>
            <td>${t.telefono}</td>
            <td>${t.email}</td>
            <td>${t.mascota} (${t.tipoMascota})</td>
            <td>${fecha.toLocaleString("es-ES")}</td>
            <td>${t.servicioTexto}</td>
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

fechaInput.value = hoy;
fechaTexto.textContent = `${formatearFecha(hoy)} y posteriores`;

renderTabla(obtenerTurnosFuturos(hoy), true);

btnFiltrar.addEventListener("click", () => {
    const fechaSeleccionada = fechaInput.value;
    fechaTexto.textContent = formatearFecha(fechaSeleccionada);
    renderTabla(filtrarPorFecha(fechaSeleccionada), false);
});

// ===============================
// CERRAR SESIÓN
// ===============================
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener("click", () => {
        localStorage.removeItem("usuarioLogueado");
        window.location.href = "../index.html";
    });
}