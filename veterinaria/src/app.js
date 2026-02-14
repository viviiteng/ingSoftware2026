
//ADMIN LISTADO DE TURNOS
(function verificarAcceso() {
    const usuarioLogueado = localStorage.getItem("isAuthenticated");

    if (!usuarioLogueado || usuarioLogueado !== "true") {
        window.location.href = "../html/index.html";
        return;
    }

    document.body.classList.add("loaded");
})();

// DATOS
let turnos = JSON.parse(localStorage.getItem("reservas")) || [];

const tbody = document.getElementById("tablaTurnos");
const contador = document.getElementById("contador");
const btnFiltrar = document.querySelector(".btn-primary");
const fechaInput = document.getElementById("fechaFiltro");
const fechaTexto = document.getElementById("fechaActualTexto");

function renderTabla(lista, esModoFuturo = false) {
    tbody.innerHTML = "";

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" style="text-align:center; padding:20px;">
                    ${esModoFuturo
                        ? "No hay turnos futuros"
                        : "No hay turnos para la fecha seleccionada"}
                </td>
            </tr>
        `;
        contador.textContent = "Mostrando 0 turnos";
        return;
    }

    lista.forEach(t => {
        const fecha = new Date(t.diaHora);

        tbody.innerHTML += `
            <tr>
                <td>${t.nombre}</td>
                <td>${t.telefono}</td>
                <td>${t.email}</td>
                <td>${t.mascota} (${t.tipoMascota})</td>
                <td>${fecha.toLocaleString("es-ES")}</td>
                <td>${t.servicioTexto}</td>
                <td>${t.profesional}</td>
            </tr>
        `;
    });

    contador.textContent = `Mostrando ${lista.length} turnos`;
}

const hoy = new Date().toISOString().split("T")[0];

fechaInput.value = hoy;
fechaTexto.textContent = `${formatearFecha(hoy)} y posteriores`;

renderTabla(obtenerTurnosFuturos(turnos, hoy), true);

//Eventos
btnFiltrar.addEventListener("click", () => {
    const fecha = fechaInput.value;
    fechaTexto.textContent = formatearFecha(fecha);
    renderTabla(filtrarPorFecha(turnos, fecha));
});

// CERRAR SESIÓN
const btnCerrarSesion = document.getElementById("btnCerrarSesion");

btnCerrarSesion?.addEventListener("click", () => {
    localStorage.removeItem("isAuthenticated");
    window.location.href = "../index.html";
});

//LOGIN
const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const errorMsg2 = document.getElementById("errorMsg2");

form.addEventListener("submit", function (e) {
    e.preventDefault();

    const userInput = document.getElementById("usuario").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    const resultado = validarLogin(userInput, passwordInput);

    if (resultado.success) {
        errorMsg.style.display = "none";
        errorMsg2.style.display = "none";

        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("nombre", resultado.user.nombre);
        localStorage.setItem("rol", resultado.user.rol);

        window.location.href = "../html/admin.html";
        return;
    }

    if (resultado.error === "EMPTY_FIELDS") {
        errorMsg2.style.display = "flex";
        errorMsg.style.display = "none";
        return;
    }

    if (resultado.error === "INVALID_CREDENTIALS") {
        errorMsg.style.display = "flex";
        errorMsg2.style.display = "none";
    }
});


document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formReserva");
    const mensaje = document.getElementById("mensaje");
    const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");
    const fechaInput = document.getElementById("diaHora");
    const tipoServicioSelect = document.getElementById("tipoServicio");
    const contenedorProfesional = document.getElementById("contenedorProfesional");
    const profesionalSelect = document.getElementById("profesional");
    const contenedorFormulario = document.getElementById("contenedorFormulario");
    const contenedorConfirmacion = document.getElementById("contenedorConfirmacion");
    const btnOtroTurno = document.getElementById("btnOtroTurno");


    /* EVENTO CAMBIO SERVICIO */
    tipoServicioSelect.addEventListener("change", () => {
        const servicio = tipoServicioSelect.value;

        profesionalSelect.innerHTML = "";
        contenedorProfesional.style.display = "none";

        if (!servicio) return;

        contenedorProfesional.style.display = "block";

        const opcionDefault = document.createElement("option");
        opcionDefault.value = "Primer profesional disponible";
        opcionDefault.textContent = "Primer profesional disponible";
        profesionalSelect.appendChild(opcionDefault);

        PROFESIONALES[servicio].forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            profesionalSelect.appendChild(option);
        });
    });


    /* CONFIGURACIÓN FECHAS */
    const hoy = new Date();

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    manana.setHours(0, 0, 0, 0);

    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() + 15);
    limite.setHours(23, 59, 59, 999);

    fechaInput.min = toInputDate(manana);
    fechaInput.max = toInputDate(limite);


    /* SUBMIT */
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        mensaje.innerHTML = "";

        const datos = obtenerDatos();
        const errores = validarDatos(datos);

        if (errores.length) {
            mostrarErrores(errores);
            return;
        }

        const reservas = obtenerReservas();

        if (datos.profesional !== "Primer profesional disponible") {
            if (!profesionalDisponible(reservas, datos.profesional, datos.servicio, datos.diaHora)) {
                mostrarErrores(["Ese profesional ya tiene un turno en ese horario"]);
                return;
            }
        } else {
            if (!hayDisponibilidad(reservas, datos.servicio, datos.diaHora)) {
                mostrarErrores(["No hay profesionales disponibles para ese horario"]);
                return;
            }
        }

        if (datos.profesional === "Primer profesional disponible") {
            datos.profesional = asignarProfesional(reservas, datos.servicio, datos.diaHora);
        }

        guardarReserva(datos);
        mostrarConfirmacion(datos);

        contenedorFormulario.style.display = "none";
        contenedorConfirmacion.style.display = "block";

        form.reset();
    });


    btnOtroTurno.addEventListener("click", () => {
        mensaje.innerHTML = "";
        contenedorConfirmacion.style.display = "none";
        contenedorProfesional.style.display = "none";
        contenedorFormulario.style.display = "block";
    });


    /* ================= FUNCIONES UI ================= */

    function obtenerDatos() {
        return {
            nombre: form.nombre.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim(),
            mascota: form.nMascota.value.trim(),
            tipoMascota: form.tipoMascota.value,
            servicio: mapearServicio(form.tipoServicio.value),
            servicioTexto: form.tipoServicio.options[form.tipoServicio.selectedIndex].text,
            profesional: form.profesional.value || "Primer profesional disponible",
            diaHora: form.diaHora.value
        };
    }

    function obtenerReservas() {
        return JSON.parse(localStorage.getItem("reservas")) || [];
    }

    function guardarReserva(datos) {
        const reservas = obtenerReservas();
        reservas.push(datos);
        localStorage.setItem("reservas", JSON.stringify(reservas));
    }

    function mostrarErrores(errores) {
        errores.forEach(err => {
            const p = document.createElement("p");
            p.style.color = "red";
            p.textContent = err;
            mensaje.appendChild(p);
        });
    }

    function mostrarConfirmacion(d) {
        mensajeConfirmacion.innerHTML = `
            <h3>Reserva confirmada ✅</h3>
            <p><strong>Cliente:</strong> ${d.nombre}</p>
            <p><strong>Mascota:</strong> ${d.mascota} (${d.tipoMascota})</p>
            <p><strong>Servicio:</strong> ${d.servicioTexto}</p>
            <p><strong>Profesional:</strong> ${d.profesional}</p>
            <p><strong>Fecha y hora:</strong> ${new Date(d.diaHora).toLocaleString()}</p>
        `;
    }

    function toInputDate(date) {
        return date.toISOString().slice(0, 16);
    }

});

//RESERVAS

document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formReserva");
    const mensaje = document.getElementById("mensaje");
    const mensajeConfirmacion = document.getElementById("mensajeConfirmacion");
    const fechaInput = document.getElementById("diaHora");
    const tipoServicioSelect = document.getElementById("tipoServicio");
    const contenedorProfesional = document.getElementById("contenedorProfesional");
    const profesionalSelect = document.getElementById("profesional");
    const contenedorFormulario = document.getElementById("contenedorFormulario");
    const contenedorConfirmacion = document.getElementById("contenedorConfirmacion");
    const btnOtroTurno = document.getElementById("btnOtroTurno");


    /* EVENTO CAMBIO SERVICIO */
    tipoServicioSelect.addEventListener("change", () => {
        const servicio = tipoServicioSelect.value;

        profesionalSelect.innerHTML = "";
        contenedorProfesional.style.display = "none";

        if (!servicio) return;

        contenedorProfesional.style.display = "block";

        const opcionDefault = document.createElement("option");
        opcionDefault.value = "Primer profesional disponible";
        opcionDefault.textContent = "Primer profesional disponible";
        profesionalSelect.appendChild(opcionDefault);

        PROFESIONALES[servicio].forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            profesionalSelect.appendChild(option);
        });
    });


    /* CONFIGURACIÓN FECHAS */
    const hoy = new Date();

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    manana.setHours(0, 0, 0, 0);

    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() + 15);
    limite.setHours(23, 59, 59, 999);

    fechaInput.min = toInputDate(manana);
    fechaInput.max = toInputDate(limite);


    /* SUBMIT */
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        mensaje.innerHTML = "";

        const datos = obtenerDatos();
        const errores = validarDatos(datos);

        if (errores.length) {
            mostrarErrores(errores);
            return;
        }

        const reservas = obtenerReservas();

        if (datos.profesional !== "Primer profesional disponible") {
            if (!profesionalDisponible(reservas, datos.profesional, datos.servicio, datos.diaHora)) {
                mostrarErrores(["Ese profesional ya tiene un turno en ese horario"]);
                return;
            }
        } else {
            if (!hayDisponibilidad(reservas, datos.servicio, datos.diaHora)) {
                mostrarErrores(["No hay profesionales disponibles para ese horario"]);
                return;
            }
        }

        if (datos.profesional === "Primer profesional disponible") {
            datos.profesional = asignarProfesional(reservas, datos.servicio, datos.diaHora);
        }

        guardarReserva(datos);
        mostrarConfirmacion(datos);

        contenedorFormulario.style.display = "none";
        contenedorConfirmacion.style.display = "block";

        form.reset();
    });


    btnOtroTurno.addEventListener("click", () => {
        mensaje.innerHTML = "";
        contenedorConfirmacion.style.display = "none";
        contenedorProfesional.style.display = "none";
        contenedorFormulario.style.display = "block";
    });


    /* ================= FUNCIONES UI ================= */

    function obtenerDatos() {
        return {
            nombre: form.nombre.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim(),
            mascota: form.nMascota.value.trim(),
            tipoMascota: form.tipoMascota.value,
            servicio: mapearServicio(form.tipoServicio.value),
            servicioTexto: form.tipoServicio.options[form.tipoServicio.selectedIndex].text,
            profesional: form.profesional.value || "Primer profesional disponible",
            diaHora: form.diaHora.value
        };
    }

    function obtenerReservas() {
        return JSON.parse(localStorage.getItem("reservas")) || [];
    }

    function guardarReserva(datos) {
        const reservas = obtenerReservas();
        reservas.push(datos);
        localStorage.setItem("reservas", JSON.stringify(reservas));
    }

    function mostrarErrores(errores) {
        errores.forEach(err => {
            const p = document.createElement("p");
            p.style.color = "red";
            p.textContent = err;
            mensaje.appendChild(p);
        });
    }

    function mostrarConfirmacion(d) {
        mensajeConfirmacion.innerHTML = `
            <h3>Reserva confirmada ✅</h3>
            <p><strong>Cliente:</strong> ${d.nombre}</p>
            <p><strong>Mascota:</strong> ${d.mascota} (${d.tipoMascota})</p>
            <p><strong>Servicio:</strong> ${d.servicioTexto}</p>
            <p><strong>Profesional:</strong> ${d.profesional}</p>
            <p><strong>Fecha y hora:</strong> ${new Date(d.diaHora).toLocaleString()}</p>
        `;
    }

    function toInputDate(date) {
        return date.toISOString().slice(0, 16);
    }

});