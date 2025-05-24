document.addEventListener('DOMContentLoaded', function() {
    const header = `
        <header>
            <nav>
                <a href="#accueil" class="logo">
                    <img src="assets/images/Portfolio LP.png" alt="Logo Portfolio LP" class="logo-img">
                </a>
                <div class="nav-links">
                    <a href="index.html">Accueil</a>
                    <a href="parcours.html">Parcours</a>
                    <a href="certifications.html">Certifications</a>
                    <a href="veille.html">Veille</a>
                    <a href="projets.html">Projets</a>
                    <a href="documentation.html">Documentation</a>
                    <a href="e5.html">Épreuve E5</a>
                </div>
            </nav>
        </header>
    `;

    // Insérer le header au début du body
    document.body.insertAdjacentHTML('afterbegin', header);

    // Mettre en surbrillance le lien actif
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
        }
    });
}); 