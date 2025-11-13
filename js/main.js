document.addEventListener('DOMContentLoaded', () => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const elementsToReveal = document.querySelectorAll('.fade-in-up');

    if (!prefersReducedMotion && elementsToReveal.length) {
        const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    obs.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -10% 0px'
        });

        elementsToReveal.forEach(element => observer.observe(element));
        } else {
        elementsToReveal.forEach(element => element.classList.add('is-visible'));
            }

    const makeExternalLinksAccessible = () => {
        const links = document.querySelectorAll('a[target="_blank"]');
        links.forEach(link => {
            if (!link.hasAttribute('rel')) {
                link.setAttribute('rel', 'noopener noreferrer');
            }
            if (!link.querySelector('.sr-only')) {
                const hint = document.createElement('span');
                hint.className = 'sr-only';
                hint.textContent = ' (ouverture dans un nouvel onglet)';
                link.appendChild(hint);
            }
        });
    };

    makeExternalLinksAccessible();
        });
