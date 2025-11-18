const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

if (location.pathname.toLowerCase().includes("home.html")) {
    const token = localStorage.getItem("authToken");
    if (!token) window.location.href = "login.html";
}

document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("newName").value;
    const email = document.getElementById("newEmail").value;
    const itsonId = document.getElementById("newItsonId").value;
    const password = document.getElementById("newPass").value;

    const res = await fetch(`${API_BASE}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, itsonId, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Error al registrar");
        return;
    }

    alert("Usuario registrado correctamente.");
    window.location.href = "login.html";
});

document.getElementById("loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPass").value;

    const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
        alert(data.message || "Credenciales incorrectas");
        return;
    }

    localStorage.setItem("authToken", data.token);
    window.location.href = "home.html";
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
});
