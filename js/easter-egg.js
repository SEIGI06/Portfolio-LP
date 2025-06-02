// Configuration de l'easter egg
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;
let touchSequence = [];
let lastTapTime = 0;
let tapCount = 0;

// Gestionnaire pour PC
document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            activateEasterEgg();
        }
    } else {
        konamiIndex = 0;
    }
});

// Détection sur mobile
let lastTap = 0;
const DOUBLE_TAP_DELAY = 300; // Délai maximum entre les taps en millisecondes

document.addEventListener('touchstart', function(e) {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTap;
    
    if (tapLength < DOUBLE_TAP_DELAY && tapLength > 0) {
        tapCount++;
        if (tapCount === 2) { // Double tap détecté
            activateEasterEgg();
            tapCount = 0;
        }
    } else {
        tapCount = 1;
    }
    
    lastTap = currentTime;
});

function activateEasterEgg() {
    // Animation de transition
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: #000;
        opacity: 0;
        transition: opacity 0.5s;
        z-index: 9999;
    `;
    document.body.appendChild(overlay);
    
    // Animation de fondu
    setTimeout(() => {
        overlay.style.opacity = '1';
        setTimeout(() => {
            window.location.href = 'jeux.html';
        }, 500);
    }, 0);
}

// Réinitialisation des séquences
setInterval(() => {
    if (new Date().getTime() - lastTapTime > 2000) {
        tapCount = 0;
        touchSequence = [];
    }
}, 2000); 