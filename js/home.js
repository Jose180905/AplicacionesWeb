const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
const token = localStorage.getItem("authToken");

if (!token) window.location.href = "login.html";

const logoutBtn = document.getElementById("logoutBtn");
const showFormBtn = document.getElementById("showFormBtn");
const projectForm = document.getElementById("projectForm");
const saveProjectBtn = document.getElementById("saveProjectBtn");

const titleInput = document.getElementById("projectTitle");
const descInput = document.getElementById("projectDesc");
const projectsList = document.getElementById("projectsList");

let editing = false;
let editingId = null;

logoutBtn.onclick = () => {
    localStorage.removeItem("authToken");
    window.location.href = "login.html";
};

showFormBtn.onclick = () => {
    editing = false;
    editingId = null;
    titleInput.value = "";
    descInput.value = "";
    projectForm.style.display = "block";
};

async function fetchProjects() {
    const res = await fetch(`${API_BASE}/projects`, {
        headers: { "auth-token": token }
    });

    const data = await res.json();
    renderProjects(data);
}

function renderProjects(list) {
    projectsList.innerHTML = "";

    list.forEach(p => {
        const card = document.createElement("div");
        card.className = "project-card";
        card.innerHTML = `
            <h3>${p.title}</h3>
            <p>${p.description}</p>
            <div class="card-actions">
                <button class="btn-update" data-id="${p._id}">Editar</button>
                <button class="btn-delete" data-id="${p._id}">Eliminar</button>
            </div>
        `;
        projectsList.appendChild(card);
    });

    document.querySelectorAll(".btn-update").forEach(btn => {
        btn.onclick = () => loadProject(btn.dataset.id);
    });

    document.querySelectorAll(".btn-delete").forEach(btn => {
        btn.onclick = () => deleteProject(btn.dataset.id);
    });
}

async function loadProject(id) {
    const res = await fetch(`${API_BASE}/projects/${id}`, {
        headers: { "auth-token": token }
    });

    const p = await res.json();

    editing = true;
    editingId = id;

    titleInput.value = p.title;
    descInput.value = p.description;

    projectForm.style.display = "block";
}

saveProjectBtn.onclick = async () => {
    const payload = {
        title: titleInput.value,
        description: descInput.value
    };

    if (!payload.title || !payload.description) {
        alert("Todos los campos son obligatorios");
        return;
    }

    const url = editing
        ? `${API_BASE}/projects/${editingId}`
        : `${API_BASE}/projects`;

    const method = editing ? "PUT" : "POST";

    await fetch(url, {
        method,
        headers: {
            "Content-Type": "application/json",
            "auth-token": token
        },
        body: JSON.stringify(payload)
    });

    projectForm.style.display = "none";
    fetchProjects();
};

async function deleteProject(id) {
    await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: { "auth-token": token }
    });

    fetchProjects();
}

fetchProjects();
