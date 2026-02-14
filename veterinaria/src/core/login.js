const USER_CREDENTIALS = {
    username: "admin",
    password: "1234",
    nombre: "Administrador",
    rol: "admin"
};

function validarLogin(usuario, password) {
    if (!usuario || !password) {
        return {
            success: false,
            error: "EMPTY_FIELDS"
        };
    }

    if (
        usuario === USER_CREDENTIALS.username &&
        password === USER_CREDENTIALS.password
    ) {
        return {
            success: true,
            user: {
                nombre: USER_CREDENTIALS.nombre,
                rol: USER_CREDENTIALS.rol
            }
        };
    }

    return {
        success: false,
        error: "INVALID_CREDENTIALS"
    };
}

if (typeof module !== "undefined") {
module.exports = {
    validarLogin
};}
