document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner les éléments qui auront l'effet de parallaxe
    const parallaxElements = document.querySelectorAll('.parallax');
    
    // Fonction pour appliquer l'effet de parallaxe
    function applyParallax() {
        parallaxElements.forEach(element => {
            const speed = element.dataset.speed || 0.5; // Vitesse de déplacement (0.5 par défaut)
            const yPos = -(window.pageYOffset * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Écouter l'événement de défilement
    window.addEventListener('scroll', applyParallax);
    
    // Appliquer l'effet au chargement initial
    applyParallax();
}); 