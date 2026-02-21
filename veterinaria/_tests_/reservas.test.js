import {
    PROFESIONALES,
    validarDatos,
    profesionalDisponible,
    hayDisponibilidad,
    asignarProfesional,
    mapearServicio
} from "./core/reservas";

describe("validarDatos", () => {

  test("devuelve array vacío si los datos son válidos", () => {
    const datos = {
      nombre: "Juan",
      telefono: "12345678",
      email: "juan@email.com",
      servicio: "veterinaria",
      diaHora: "2026-02-16T10:00:00"
    };

    expect(validarDatos(datos)).toEqual([]);
  });

  test("detecta campos obligatorios vacíos", () => {
    const datos = {
      nombre: "",
      telefono: "",
      email: "",
      servicio: "",
      diaHora: ""
    };

    const errores = validarDatos(datos);

    expect(errores).toContain("Todos los campos son obligatorios");
  });

  test("detecta teléfono inválido", () => {
    const datos = {
      nombre: "Juan",
      telefono: "123abc",
      email: "juan@email.com",
      servicio: "veterinaria",
      diaHora: "2026-02-16T10:00:00"
    };

    expect(validarDatos(datos)).toContain("El teléfono debe contener solo números");
  });

  test("detecta email inválido", () => {
    const datos = {
      nombre: "Juan",
      telefono: "12345678",
      email: "juanemail.com",
      servicio: "veterinaria",
      diaHora: "2026-02-16T10:00:00"
    };

    expect(validarDatos(datos)).toContain("El email no tiene un formato válido");
  });

  test("detecta horario fuera de rango", () => {
    const datos = {
      nombre: "Juan",
      telefono: "12345678",
      email: "juan@email.com",
      servicio: "veterinaria",
      diaHora: "2026-02-16T20:00:00"
    };

    expect(validarDatos(datos)).toContain("El horario debe estar entre las 9 y las 18 hs");
  });

  test("detecta domingo", () => {
    const datos = {
      nombre: "Juan",
      telefono: "12345678",
      email: "juan@email.com",
      servicio: "veterinaria",
      diaHora: "2026-02-15T10:00:00" // 15 febrero 2026 es domingo
    };

    expect(validarDatos(datos)).toContain("No se atiende los domingos");
  });

});

describe("profesionalDisponible", () => {

  const reservas = [
    {
      profesional: "Valentina Rodríguez",
      servicio: "veterinaria",
      diaHora: "2026-02-16T10:00:00"
    }
  ];

  test("devuelve false si el profesional ya está ocupado", () => {
    const disponible = profesionalDisponible(
      reservas,
      "Valentina Rodríguez",
      "veterinaria",
      "2026-02-16T10:00:00"
    );

    expect(disponible).toBe(false);
  });

  test("devuelve true si el profesional está libre", () => {
    const disponible = profesionalDisponible(
      reservas,
      "Mateo González",
      "veterinaria",
      "2026-02-16T10:00:00"
    );

    expect(disponible).toBe(true);
  });

});

describe("hayDisponibilidad", () => {

  test("devuelve true si aún quedan profesionales libres", () => {
    const reservas = [
      {
        profesional: "Valentina Rodríguez",
        servicio: "veterinaria",
        diaHora: "2026-02-16T10:00:00"
      }
    ];

    const resultado = hayDisponibilidad(
      reservas,
      "veterinaria",
      "2026-02-16T10:00:00"
    );

    expect(resultado).toBe(true);
  });

  test("devuelve false si todos están ocupados", () => {
    const reservas = PROFESIONALES.veterinaria.map(p => ({
      profesional: p,
      servicio: "veterinaria",
      diaHora: "2026-02-16T10:00:00"
    }));

    const resultado = hayDisponibilidad(
      reservas,
      "veterinaria",
      "2026-02-16T10:00:00"
    );

    expect(resultado).toBe(false);
  });

});

describe("asignarProfesional", () => {

  test("asigna el primer profesional libre", () => {
    const reservas = [
      {
        profesional: "Valentina Rodríguez",
        servicio: "veterinaria",
        diaHora: "2026-02-16T10:00:00"
      }
    ];

    const asignado = asignarProfesional(
      reservas,
      "veterinaria",
      "2026-02-16T10:00:00"
    );

    expect(asignado).toBe("Mateo González");
  });

  test("devuelve undefined si todos están ocupados", () => {
    const reservas = PROFESIONALES.veterinaria.map(p => ({
      profesional: p,
      servicio: "veterinaria",
      diaHora: "2026-02-16T10:00:00"
    }));

    const asignado = asignarProfesional(
      reservas,
      "veterinaria",
      "2026-02-16T10:00:00"
    );

    expect(asignado).toBeUndefined();
  });

});

describe("mapearServicio", () => {

  test("detecta veterinaria aunque esté en mayúsculas", () => {
    expect(mapearServicio("Servicio de VETERINARIA"))
      .toBe("veterinaria");
  });

  test("si no es veterinaria devuelve estilismo", () => {
    expect(mapearServicio("Corte y baño"))
      .toBe("estilismo");
  });

});