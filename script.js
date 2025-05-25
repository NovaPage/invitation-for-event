// =======================
// 0️⃣ Preloader: mantenerlo visible hasta que imágenes críticas estén listas
// =======================
// (El overlay #preloader se muestra por defecto vía HTML/CSS)

// =======================
// 1️⃣ Cargar y animar secciones dinámicamente
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

                if (section === "countdown") initializeCountdown();
                if (section === "gallery") initializeGallery();
            })
            .catch(error => console.error(`Error al cargar ${section}:`, error));
    });

    // Observer para animar secciones al entrar en viewport
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll(".section").forEach(section => observer.observe(section));
});

// =======================
// 2️⃣ Inicializar Cuenta Regresiva
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
        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        document.getElementById("countdown-timer").textContent =
            `${days}d : ${hours}h : ${minutes}m : ${seconds}s`;
    }
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// =======================
// 3️⃣ Inicializar Galería de Imágenes
// =======================
function initializeGallery() {
    setTimeout(() => {
        const galleryImages = document.querySelectorAll(".gallery-image");
        const prevBtn = document.getElementById("prevBtn");
        const nextBtn = document.getElementById("nextBtn");

        if (!galleryImages.length || !prevBtn || !nextBtn) {
            console.error("Galería no cargada correctamente");
            return;
        }

        let currentIndex = 0;

        function updateGallery() {
            window.requestAnimationFrame(() => {
                galleryImages.forEach((img, idx) => {
                    img.classList.remove("active", "left", "right");
                    if (idx === currentIndex) img.classList.add("active");
                    else if (idx === (currentIndex - 1 + galleryImages.length) % galleryImages.length)
                        img.classList.add("left");
                    else if (idx === (currentIndex + 1) % galleryImages.length)
                        img.classList.add("right");
                });

                // Precargar próxima imagen
                const nextImg = galleryImages[(currentIndex + 1) % galleryImages.length];
                new Image().src = nextImg.src;
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
        prevBtn.addEventListener("click", (e) => {
            currentIndex = (currentIndex === 0) ? galleryImages.length - 1 : currentIndex - 1;
            updateGallery();
            e.target.blur(); // 🔥 Quitar focus para eliminar hover en móviles
        });
        
        nextBtn.addEventListener("click", (e) => {
            currentIndex = (currentIndex === galleryImages.length - 1) ? 0 : currentIndex + 1;
            updateGallery();
            e.target.blur(); // 🔥 Quitar focus para eliminar hover en móviles
        });
        

        updateGallery();
    }, 500);
}

// =======================
// 4️⃣ Lazy-loading controlado + ocultar preloader al cargar recursos críticos
// =======================
window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    const criticalAssets = [
        ...document.querySelectorAll('img.hero-image, img.gallery-image, video.hero-video')
    ];

    // Forzar carga inmediata en imágenes/videos críticos
    const promises = criticalAssets.map(asset => {
        if (asset.tagName === 'IMG' && asset.complete) return Promise.resolve();
        if (asset.tagName === 'VIDEO' && asset.readyState >= 2) return Promise.resolve();
        return asset.decode ? asset.decode() : Promise.resolve();
    });

    Promise.all(promises)
        .then(() => {
            if (preloader) preloader.classList.add('hidden');
        })
        .catch(() => {
            // Si falla alguna carga, ocultamos igual para no dejar bloqueado
            if (preloader) preloader.classList.add('hidden');
        });

    // Aplicar lazy loading a las demás imágenes no críticas
    document.querySelectorAll('img:not(.hero-image):not(.gallery-image)').forEach(img => {
        img.loading = 'lazy';
        img.classList.add('smooth-transform');
    });
});

// =======================
// 5️⃣ Registrar Service Worker
// =======================
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/service-worker.js')
        .then(reg => console.log('Service Worker registrado:', reg))
        .catch(err => console.error('Error al registrar Service Worker:', err));
}
