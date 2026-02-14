const { validarLogin } = require("../js/login");

test("login correcto", () => {
    const res = validarLogin("admin", "1234");

    expect(res.success).toBe(true);
    expect(res.user.rol).toBe("admin");
});

test("campos vacíos", () => {
    const res = validarLogin("", "");

    expect(res.success).toBe(false);
    expect(res.error).toBe("EMPTY_FIELDS");
});

test("credenciales incorrectas", () => {
    const res = validarLogin("admin", "0000");

    expect(res.success).toBe(false);
    expect(res.error).toBe("INVALID_CREDENTIALS");
});
