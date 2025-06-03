document.addEventListener('DOMContentLoaded', () => {
    // Animation au défilement avec respect des préférences de réduction de mouvement
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);

    // Observer toutes les sections
    document.querySelectorAll('.section').forEach(section => {
        observer.observe(section);
    });

    // Navigation fluide avec respect des préférences de réduction de mouvement
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: prefersReducedMotion ? 'auto' : 'smooth'
                });
                // Mettre à jour l'URL sans déclencher de défilement
                history.pushState(null, '', this.getAttribute('href'));
            }
        });
    });

    // Filtrage des projets avec support du clavier
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => updateFilter(button));
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                updateFilter(button);
            }
        });
    });

    function updateFilter(selectedButton) {
        // Mettre à jour les boutons actifs et leur état ARIA
        filterButtons.forEach(btn => {
            btn.classList.remove('active');
            btn.setAttribute('aria-pressed', 'false');
        });
        selectedButton.classList.add('active');
        selectedButton.setAttribute('aria-pressed', 'true');

        const filter = selectedButton.getAttribute('data-filter');

        // Filtrer les projets avec animation respectant les préférences de mouvement
        projectCards.forEach(card => {
            if (filter === 'all' || card.getAttribute('data-category') === filter) {
                card.style.display = 'flex';
                if (!prefersReducedMotion) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '1';
                    card.style.transform = 'none';
                }
            } else {
                if (!prefersReducedMotion) {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                } else {
                    card.style.display = 'none';
                }
            }
        });

        // Annoncer le changement aux lecteurs d'écran
        const filterStatus = document.getElementById('filter-status') || document.createElement('div');
        filterStatus.id = 'filter-status';
        filterStatus.setAttribute('role', 'status');
        filterStatus.setAttribute('aria-live', 'polite');
        filterStatus.className = 'sr-only';
        filterStatus.textContent = `Projets filtrés par : ${selectedButton.textContent}`;
        document.body.appendChild(filterStatus);
    }

    // Animation des cartes au chargement avec respect des préférences de mouvement
    projectCards.forEach((card, index) => {
        if (!prefersReducedMotion) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * index);
        }
    });

    // Veille Technologique
    document.addEventListener('DOMContentLoaded', () => {
        // Animation des cartes au défilement
        const veilleObserverOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const veilleObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    veilleObserver.unobserve(entry.target);
                }
            });
        }, veilleObserverOptions);

        // Observer les éléments de la page de veille
        document.querySelectorAll('.veille-card, .tool-item, .topic-item, .article-item').forEach(el => {
            veilleObserver.observe(el);
        });

        // Filtrage des articles par catégorie
        const veilleFilterButtons = document.querySelectorAll('.filter-btn');
        const veilleArticles = document.querySelectorAll('.article-item');

        veilleFilterButtons.forEach(button => {
            button.addEventListener('click', () => {
                const category = button.dataset.category;
                
                // Mise à jour des boutons actifs
                veilleFilterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');

                // Filtrage des articles
                veilleArticles.forEach(article => {
                    if (category === 'all' || article.dataset.category === category) {
                        article.style.display = 'block';
                        setTimeout(() => article.classList.add('fade-in'), 50);
                    } else {
                        article.style.display = 'none';
                        article.classList.remove('fade-in');
                    }
                });
            });
        });

        // Animation des liens d'articles
        document.querySelectorAll('.article-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const url = link.href;
                
                // Animation de transition
                link.classList.add('clicked');
                setTimeout(() => {
                    window.location.href = url;
                }, 300);
            });
        });
    });

    // Parcours Animations
    document.addEventListener('DOMContentLoaded', () => {
        // Animation de la timeline
        const timelineItems = document.querySelectorAll('.timeline-item');
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });

        // Animation des compétences
        const skillCategories = document.querySelectorAll('.skill-category');
        const skillsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                    skillsObserver.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        skillCategories.forEach(category => {
            skillsObserver.observe(category);
        });

        // Animation des badges
        const badges = document.querySelectorAll('.card__badge');
        badges.forEach(badge => {
            badge.addEventListener('mouseenter', () => {
                badge.style.transform = 'scale(1.1)';
            });
            badge.addEventListener('mouseleave', () => {
                badge.style.transform = 'scale(1)';
            });
        });
    });

    // Scroll Indicator and Section Navigation avec support du clavier
    const scrollIndicator = document.createElement('div');
    scrollIndicator.className = 'scroll-indicator';
    scrollIndicator.setAttribute('role', 'button');
    scrollIndicator.setAttribute('tabindex', '0');
    scrollIndicator.setAttribute('aria-label', 'Défiler vers le contenu principal');
    scrollIndicator.innerHTML = `
        <span class="scroll-indicator__text">Défiler</span>
        <div class="scroll-indicator__icon" aria-hidden="true"></div>
    `;
    document.body.appendChild(scrollIndicator);

    const sectionNav = document.createElement('nav');
    sectionNav.className = 'section-nav';
    sectionNav.setAttribute('aria-label', 'Navigation entre les sections');
    document.body.appendChild(sectionNav);

    const sections = document.querySelectorAll('.section');
    
    sections.forEach((section, index) => {
        const dot = document.createElement('button');
        dot.className = 'section-nav__dot';
        dot.setAttribute('data-section', section.id);
        dot.setAttribute('aria-label', section.querySelector('.section-title')?.textContent || `Section ${index + 1}`);
        dot.setAttribute('aria-current', 'false');
        sectionNav.appendChild(dot);

        dot.addEventListener('click', () => {
            section.scrollIntoView({ 
                behavior: prefersReducedMotion ? 'auto' : 'smooth' 
            });
        });

        dot.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                section.scrollIntoView({ 
                    behavior: prefersReducedMotion ? 'auto' : 'smooth' 
                });
            }
        });
    });

    let lastScrollTop = 0;
    const scrollHandler = () => {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 300) {
            scrollIndicator.classList.add('hidden');
        } else {
            scrollIndicator.classList.remove('hidden');
        }

        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            const dot = document.querySelector(`.section-nav__dot[data-section="${section.id}"]`);
            
            if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
                dot?.classList.add('active');
                dot?.setAttribute('aria-current', 'true');
            } else {
                dot?.classList.remove('active');
                dot?.setAttribute('aria-current', 'false');
            }
        });

        lastScrollTop = scrollTop;
    };

    // Utiliser requestAnimationFrame pour optimiser les performances
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                scrollHandler();
                ticking = false;
            });
            ticking = true;
        }
    });

    scrollIndicator.addEventListener('click', () => {
        const firstSection = sections[0];
        if (firstSection) {
            firstSection.scrollIntoView({ 
                behavior: prefersReducedMotion ? 'auto' : 'smooth' 
            });
        }
    });

    scrollIndicator.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            const firstSection = sections[0];
            if (firstSection) {
                firstSection.scrollIntoView({ 
                    behavior: prefersReducedMotion ? 'auto' : 'smooth' 
                });
            }
        }
    });

    sections.forEach(section => {
        const title = section.querySelector('.section-title');
        if (title) {
            const floatingTitle = document.createElement('div');
            floatingTitle.className = 'floating-title';
            floatingTitle.textContent = title.textContent;
            section.appendChild(floatingTitle);
        }
    });

    // Enhanced Navigation
    document.addEventListener('DOMContentLoaded', () => {
        // Créer la barre de progression
        const progressBar = document.createElement('div');
        progressBar.className = 'scroll-progress';
        document.body.appendChild(progressBar);

        // Créer le menu flottant
        const floatingNav = document.createElement('nav');
        floatingNav.className = 'floating-nav';
        floatingNav.innerHTML = `
            <div class="floating-nav__container">
                <a href="/" class="floating-nav__logo">Portfolio</a>
                <div class="floating-nav__links">
                    <a href="#projets" class="floating-nav__link">Projets</a>
                    <a href="#certifications" class="floating-nav__link">Certifications</a>
                    <a href="#veille" class="floating-nav__link">Veille</a>
                    <a href="#parcours" class="floating-nav__link">Parcours</a>
                </div>
            </div>
        `;
        document.body.appendChild(floatingNav);

        // Créer les actions rapides
        const quickActions = document.createElement('div');
        quickActions.className = 'quick-actions';
        quickActions.innerHTML = `
            <button class="quick-action-btn" id="theme-toggle" title="Changer le thème">🌓</button>
            <button class="quick-action-btn" id="scroll-top" title="Retour en haut">↑</button>
        `;
        document.body.appendChild(quickActions);

        // Gérer le défilement et la visibilité des éléments
        let lastScrollTop = 0;
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / scrollHeight) * 100;

            // Mettre à jour la barre de progression
            progressBar.style.transform = `scaleX(${scrollPercent / 100})`;

            // Gérer la visibilité du menu flottant
            if (scrollTop > 300) {
                floatingNav.classList.add('visible');
            } else {
                floatingNav.classList.remove('visible');
            }

            // Mettre à jour les liens actifs
            document.querySelectorAll('.floating-nav__link').forEach(link => {
                const section = document.querySelector(link.getAttribute('href'));
                if (section) {
                    const rect = section.getBoundingClientRect();
                    if (rect.top <= 100 && rect.bottom >= 100) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                }
            });

            // Gérer le bouton de retour en haut
            const scrollTopBtn = document.getElementById('scroll-top');
            if (scrollTop > 500) {
                scrollTopBtn.style.display = 'flex';
            } else {
                scrollTopBtn.style.display = 'none';
            }

            lastScrollTop = scrollTop;
        });

        // Gérer le clic sur le bouton de retour en haut
        document.getElementById('scroll-top').addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });

        // Gérer le clic sur les liens du menu flottant
        document.querySelectorAll('.floating-nav__link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const target = document.querySelector(link.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });

        // Ajouter des tooltips aux boutons d'action rapide
        const tooltips = document.querySelectorAll('.quick-action-btn');
        tooltips.forEach(btn => {
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = btn.getAttribute('title');
            btn.appendChild(tooltip);

            btn.addEventListener('mouseenter', () => {
                tooltip.style.opacity = '1';
                tooltip.style.visibility = 'visible';
            });

            btn.addEventListener('mouseleave', () => {
                tooltip.style.opacity = '0';
                tooltip.style.visibility = 'hidden';
            });
        });
    });
}); 