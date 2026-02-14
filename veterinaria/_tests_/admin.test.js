// test('formatear fecha', () => {
//     const { formatearFecha } = require('../src/core/admin');
    
//     expect(formatearFecha("2024-06-15T14:30")).toBe("15/06/2024 14:30");
// });
const {
    formatearFecha,
    filtrarPorFecha,
    obtenerTurnosFuturos
} = require("../src/core/admin");

test("devuelve solo turnos futuros", () => {
    const turnos = [
        { diaHora: "2026-02-20T10:00", profesional: "B" },
        { diaHora: "2026-02-18T09:00", profesional: "A" }
    ];

    const resultado = obtenerTurnosFuturos(turnos, "2026-02-19T09:00");

    expect(resultado.length).toBe(1);
});

