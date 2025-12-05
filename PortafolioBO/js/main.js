document.addEventListener("DOMContentLoaded", () => {

    const itsonId = "252410";
    const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1/publicProjects";
    const projectsContainer = document.getElementById("projectsContainer");

    let projectIds = new Set();

    async function loadProjects() {
        try {
            const res = await fetch(`${API_BASE}/${itsonId}`);
            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                projectsContainer.innerHTML = "<p>No hay proyectos públicos todavía.</p>";
                return;
            }

            data.forEach(project => {

                if (!projectIds.has(project._id)) {
                    projectIds.add(project._id);

                    const card = document.createElement("div");
                    card.classList.add("project-card", "animate__animated", "animate__fadeInUp");

                    const image = project.images?.length > 0 
                                  ? project.images[0] 
                                  : "https://via.placeholder.com/400x250?text=Sin+Imagen";

                    const repo = project.repository || "#";

                    const techs = Array.isArray(project.technologies)
                        ? project.technologies.join(", ")
                        : "N/A";

                    card.innerHTML = `
                        <img class="project-img" src="${image}" alt="Imagen del proyecto">

                        <div class="project-info">
                            <h3>${project.title}</h3>
                            <p>${project.description}</p>

                            <p class="tech"><strong>Tecnologías:</strong> ${techs}</p>

                            <a href="${repo}" target="_blank" class="repo-btn">
                                🔗 Ver repositorio
                            </a>
                        </div>
                    `;

                    projectsContainer.prepend(card);
                }

            });

        } catch (err) {
            console.error("Error cargando proyectos:", err);
            projectsContainer.innerHTML = "<p>Error al cargar proyectos.</p>";
        }
    }

    loadProjects();
    setInterval(loadProjects, 10000);
});
