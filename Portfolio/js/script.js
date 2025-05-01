// === Affichage des descriptions dans le portfolio ===
document.querySelectorAll('.portfolio-item .image-wrapper img').forEach((image) => {
    image.addEventListener('click', (e) => {
        const hiddenText = e.target.closest('.portfolio-item').querySelector('.hidden-text');
        if (hiddenText) {
            hiddenText.style.display = hiddenText.style.display === 'block' ? 'none' : 'block';
        }
    });
});

// === Highlight dans le menu au scroll ===
document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("header nav ul li a");

    const highlightNav = () => {
        let currentSection = "";
        const scrollPos = window.scrollY;

        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (scrollPos >= sectionTop - sectionHeight / 3) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.toggle("active", link.getAttribute("href").substring(1) === currentSection);
        });
    };

    window.addEventListener("scroll", highlightNav);
    highlightNav(); // appel initial
});

// === Glissement horizontal du portfolio ===
document.querySelectorAll('.portfolio-items').forEach((container) => {
    let isDown = false;
    let startX = 0;
    let scrollLeft = 0;

    const startDrag = (e) => {
        isDown = true;
        startX = (e.pageX || e.touches[0].pageX);
        scrollLeft = container.scrollLeft;
    };

    const drag = (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = (e.pageX || e.touches[0].pageX);
        const walk = (x - startX) * 1.5;
        container.scrollLeft = scrollLeft - walk;
    };

    const endDrag = () => {
        isDown = false;
    };

    container.addEventListener('mousedown', startDrag);
    container.addEventListener('touchstart', startDrag);
    container.addEventListener('mousemove', drag);
    container.addEventListener('touchmove', drag);
    container.addEventListener('mouseup', endDrag);
    container.addEventListener('mouseleave', endDrag);
    container.addEventListener('touchend', endDrag);
});
