// =======================
// 1️⃣ Cargar Secciones Dinámicamente
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const sections = ["header", "hero", "welcome", "countdown", "gallery", "dresscode", "gifts", "finalinfo", "footer"];

    sections.forEach(section => {
        fetch(`sections/${section}.html`)
            .then(response => response.text())
            .then(data => {
                document.getElementById(section).innerHTML = data;

                // Ejecutar funciones adicionales después de cargar las secciones
                if (section === "countdown") initializeCountdown();
                if (section === "gallery") initializeGallery();
            })
            .catch(error => console.error(`Error al cargar ${section}:`, error));
    });
});

// =======================
// 2️⃣ Cuenta Regresiva
// =======================
function initializeCountdown() {
    const eventDate = new Date("2025-06-20T19:00:00").getTime();

    function updateCountdown() {
        const now = new Date().getTime();
        const timeLeft = eventDate - now;

        if (timeLeft <= 0) {
            document.getElementById("countdown-timer").innerHTML = "¡El evento ha comenzado!";
            return;
        }

        const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
        const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

        document.getElementById("countdown-timer").innerHTML = `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }

    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// =======================
// 3️⃣ Galería de Imágenes
// =======================
function initializeGallery() {
    setTimeout(() => {
        const galleryImages = document.querySelectorAll(".gallery-image");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        if (!galleryImages.length || !prevBtn || !nextBtn) {
            console.error("Error: La galería no se cargó correctamente.");
            return;
        }

        let currentIndex = 0;

        function updateGallery() {
            galleryImages.forEach((img, index) => {
                img.classList.remove("active", "left", "right");

                if (index === currentIndex) {
                    img.classList.add("active");
                } else if (index === (currentIndex - 1 + galleryImages.length) % galleryImages.length) {
                    img.classList.add("left");
                } else if (index === (currentIndex + 1) % galleryImages.length) {
                    img.classList.add("right");
                }
            });
        }

        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
            updateGallery();
        });

        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
            updateGallery();
        });

        updateGallery();
    }, 500); // Esperar 500ms para que la galería se cargue correctamente
}

// =======================
// 1️⃣ Cargar Secciones Dinámicamente
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const sections = ["header", "hero", "welcome", "countdown", "gallery", "dresscode", "gifts", "finalinfo", "footer"];

    sections.forEach(section => {
        fetch(`sections/${section}.html`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.text();
            })
            .then(data => {
                document.getElementById(section).innerHTML = data;

                // Agregar clase .loaded después de cargar para evitar que desaparezca
                document.getElementById(section).classList.add("loaded");
            })
            .catch(error => console.error(`Error al cargar ${section}:`, error));
    });
});

// =======================
// 2️⃣ Animación de Secciones al Hacer Scroll
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                observer.unobserve(entry.target); // Para que no desaparezca de nuevo
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll(".section").forEach(section => {
        observer.observe(section);
    });
});
