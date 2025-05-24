// Création du bouton Pacman
const pacmanButton = document.createElement('button');
pacmanButton.innerHTML = '🎮';
pacmanButton.className = 'pacman-button';
pacmanButton.setAttribute('aria-label', 'Jouer à Pacman');
document.body.appendChild(pacmanButton);

// Création de la fenêtre du jeu
const gameWindow = document.createElement('div');
gameWindow.className = 'game-window';
gameWindow.style.display = 'none';
document.body.appendChild(gameWindow);

// Création du message de chargement
const loadingMessage = document.createElement('div');
loadingMessage.className = 'loading-message';
loadingMessage.textContent = 'Chargement du jeu...';
gameWindow.appendChild(loadingMessage);

// Création de l'iframe pour le jeu
const gameFrame = document.createElement('iframe');
gameFrame.src = 'js/games/pacman/index.html';
gameFrame.style.width = '100%';
gameFrame.style.height = '100%';
gameFrame.style.border = 'none';
gameWindow.appendChild(gameFrame);

// Gestion du clic sur le bouton
pacmanButton.addEventListener('click', () => {
    if (gameWindow.style.display === 'none') {
        gameWindow.style.display = 'block';
        loadingMessage.style.display = 'block';
        
        // Réinitialiser l'iframe
        gameFrame.src = 'js/games/pacman/index.html';
        
        // Attendre que l'iframe soit chargé
        gameFrame.onload = () => {
            loadingMessage.style.display = 'none';
            gameFrame.contentWindow.focus();
            // Empêcher le défilement de la page
            document.body.style.overflow = 'hidden';
        };
    } else {
        gameWindow.style.display = 'none';
        // Réactiver le défilement de la page
        document.body.style.overflow = 'auto';
    }
});

// Empêcher la propagation des événements clavier sur la page principale
document.addEventListener('keydown', (e) => {
    if (gameWindow.style.display === 'block') {
        // Si la fenêtre du jeu est ouverte, empêcher la propagation des touches
        if ([32, 37, 38, 39, 40].includes(e.keyCode)) {
            e.preventDefault();
            e.stopPropagation();
        }
    }
}, true);

// Styles CSS
const styles = `
    .pacman-button {
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        background-color: #4CAF50;
        color: white;
        border: none;
        cursor: pointer;
        font-size: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 2px 5px rgba(0,0,0,0.2);
        z-index: 1000;
        transition: transform 0.2s;
    }

    .pacman-button:hover {
        transform: scale(1.1);
    }

    .game-window {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 560px;
        height: 620px;
        background-color: #000;
        border: 2px solid #2121DE;
        box-shadow: 0 0 20px rgba(33, 33, 222, 0.5);
        z-index: 999;
    }

    .game-window iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #000;
    }

    .loading-message {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        color: #FFB897;
        font-size: 24px;
        font-family: Arial, sans-serif;
        text-align: center;
        z-index: 1000;
    }
`;

// Ajout des styles
const styleSheet = document.createElement('style');
styleSheet.textContent = styles;
document.head.appendChild(styleSheet); 