// Script pour forcer le rechargement du cache à chaque fois que la page est rechargée
window.addEventListener('load', function() {
    // Vérifier si le navigateur supporte le service worker
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.getRegistrations().then(function(registrations) {
            for(let registration of registrations) {
                registration.unregister();
            }
        });
    }

    // Forcer le rechargement des ressources
    const resources = document.querySelectorAll('link[rel="stylesheet"], script[src], img[src]');
    resources.forEach(resource => {
        if (resource.href || resource.src) {
            const url = new URL(resource.href || resource.src);
            url.searchParams.set('v', new Date().getTime());
            if (resource.href) {
                resource.href = url.toString();
            } else {
                resource.src = url.toString();
            }
        }
    });
}); 