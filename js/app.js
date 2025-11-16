// Simulación de sesión
const logged = localStorage.getItem("logged");

// Si está en home y no hay sesión, redirigir al login
if (window.location.pathname.includes("home.html") && !logged) {
    window.location.href = "login.html";
}

// Login
document.getElementById("loginForm")?.addEventListener("submit", e => {
    e.preventDefault();
    localStorage.setItem("logged", "true");
    window.location.href = "home.html";
});

// Registro
document.getElementById("registerForm")?.addEventListener("submit", e => {
    e.preventDefault();
    alert("Cuenta creada con éxito. Inicia sesión.");
    window.location.href = "login.html";
});

// Logout
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("logged");
    window.location.href = "login.html";
});
