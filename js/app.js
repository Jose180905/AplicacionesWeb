const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

if (location.pathname.includes("home.html")) {
    const token = localStorage.getItem("authToken");
    if (!token) window.location.href = "login.html";
}

document.getElementById("registerForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const name = document.getElementById("newName").value.trim();
    const email = document.getElementById("newEmail").value.trim().toLowerCase();
    const itsonId = document.getElementById("newItsonId").value.trim();
    const password = document.getElementById("newPass").value;

    if (!name || !email || !itsonId || !password) {
        alert("Todos los campos son obligatorios.");
        return;
    }

    try {
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

    } catch (err) {
        alert("Error de red o servidor.");
    }
});

document.getElementById("loginForm")?.addEventListener("submit", async e => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value.trim().toLowerCase();
    const password = document.getElementById("loginPass").value;

    if (!email || !password) {
        alert("Correo y contraseña son obligatorios.");
        return;
    }

    try {
        const res = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();

        if (!res.ok || !data.userPublicData) {
            alert(data.message || "Credenciales incorrectas");
            return;
        }

        localStorage.setItem("authToken", data.token);
        localStorage.setItem("userId", data.userPublicData.id);
        localStorage.setItem("user", JSON.stringify(data.userPublicData));

        const loginParams = new URLSearchParams(window.location.search);
        const returnTo = loginParams.get("returnTo");

        if (returnTo) {
            let decoded = decodeURIComponent(returnTo);
            const hasQuery = decoded.includes("?");
            decoded += hasQuery ? "&fromLogin=1" : "?fromLogin=1";
            window.location.href = decoded;
        } else {
            window.location.href = "home.html?fromLogin=1";
        }

    } catch (err) {
        alert("Error de red o servidor.");
    }
});

document.getElementById("logoutBtn")?.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    window.location.href = "login.html";
});
