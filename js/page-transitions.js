// Gestionnaire de transitions entre les pages
document.addEventListener('DOMContentLoaded', () => {
    // Créer l'élément de transition
    const transition = document.createElement('div');
    transition.className = 'page-transition';
    document.body.appendChild(transition);

    // Ajouter la classe page-content à tous les éléments principaux
    const mainContent = document.querySelector('main');
    if (mainContent) {
        mainContent.classList.add('page-content');
    }

    // Gérer les clics sur les liens
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (link && link.href && link.href.startsWith(window.location.origin) && !link.target) {
            e.preventDefault();
            const targetUrl = link.href;

            // Ajouter la classe fade-out au contenu
            mainContent.classList.add('fade-out');

            // Attendre un peu avant de lancer l'animation de transition
            setTimeout(() => {
                transition.classList.add('active');
            }, 200);

            // Attendre que l'animation soit terminée
            setTimeout(() => {
                window.location.href = targetUrl;
            }, 800);
        }
    });

    // Animation d'entrée lors du chargement de la page
    window.addEventListener('load', () => {
        // Attendre que la page soit complètement chargée
        setTimeout(() => {
            transition.classList.add('exit');
            setTimeout(() => {
                transition.classList.remove('active', 'exit');
            }, 800);
        }, 100);
    });
}); 