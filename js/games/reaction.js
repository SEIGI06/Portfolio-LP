const reactionArea = document.getElementById('reactionArea');
const lastTimeElement = document.getElementById('lastTime');
const averageTimeElement = document.getElementById('averageTime');
const bestTimeElement = document.getElementById('bestTime');

let startTime;
let waitingForGreen = false;
let times = [];
let bestTime = Infinity;

function getRandomDelay() {
    // Délai aléatoire entre 1 et 5 secondes
    return Math.floor(Math.random() * 4000) + 1000;
}

function startTest() {
    if (waitingForGreen) return;
    
    // Écran rouge
    reactionArea.style.backgroundColor = 'red';
    reactionArea.textContent = 'Attendez le vert...';
    waitingForGreen = true;
    
    // Délai aléatoire avant de passer au vert
    setTimeout(() => {
        if (!waitingForGreen) return;
        
        // Écran vert
        reactionArea.style.backgroundColor = 'green';
        reactionArea.textContent = 'CLIQUEZ !';
        startTime = Date.now();
    }, getRandomDelay());
}

function handleClick() {
    if (!waitingForGreen) {
        startTest();
        return;
    }
    
    if (reactionArea.style.backgroundColor === 'green') {
        const reactionTime = Date.now() - startTime;
        times.push(reactionTime);
        
        // Mettre à jour le meilleur temps
        if (reactionTime < bestTime) {
            bestTime = reactionTime;
            bestTimeElement.textContent = bestTime;
        }
        
        // Mettre à jour le dernier temps
        lastTimeElement.textContent = reactionTime;
        
        // Calculer et mettre à jour la moyenne
        const average = Math.round(times.reduce((a, b) => a + b, 0) / times.length);
        averageTimeElement.textContent = average;
        
        // Réinitialiser pour le prochain test
        reactionArea.style.backgroundColor = '';
        reactionArea.textContent = 'Cliquez pour recommencer';
        waitingForGreen = false;
    } else {
        // Cliqué trop tôt
        reactionArea.style.backgroundColor = '';
        reactionArea.textContent = 'Trop tôt ! Cliquez pour recommencer';
        waitingForGreen = false;
    }
}

// Ajouter les écouteurs d'événements
reactionArea.addEventListener('click', handleClick);

// Démarrer le premier test
startTest(); 