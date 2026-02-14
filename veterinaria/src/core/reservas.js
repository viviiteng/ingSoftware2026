
export const PROFESIONALES = {
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

export function validarDatos(d) {
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

export function profesionalDisponible(reservas, profesional, servicio, fechaHora) {
    return !reservas.some(r =>
        r.profesional === profesional &&
        r.servicio === servicio &&
        r.diaHora === fechaHora
    );
}

export function hayDisponibilidad(reservas, servicio, fechaHora) {
    const reservasHorario = reservas.filter(r =>
        r.servicio === servicio &&
        r.diaHora === fechaHora
    );

    return reservasHorario.length < PROFESIONALES[servicio].length;
}

export function asignarProfesional(reservas, servicio, fechaHora) {
    const ocupados = reservas
        .filter(r => r.servicio === servicio && r.diaHora === fechaHora)
        .map(r => r.profesional);

    return PROFESIONALES[servicio].find(p => !ocupados.includes(p));
}

export function mapearServicio(valor) {
    if (valor.toLowerCase().includes("veterinaria")) return "veterinaria";
    return "estilismo";
}
