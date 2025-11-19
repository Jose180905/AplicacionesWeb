const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

document.addEventListener("DOMContentLoaded", () => {
    loadProjects();
    document.getElementById("showFormBtn").addEventListener("click", () => {
        document.getElementById("projectForm").style.display = "block";
    });
    document.getElementById("saveProjectBtn").addEventListener("click", createNewProject);
    document.getElementById("logoutBtn").addEventListener("click", () => {
        localStorage.clear();
        window.location.href = "login.html";
    });
});

async function loadProjects() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/projects`, {
            headers: { "auth-token": token }
        });

        const data = await res.json();
        if (!res.ok) return;

        renderProjects(data);
    } catch (err) {
        console.error("Error de red al cargar proyectos:", err);
    }
}

function renderProjects(projects) {
    const container = document.getElementById("projectsList");
    container.innerHTML = "";
    projects.forEach(p => {
        const card = document.createElement("div");
        card.classList.add("project-card");
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            ${p.repository ? `<p>Repo: <a href="${p.repository}" target="_blank">${p.repository}</a></p>` : ""}
            <div class="card-actions">
                <button class="btn-delete" onclick="deleteProject('${p._id}')">Eliminar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

async function createNewProject() {
    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDesc").value.trim();
    const technologies = document.getElementById("projectTech").value
        .split(",")
        .map(t => t.trim())
        .filter(t => t);
    const repository = document.getElementById("projectRepo").value.trim();
    const token = localStorage.getItem("authToken");

    if (!title || !description) {
        alert("Debes llenar el título y la descripción.");
        return;
    }

    if (!token) {
        alert("No estás logueado o tu sesión expiró.");
        return;
    }

    const project = {
        title,
        description,
        technologies,
        repository,
        images: []
    };

    try {
        const res = await fetch(`${API_BASE}/projects`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "auth-token": token
            },
            body: JSON.stringify(project)
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Error creando proyecto:", data);
            alert(`Error al crear proyecto: ${data.message || "Revisa los campos"}`);
            return;
        }

        document.getElementById("projectForm").style.display = "none";
        document.getElementById("projectTitle").value = "";
        document.getElementById("projectDesc").value = "";
        document.getElementById("projectTech").value = "";
        document.getElementById("projectRepo").value = "";
        loadProjects();
    } catch (err) {
        console.error(err);
        alert("Error de red o servidor.");
    }
}

async function deleteProject(id) {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    try {
        const res = await fetch(`${API_BASE}/projects/${id}`, {
            method: "DELETE",
            headers: { "auth-token": token }
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Error eliminando proyecto:", data);
            alert(`No se pudo eliminar el proyecto: ${data.message || "Error desconocido"}`);
            return;
        }

        loadProjects();
    } catch (err) {
        console.error(err);
        alert("Error de red al eliminar proyecto.");
    }
}
