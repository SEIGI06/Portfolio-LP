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

// Gestionnaire pour mobile
document.addEventListener('touchstart', (e) => {
    const currentTime = new Date().getTime();
    const tapLength = currentTime - lastTapTime;
    
    if (tapLength < 500 && tapLength > 0) {
        tapCount++;
        if (tapCount === 5) {
            // Après 5 tap rapides, vérifier le swipe
            checkSwipeSequence();
        }
    } else {
        tapCount = 1;
    }
    lastTapTime = currentTime;
});

let touchStartX = 0;
let touchStartY = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
});

document.addEventListener('touchend', (e) => {
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    if (Math.abs(deltaX) > 50 || Math.abs(deltaY) > 50) {
        const direction = Math.abs(deltaX) > Math.abs(deltaY) 
            ? (deltaX > 0 ? 'right' : 'left')
            : (deltaY > 0 ? 'down' : 'up');
            
        touchSequence.push(direction);
        if (touchSequence.length > 4) {
            touchSequence.shift();
        }
        
        checkSwipeSequence();
    }
});

function checkSwipeSequence() {
    const correctSequence = ['up', 'up', 'down', 'down', 'left', 'right', 'left', 'right'];
    const sequenceString = touchSequence.join(',');
    const correctString = correctSequence.join(',');
    
    if (sequenceString === correctString) {
        activateEasterEgg();
    }
}

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