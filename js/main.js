document.addEventListener('DOMContentLoaded', () => {
    // Animation au défilement
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

    // Navigation fluide
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    // Filtrage des projets
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Mettre à jour les boutons actifs
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.getAttribute('data-filter');

            // Filtrer les projets
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Animation des cartes au chargement
    projectCards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, 100 * index);
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
}); 