/**
 * SHARED COMPONENTS LOADER
 * This script centralizes the Header and Footer to avoid code repetition across pages.
 */

function getHeaderHTML() {
    return `
    <div class="container site-header__inner">
        <a href="/index.html" class="logo">Lilian<span>.</span></a>
        <nav>
            <ul class="nav-list">
                <li><a href="/index.html" class="nav-link">Accueil</a></li>
                <li><a href="/parcours.html" class="nav-link">Parcours</a></li>
                <li><a href="/projets.html" class="nav-link">Projets</a></li>
                <li><a href="/veille.html" class="nav-link">Veille</a></li>
                <li><a href="/certifications.html" class="nav-link">Certifications</a></li>
                <li><a href="/documentation.html" class="nav-link">Documentation</a></li>
                <li><a href="mailto:lpeyr.ledantec@gmail.com" class="button button--primary" style="padding: 0.5rem 1.5rem; font-size: 0.9rem;">Me contacter</a></li>
            </ul>
        </nav>
    </div>
    `;
}

const FOOTER_HTML = `
    <div class="container site-footer__inner">
        <p>© 2025 Lilian Peyr — Portfolio BTS SIO SISR</p>
        <div class="hero__actions" style="margin: 0; gap: 1rem; align-items: center;">
            <a href="mailto:lpeyr.ledantec@gmail.com" class="nav-link">Contact</a>
            <a href="https://www.linkedin.com/in/lilian-peyr/" target="_blank" class="nav-link">LinkedIn</a>
            <a href="/admin-login.html" class="nav-link" style="opacity: 0.5; font-size: 0.8rem;" title="Administration">🔐 Admin</a>
        </div>
    </div>
`;

function initSharedComponents() {
    const headerEl = document.getElementById('main-header');
    const footerEl = document.getElementById('main-footer');

    if (headerEl) {
        headerEl.innerHTML = getHeaderHTML();
        highlightActiveLink();
    }

    if (footerEl) {
        footerEl.innerHTML = FOOTER_HTML;
    }
}

function highlightActiveLink() {
    const path = window.location.pathname;
    const currentPage = path.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');

    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        
        // Match exact page or handle directory index
        if (linkPage === currentPage || (currentPage === '' && linkPage === 'index.html')) {
            link.classList.add('active');
        } else {
            // Also highlight "Projets" if we are on a project detail page
            if (linkPage === 'projets.html' && currentPage === 'projet.html') {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

// Initialisation
document.addEventListener('DOMContentLoaded', initSharedComponents);
