// =======================
// 1️⃣ Cargar y animar secciones
// =======================
document.addEventListener("DOMContentLoaded", () => {
    const sections = [
        "header", "hero", "welcome", "countdown", 
        "gallery", "dresscode", "gifts", "finalinfo", "footer"
    ];

    sections.forEach(section => {
        fetch(`sections/${section}.html`)
            .then(response => {
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                return response.text();
            })
            .then(html => {
                const container = document.getElementById(section);
                container.innerHTML = html;
                container.classList.add("loaded");

                // Inicializar componentes según sección
                if (section === "countdown") initializeCountdown();
                if (section === "gallery") initializeGallery();
            })
            .catch(error => console.error(`Error al cargar ${section}:`, error));
    });

    // Observer para animar entrada de secciones
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll(".section").forEach(sec => observer.observe(sec));
});

// =======================
// 2️⃣ Cuenta Regresiva
// =======================
function initializeCountdown() {
    const eventDate = new Date("2025-06-20T19:00:00").getTime();
    function updateCountdown() {
        const now = Date.now();
        const diff = eventDate - now;
        if (diff <= 0) {
            document.getElementById("countdown-timer").textContent = "¡El evento ha comenzado!";
            return;
        }
        const days = Math.floor(diff / (1000*60*60*24));
        const hours = Math.floor((diff % (1000*60*60*24)) / (1000*60*60));
        const minutes = Math.floor((diff % (1000*60*60)) / (1000*60));
        const seconds = Math.floor((diff % (1000*60)) / 1000);
        document.getElementById("countdown-timer").textContent =
            `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// =======================
// 3️⃣ Galería de Imágenes Optimizada
// =======================
function initializeGallery() {
    setTimeout(() => {
        const galleryImages = document.querySelectorAll(".gallery-image");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");
        if (!galleryImages.length || !prevBtn || !nextBtn) return console.error("Galería no cargada correctamente");

        let currentIndex = 0;

        function updateGallery() {
            window.requestAnimationFrame(() => {
                galleryImages.forEach((img, idx) => {
                    img.classList.remove("active", "left", "right");
                    if (idx === currentIndex) img.classList.add("active");
                    else if (idx === (currentIndex-1+galleryImages.length)%galleryImages.length) img.classList.add("left");
                    else if (idx === (currentIndex+1)%galleryImages.length) img.classList.add("right");
                });
                // Preload next image
                const nextImg = galleryImages[(currentIndex+1)%galleryImages.length];
                new Image().src = nextImg.src;
            });
        }

        prevBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === 0) ? galleryImages.length-1 : currentIndex-1;
            updateGallery();
        });
        nextBtn.addEventListener("click", () => {
            currentIndex = (currentIndex === galleryImages.length-1) ? 0 : currentIndex+1;
            updateGallery();
        });

        updateGallery();
    }, 500);
}

// =======================
// 4️⃣ Lazy-loading y animaciones suaves globales
// =======================
window.addEventListener('load', () => {
    document.querySelectorAll('img').forEach(img => {
        img.loading = 'lazy';
        img.classList.add('smooth-transform');
    });
});
