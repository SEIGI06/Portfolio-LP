// Fonction pour créer le header
function createHeader() {
    const header = document.createElement('header');
    header.innerHTML = `
        <nav>
            <div class="logo">Portfolio</div>
            <div class="nav-links">
                <a href="index.html">Accueil</a>
                <a href="parcours.html">Parcours</a>
                <a href="certifications.html">Certifications</a>
                <a href="veille.html">Veille</a>
                <a href="projets.html">Projets</a>
                <a href="documentation.html">Documentation</a>
                <a href="e5.html">Épreuve E5</a>
            </div>
            <button id="darkModeToggle" aria-label="Activer/Désactiver le mode sombre">
                <span class="moon">🌙</span>
                <span class="sun">☀️</span>
            </button>
        </nav>
    `;
    return header;
}

// Fonction pour mettre en évidence le lien actif
function highlightCurrentPage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', () => {
    const body = document.body;
    const header = createHeader();
    body.insertBefore(header, body.firstChild);
    highlightCurrentPage();
}); 