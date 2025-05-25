document.addEventListener('DOMContentLoaded', () => {
    // Sélectionner tous les éléments qui doivent apparaître
    const elements = document.querySelectorAll('.reveal');
    
    // Options pour l'Intersection Observer
    const options = {
        root: null, // viewport
        threshold: 0.1, // déclencher quand 10% de l'élément est visible
        rootMargin: '0px'
    };

    // Fonction appelée quand un élément devient visible
    const handleIntersect = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target); // Arrêter d'observer une fois révélé
            }
        });
    };

    // Créer l'observer
    const observer = new IntersectionObserver(handleIntersect, options);

    // Observer chaque élément
    elements.forEach(element => {
        observer.observe(element);
    });
}); 