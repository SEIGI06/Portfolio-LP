let buffer = '';
const targetWord = 'jeu';

document.addEventListener('keydown', function(event) {
    // Ajouter la touche pressée au buffer
    buffer += event.key.toLowerCase();
    
    // Garder seulement les 3 derniers caractères
    if (buffer.length > targetWord.length) {
        buffer = buffer.slice(-targetWord.length);
    }
    
    // Vérifier si le buffer contient le mot cible
    if (buffer === targetWord) {
        // Réinitialiser le buffer
        buffer = '';
        
        // Rediriger vers la page des jeux
        window.location.href = 'jeux.html';
    }
}); 