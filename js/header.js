document.addEventListener('DOMContentLoaded', function() {
    // Détecter si nous sommes sur la page de jeux
    const isGamesPage = window.location.pathname.includes('jeux.html');
    
    const logoElement = isGamesPage 
        ? `<a href="index.html" class="nav__logo nav__logo--text" aria-label="Retour à l'accueil">Portfolio LP</a>`
        : `<a href="index.html" class="nav__logo" aria-label="Retour à l'accueil">
            <img src="assets/images/Portfolio LP.png" alt="Logo Portfolio LP" class="nav__logo-img" loading="lazy">
        </a>`;
    
    const header = `
        <header class="header" role="banner">
            <nav class="nav" role="navigation" aria-label="Navigation principale">
                ${logoElement}
                <button class="menu-toggle" aria-label="Menu" aria-expanded="false" aria-controls="nav-links">
                    <span class="hamburger"></span>
                </button>
                <div class="nav__links" id="nav-links">
                    <a href="index.html" aria-current="page">Accueil</a>
                    <a href="parcours.html">Parcours</a>
                    <a href="certifications.html">Certifications</a>
                    <a href="veille.html">Veille</a>
                    <a href="projets.html">Projets</a>
                    <a href="documentation.html">Documentation</a>
                    <a href="e5.html">Épreuve E5</a>
                    <a href="ia.html">IA</a>
                </div>
            </nav>
        </header>
    `;

    // Insérer le header au début du body
    document.body.insertAdjacentHTML('afterbegin', header);

    // Mettre en surbrillance le lien actif
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav__links a');
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPage) {
            link.classList.add('active');
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // Gestion du menu mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinksContainer = document.querySelector('.nav__links');
    
    menuToggle.addEventListener('click', () => {
        const isExpanded = menuToggle.getAttribute('aria-expanded') === 'true';
        menuToggle.setAttribute('aria-expanded', !isExpanded);
        navLinksContainer.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });

    // Fermer le menu lors du clic sur un lien
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 768) {
                menuToggle.setAttribute('aria-expanded', 'false');
                navLinksContainer.classList.remove('active');
                menuToggle.classList.remove('active');
            }
        });
    });

    // Fermer le menu lors du redimensionnement de la fenêtre
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuToggle.setAttribute('aria-expanded', 'false');
            navLinksContainer.classList.remove('active');
            menuToggle.classList.remove('active');
        }
    });
}); 