const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

const showFormBtn = document.getElementById("showFormBtn");
const projectForm = document.getElementById("projectForm");
const saveProjectBtn = document.getElementById("saveProjectBtn");
const logoutBtn = document.getElementById("logoutBtn");

showFormBtn.addEventListener("click", () => {
    projectForm.style.display = projectForm.style.display === "none" ? "block" : "none";
});

logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
});

async function loadProjects() {
    const token = localStorage.getItem("authToken");
    if (!token) return;

    const res = await fetch(`${API_BASE}/projects`, {
        headers: { "auth-token": token }
    });
    if (!res.ok) return console.error("No se pudieron cargar los proyectos");
    const projects = await res.json();
    renderProjects(projects);
}

function renderProjects(projects) {
    const container = document.getElementById("projectsList");
    container.innerHTML = "";

    projects.forEach(p => {
        const techList = Array.isArray(p.technologies) && p.technologies.length
            ? p.technologies.join(", ")
            : "Sin tecnologías";

        const imgTag = Array.isArray(p.images) && p.images.length
            ? `<img src="${p.images[0]}" alt="Imagen del proyecto" style="width:100%; max-height:200px; object-fit:cover; margin-bottom:0.5rem;">`
            : "";

        const card = document.createElement("div");
        card.classList.add("project-card");
        card.innerHTML = `
            ${imgTag}
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <p><strong>Tecnologías:</strong> ${techList}</p>
            ${p.repository ? `<p>Repo: <a href="${p.repository}" target="_blank">${p.repository}</a></p>` : ""}
            <div class="card-actions">
                <button class="btn-update" onclick="editProject('${p._id}')">Editar</button>
                <button class="btn-delete" onclick="deleteProject('${p._id}')">Eliminar</button>
            </div>
        `;
        container.appendChild(card);
    });
}

saveProjectBtn.addEventListener("click", async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Debes iniciar sesión primero");

    const id = document.getElementById("projectId")?.value || "";
    const title = document.getElementById("projectTitle").value.trim();
    const description = document.getElementById("projectDesc").value.trim();
    const repository = document.getElementById("projectRepo").value.trim();
    const technologies = document.getElementById("projectTech").value
        .split(",")
        .map(t => t.trim())
        .filter(t => t !== "");
    const images = document.getElementById("projectImage")?.value
        .split(",")
        .map(url => url.trim())
        .filter(url => url !== "");

    const projectData = { title, description, repository, technologies, images };

    try {
        if (id) {
            await fetch(`${API_BASE}/projects/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "auth-token": token },
                body: JSON.stringify(projectData)
            });
        } else {
            await fetch(`${API_BASE}/projects`, {
                method: "POST",
                headers: { "Content-Type": "application/json", "auth-token": token },
                body: JSON.stringify(projectData)
            });
        }

        document.getElementById("projectTitle").value = "";
        document.getElementById("projectDesc").value = "";
        document.getElementById("projectTech").value = "";
        document.getElementById("projectRepo").value = "";
        if(document.getElementById("projectImage")) document.getElementById("projectImage").value = "";
        if(document.getElementById("projectId")) document.getElementById("projectId").value = "";

        loadProjects();
    } catch (err) {
        console.error(err);
        alert("Error al guardar el proyecto");
    }
});


async function editProject(id) {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Debes iniciar sesión primero");

    const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: { "auth-token": token }
    });
    const p = await res.json();

    projectForm.style.display = "block";

    document.getElementById("projectId").value = p._id;
    document.getElementById("projectTitle").value = p.title;
    document.getElementById("projectDesc").value = p.description;
    document.getElementById("projectRepo").value = p.repository || "";
    document.getElementById("projectTech").value = Array.isArray(p.technologies) ? p.technologies.join(", ") : "";
    if(document.getElementById("projectImage")) 
        document.getElementById("projectImage").value = Array.isArray(p.images) ? p.images.join(", ") : "";
}

async function deleteProject(id) {
    const token = localStorage.getItem("authToken");
    if (!token) return alert("Debes iniciar sesión primero");

    await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token }
    });
    loadProjects();
}

loadProjects();
