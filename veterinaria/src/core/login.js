const USER_CREDENTIALS = {
    username: "admin",
    password: "1234",
    nombre: "Administrador",
    rol: "admin"
};

const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");
const errorMsg2 = document.getElementById("errorMsg2");
form.addEventListener("submit", function (e) {
    e.preventDefault();

    const userInput = document.getElementById("usuario").value.trim();
    const passwordInput = document.getElementById("password").value.trim();

    if (
        userInput === USER_CREDENTIALS.username &&
        passwordInput === USER_CREDENTIALS.password
    ) {
        // Ocultar error si estaba visible
        errorMsg.style.display = "none";

        // Guardar sesión
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("nombre", USER_CREDENTIALS.nombre);
        localStorage.setItem("rol", USER_CREDENTIALS.rol);

        // Redirigir
        window.location.href = "../html/admin.html";
    }else if( userInput == "" || passwordInput == "") {
         errorMsg2.style.display = "flex";
         errorMsg.style.display = "none";
    } else {
        // Mostrar error
        errorMsg.style.display = "flex";
        errorMsg2.style.display = "none";
    }
});
