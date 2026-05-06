/**
 * SHARED COMPONENTS LOADER
 * This script centralizes the Header and Footer to avoid code repetition across pages.
 */

function getHeaderHTML() {
    return `
    <div class="container site-header__inner">
        <a href="/" class="logo">Lilian<span>.</span></a>
        
        <button class="mobile-menu-btn" id="mobile-menu-btn" aria-label="Ouvrir le menu">
            <svg id="menu-icon-open" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
            <svg id="menu-icon-close" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="display:none;"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>

        <nav id="main-nav">
            <ul class="nav-list">
                <li><a href="/" class="nav-link">Accueil</a></li>
                <li><a href="/parcours.html" class="nav-link">Parcours</a></li>
                <li><a href="/projets.html" class="nav-link">Projets</a></li>
                <li><a href="/veille.html" class="nav-link">Veille</a></li>
                <li><a href="/certifications.html" class="nav-link">Certifications</a></li>
                <li><a href="/documentation.html" class="nav-link">Documentation</a></li>
                <li><a href="/contact.html" class="button button--primary" style="padding: 0.5rem 1.5rem; font-size: 0.9rem;">Me contacter</a></li>
            </ul>
        </nav>
    </div>
    `;
}

const FOOTER_HTML = `
    <div class="container site-footer__inner">
        <p>© 2025 Lilian Peyr — Portfolio BTS SIO SISR</p>
        <div class="hero__actions" style="margin: 0; gap: 1rem; align-items: center;">
            <a href="/contact.html" class="nav-link">Contact</a>
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
        
        // Mobile menu logic
        const mobileBtn = document.getElementById('mobile-menu-btn');
        const mainNav = document.getElementById('main-nav');
        const iconOpen = document.getElementById('menu-icon-open');
        const iconClose = document.getElementById('menu-icon-close');

        if (mobileBtn && mainNav) {
            mobileBtn.addEventListener('click', () => {
                const isOpen = mainNav.classList.toggle('is-open');
                iconOpen.style.display = isOpen ? 'none' : 'block';
                iconClose.style.display = isOpen ? 'block' : 'none';
            });

            // Close on click outside
            document.addEventListener('click', (e) => {
                if (!mainNav.contains(e.target) && !mobileBtn.contains(e.target) && mainNav.classList.contains('is-open')) {
                    mainNav.classList.remove('is-open');
                    iconOpen.style.display = 'block';
                    iconClose.style.display = 'none';
                }
            });
        }
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
