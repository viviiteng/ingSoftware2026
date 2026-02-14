function formatearFecha(fechaISO) {
    const [year, month, day] = fechaISO.split("-");
    const fecha = new Date(year, month - 1, day);
    return fecha.toLocaleDateString("es-ES");
}

function obtenerFechaISO(diaHora) {
    return diaHora.split("T")[0];
}

function ordenarTurnos(listaTurnos) {
    return [...listaTurnos].sort((a, b) => {
        const fechaA = new Date(a.diaHora);
        const fechaB = new Date(b.diaHora);

        if (fechaA.getTime() !== fechaB.getTime()) {
            return fechaA - fechaB;
        }

        return a.profesional.localeCompare(b.profesional);
    });
}

function filtrarPorFecha(turnos, fecha) {
    return ordenarTurnos(
        turnos.filter(t => obtenerFechaISO(t.diaHora) === fecha)
    );
}

function obtenerTurnosFuturos(turnos, fechaReferencia) {
    const hoy = new Date(fechaReferencia);
    hoy.setHours(0, 0, 0, 0);

    return ordenarTurnos(
        turnos.filter(t => new Date(t.diaHora) >= hoy)
    );
}

function suma() {
    return 2 + 2;
}

if (typeof module !== "undefined") {
module.exports = {
    formatearFecha,
    obtenerFechaISO,
    ordenarTurnos,
    filtrarPorFecha,
    obtenerTurnosFuturos,
    suma
};}
