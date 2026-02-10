document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("formReserva");
    const mensaje = document.getElementById("mensaje");
    const fechaInput = document.getElementById("diaHora");
    const tipoServicioSelect = document.getElementById("tipoServicio");
    const contenedorProfesional = document.getElementById("contenedorProfesional");
    const profesionalSelect = document.getElementById("profesional");
    const contenedorFormulario = document.getElementById("contenedorFormulario");
    const contenedorConfirmacion = document.getElementById("contenedorConfirmacion");
    const btnOtroTurno = document.getElementById("btnOtroTurno");


    /* PROFESIONALES*/
    const PROFESIONALES = {
        veterinaria: [
            "Valentina Rodríguez",
            "Mateo González",
            "Camila Fernández"
        ],
        estilismo: [
            "Thiago Pereira",
            "Sofía López",
            "Benjamín Silva",
            "Lucía Martínez"
        ]
    };

    /*EVENTO CAMBIO SERVICIO*/
    tipoServicioSelect.addEventListener("change", () => {
        const servicio = tipoServicioSelect.value;

        // Reset
        profesionalSelect.innerHTML = "";
        contenedorProfesional.style.display = "none";

        if (!servicio) return;

        // Mostrar select profesional
        contenedorProfesional.style.display = "block";

        // Opción por defecto
        const opcionDefault = document.createElement("option");
        opcionDefault.value = "Primer profesional disponible";
        opcionDefault.textContent = "Primer profesional disponible";
        profesionalSelect.appendChild(opcionDefault);

        // Cargar profesionales coherentes  
        PROFESIONALES[servicio].forEach(nombre => {
            const option = document.createElement("option");
            option.value = nombre;
            option.textContent = nombre;
            profesionalSelect.appendChild(option);
        });
    });

    /* CONFIGURACIÓN FECHAS*/
    const hoy = new Date();

    const manana = new Date(hoy);
    manana.setDate(hoy.getDate() + 1);
    manana.setHours(0, 0, 0, 0); // 👈 CLAVE

    const limite = new Date(hoy);
    limite.setDate(hoy.getDate() + 15);
    limite.setHours(23, 59, 59, 999);

    fechaInput.min = toInputDate(manana);
    fechaInput.max = toInputDate(limite);



    /* SUBMIT*/
    form.addEventListener("submit", (e) => {
        e.preventDefault();
        mensaje.innerHTML = "";

        const datos = obtenerDatos();
        const errores = validarDatos(datos);

        if (errores.length) {
            mostrarErrores(errores);
            return;
        }

        if (!hayDisponibilidad(datos.servicio, datos.diaHora)) {
            mostrarErrores(["No hay profesionales disponibles para ese horario"]);
            return;
        }

        if (datos.profesional === "Primer profesional disponible") {
            datos.profesional = asignarProfesional(datos.servicio, datos.diaHora);
        }

        guardarReserva(datos);
        mostrarConfirmacion(datos);
        guardarReserva(datos);
        mostrarConfirmacion(datos);

        // ocultar form, mostrar confirmación
        contenedorFormulario.style.display = "none";
        contenedorConfirmacion.style.display = "block";

        form.reset();

    });

    btnOtroTurno.addEventListener("click", () => {
    mensaje.innerHTML = "";

    contenedorConfirmacion.style.display = "none";
    contenedorFormulario.style.display = "block";
});


    /* FUNCIONES*/

    function obtenerDatos() {
        return {
            nombre: form.nombre.value.trim(),
            telefono: form.telefono.value.trim(),
            email: form.email.value.trim(),
            mascota: form.nMascota.value.trim(),
            tipoMascota: form.tipoMascota.value,
            servicio: mapearServicio(form.tipoServicio.value),
            profesional: form.profesional.value || "Primer profesional disponible",
            diaHora: form.diaHora.value
        };
    }

    function validarDatos(d) {
        const errores = [];

        Object.values(d).forEach(v => {
            if (!v) errores.push("Todos los campos son obligatorios");
        });

        if (!/^\d+$/.test(d.telefono)) {
            errores.push("El teléfono debe contener solo números");
        }

        if (!/^\S+@\S+\.\S+$/.test(d.email)) {
            errores.push("El email no tiene un formato válido");
        }

        const fecha = new Date(d.diaHora);
        const hora = fecha.getHours();
        const dia = fecha.getDay();

        if (hora < 9 || hora >= 18) {
            errores.push("El horario debe estar entre las 9 y las 18 hs");
        }

        if (dia === 0) {
            errores.push("No se atiende los domingos");
        }

        return [...new Set(errores)];
    }

    function hayDisponibilidad(servicio, fechaHora) {
        const reservas = obtenerReservas();

        const reservasHorario = reservas.filter(r =>
            r.servicio === servicio &&
            r.diaHora === fechaHora
        );

        return reservasHorario.length < PROFESIONALES[servicio].length;
    }

    function asignarProfesional(servicio, fechaHora) {
        const reservas = obtenerReservas()
            .filter(r => r.servicio === servicio && r.diaHora === fechaHora)
            .map(r => r.profesional);

        return PROFESIONALES[servicio].find(p => !reservas.includes(p));
    }

    function guardarReserva(datos) {
        const reservas = obtenerReservas();
        reservas.push(datos);
        localStorage.setItem("reservas", JSON.stringify(reservas));
    }

    function obtenerReservas() {
        return JSON.parse(localStorage.getItem("reservas")) || [];
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
        mensaje.innerHTML = `
      <h3>Reserva confirmada ✅</h3>
      <p><strong>Cliente:</strong> ${d.nombre}</p>
      <p><strong>Mascota:</strong> ${d.mascota} (${d.tipoMascota})</p>
      <p><strong>Servicio:</strong> ${form.tipoServicio.options[form.tipoServicio.selectedIndex].text}</p>
      <p><strong>Profesional:</strong> ${d.profesional}</p>
      <p><strong>Fecha y hora:</strong> ${new Date(d.diaHora).toLocaleString()}</p>
    `;
    }


    function toInputDate(date) {
        return date.toISOString().slice(0, 16);
    }

    function mapearServicio(valor) {
        if (valor.toLowerCase().includes("veterinaria")) return "veterinaria";
        return "estilismo";
    }

});
