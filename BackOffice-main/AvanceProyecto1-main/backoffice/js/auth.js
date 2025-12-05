// =======================================
// PROTEGER HOME — SI NO HAY TOKEN, FUERA
// =======================================
if (window.location.pathname.endsWith("home.html")) {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.href = "Login.html";
    }
}

// =======================================
// BOTÓN LOGOUT
// =======================================
const logoutBtn = document.getElementById("logoutBtn");
if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
        localStorage.removeItem("token");
        window.location.href = "Login.html";
    });
}

// =======================================
// API BASE
// =======================================
const API_BASE = "https://portfolio-api-three-black.vercel.app/api/v1";

// =======================================
// REGISTRO (API)
// =======================================
async function registerUser(event) {
    event.preventDefault();

    const data = {
        name: document.querySelector("#name").value,
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value,
        itsonId: document.querySelector("#itsonId").value
    };

    try {
        const response = await fetch(`${API_BASE}/auth/register`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (!response.ok) {
            alert(result.message || "Error al registrar usuario");
            return;
        }

        alert("Usuario registrado correctamente");
        window.location.href = "Login.html";

    } catch (error) {
        alert("Error al conectar con la API");
    }
}


// =======================================
// LOGIN (API)
// =======================================
async function loginUser(event) {
    event.preventDefault();

    const data = {
        email: document.querySelector("#email").value,
        password: document.querySelector("#password").value
    };

    try {
        const response = await fetch(`${API_BASE}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });

        const result = await response.json();
        console.log("Status:", response.status);
        console.log("Respuesta API:", result);

        if (!response.ok) {
            alert(result.message || "Credenciales incorrectas");
            return;
        }

        // 👇 ESTA ES LA LÍNEA CORRECTA
        localStorage.setItem("token", result.token);

        window.location.href = "home.html";

    } catch (error) {
        console.error("⚠ ERROR REAL:", error);
        alert("ERROR REAL EN CONSOLA");
    }
}

