document.addEventListener("DOMContentLoaded", () => {
    const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";
    const token = localStorage.getItem("token");

    if (!token) {
        window.location.href = "Login.html";
    }

    const btnOpenModal = document.getElementById("openModal");
    const modal = document.getElementById("projectModal");
    const btnCloseModal = document.getElementById("closeModal");
    const projectForm = document.getElementById("projectForm");

    const projectIdInput = document.getElementById("projectId");
    const titleInput = document.getElementById("projectTitle");
    const descriptionInput = document.getElementById("projectDescription");

    const techInput = document.getElementById("projectTech");
    const imagesInput = document.getElementById("projectImages");
    const repoInput = document.getElementById("projectRepo");

    const projectsList = document.getElementById("projectsList");
    const logoutBtn = document.getElementById("logoutBtn");

    const openModal = () => {
        projectForm.reset();
        projectIdInput.value = "";
        document.getElementById("modalTitle").textContent = "Nuevo Proyecto";

        modal.classList.remove("hidden");
        requestAnimationFrame(() => modal.classList.add("show"));
    };

    const closeModal = () => {
        modal.classList.remove("show");
        setTimeout(() => modal.classList.add("hidden"), 250);
    };

    btnOpenModal.addEventListener("click", openModal);
    btnCloseModal.addEventListener("click", closeModal);

    async function loadProjects() {
        try {
            const res = await fetch(`${API_BASE}/projects`, {
                headers: { "auth-token": token }
            });

            const data = await res.json();
            projectsList.innerHTML = "";

            if (!Array.isArray(data) || data.length === 0) {
                projectsList.innerHTML = `<p class="no-projects">No hay proyectos todavía. Agrega uno.</p>`;
                return;
            }

            data.forEach(project => {
                const card = document.createElement("div");
                card.classList.add("project-card");

                card.innerHTML = `
                    <h3>${project.title}</h3>
                    <p>${project.description}</p>

                    <p><strong>Tecnologías:</strong> 
                        ${project.technologies?.join(", ") || "Sin datos"}
                    </p>

                    <div class="image-list">
                        ${(project.images || [])
                            .map(img => `<img src="${img}" class="project-img">`)
                            .join("")}
                    </div>

                    <p><strong>Repositorio:</strong> 
                        <a href="${project.repository}" target="_blank">
                            ${project.repository || "No disponible"}
                        </a>
                    </p>

                    <div class="project-actions">
                        <button class="btn-edit"
                            onclick="editProject(
                                '${project._id}', 
                                \`${project.title}\`,
                                \`${project.description}\`,
                                \`${project.technologies?.join(", ") || ""}\`,
                                \`${project.images?.join(", ") || ""}\`,
                                '${project.repository || ""}'
                            )">
                            Editar
                        </button>

                        <button class="btn-delete" onclick="deleteProject('${project._id}')">
                            Eliminar
                        </button>
                    </div>
                `;

                projectsList.appendChild(card);
            });

        } catch (error) {
            console.error("❌ Error al cargar proyectos:", error);
        }
    }

    loadProjects();

    projectForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const id = projectIdInput.value;

        const bodyData = {
            title: titleInput.value.trim(),
            description: descriptionInput.value.trim(),
            technologies: techInput.value.split(",").map(t => t.trim()).filter(Boolean),
            images: imagesInput.value.split(",").map(i => i.trim()).filter(Boolean),
            repository: repoInput.value.trim()
        };

        const method = id ? "PUT" : "POST";
        const url = id ? `${API_BASE}/projects/${id}` : `${API_BASE}/projects`;

        try {
            const res = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    "auth-token": token
                },
                body: JSON.stringify(bodyData)
            });

            if (!res.ok) {
                const errorData = await res.json();
                return alert("Error: " + (errorData.message || "No autorizado"));
            }

            closeModal();
            loadProjects();
        } catch (error) {
            console.error("❌ Error guardando proyecto:", error);
            alert("Error al conectar con la API");
        }
    });

    window.editProject = function (id, title, description, technologies, images, repo) {
        projectIdInput.value = id;
        titleInput.value = title;
        descriptionInput.value = description;

        techInput.value = technologies;
        imagesInput.value = images;
        repoInput.value = repo;

        document.getElementById("modalTitle").textContent = "Editar Proyecto";
        modal.classList.remove("hidden");
        requestAnimationFrame(() => modal.classList.add("show"));
    };

    window.deleteProject = async function (id) {
        if (!confirm("¿Eliminar este proyecto?")) return;

        try {
            const res = await fetch(`${API_BASE}/projects/${id}`, {
                method: "DELETE",
                headers: { "auth-token": token }
            });

            if (!res.ok) {
                const errorData = await res.json();
                alert("Error: " + (errorData.message || "No autorizado"));
                return;
            }

            loadProjects();
        } catch (error) {
            console.error("❌ Error al eliminar:", error);
        }
    };

    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "Login.html";
    });
});
