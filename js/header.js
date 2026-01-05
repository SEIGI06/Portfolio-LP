document.addEventListener('DOMContentLoaded', () => {
    const navigationItems = [
        { href: 'index.html', label: 'Accueil' },
        { href: 'parcours.html', label: 'Parcours' },
        { href: 'projets.html', label: 'Projets' },
        { href: 'veille.html', label: 'Veille' },
        { href: 'certifications.html', label: 'Certifications' },
        { href: 'documentation.html', label: 'Documentation' }
    ];

    const header = document.createElement('header');
    header.className = 'site-header';
    header.setAttribute('role', 'banner');

    header.innerHTML = `
        <div class="container site-header__inner">
            <a href="index.html" class="brand" aria-label="Retour à l'accueil">
                <img src="assets/images/Portfolio LP.png" alt="Logo de Lilian Peyr" loading="lazy" decoding="async">
                <span>Portfolio LP</span>
            </a>
            <nav class="site-nav" aria-label="Navigation principale">
                <button class="site-nav__toggle" type="button" aria-controls="site-navigation" aria-expanded="false">
                    Menu
                </button>
                <ul class="site-nav__list" id="site-navigation" aria-expanded="false">
                    ${navigationItems.map(item => `
                        <li>
                            <a class="site-nav__link" href="${item.href}">${item.label}</a>
                        </li>
                    `).join('')}
                </ul>
            </nav>
        </div>
    `;

    document.body.insertAdjacentElement('afterbegin', header);

    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = header.querySelectorAll('.site-nav__link');

    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || (linkHref === 'index.html' && currentPage === '')) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    const toggleButton = header.querySelector('.site-nav__toggle');
    const navList = header.querySelector('.site-nav__list');

    const closeNavigation = () => {
        toggleButton.setAttribute('aria-expanded', 'false');
        navList.setAttribute('aria-expanded', 'false');
    };

    toggleButton.addEventListener('click', () => {
        const isExpanded = toggleButton.getAttribute('aria-expanded') === 'true';
        toggleButton.setAttribute('aria-expanded', String(!isExpanded));
        navList.setAttribute('aria-expanded', String(!isExpanded));
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth < 921) {
                closeNavigation();
            }
        });
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 921) {
            closeNavigation();
        }
    });

    let previousScrollY = window.scrollY;
    const elevateHeader = () => {
        const currentScrollY = window.scrollY;
        if (currentScrollY > 10 && currentScrollY > previousScrollY) {
            header.classList.add('site-header--elevated');
        } else if (currentScrollY <= 10) {
            header.classList.remove('site-header--elevated');
        }
        previousScrollY = currentScrollY;
    };

    window.addEventListener('scroll', elevateHeader, { passive: true });
    elevateHeader();
});