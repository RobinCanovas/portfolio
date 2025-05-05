document.addEventListener("DOMContentLoaded", () => {
    const sections = document.querySelectorAll("section[id]");
    const navLinks = document.querySelectorAll("header nav ul li a");

    const highlightNav = () => {
        let currentSection = "";
        sections.forEach((section) => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop - sectionHeight / 3) {
                currentSection = section.id;
            }
        });

        navLinks.forEach((link) => {
            link.classList.remove("active");
            const linkHref = link.getAttribute("href");
            if (linkHref.startsWith("#") && linkHref.substring(1) === currentSection) {
                link.classList.add("active");
            }
        });
    };

    window.addEventListener("scroll", highlightNav);
    highlightNav(); // Appel initial
});