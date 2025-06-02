const reactionArea = document.getElementById('reactionArea');
const lastTimeElement = document.getElementById('lastTime');
const averageTimeElement = document.getElementById('averageTime');
const bestTimeElement = document.getElementById('bestTime');

let startTime;
let waitingForGreen = false;
let times = [];
let bestTime = Infinity;

// Configuration du graphique
const ctx = document.getElementById('reactionChart').getContext('2d');
const reactionChart = new Chart(ctx, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Temps de réaction (ms)',
            data: [],
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76, 175, 80, 0.1)',
            tension: 0.4,
            fill: true
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true,
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'white'
                }
            },
            x: {
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)'
                },
                ticks: {
                    color: 'white'
                }
            }
        },
        plugins: {
            legend: {
                labels: {
                    color: 'white'
                }
            }
        }
    }
});

function getRandomDelay() {
    // Délai aléatoire entre 1 et 5 secondes
    return Math.floor(Math.random() * 4000) + 1000;
}

function updateChart() {
    reactionChart.data.labels = times.map((_, index) => index + 1);
    reactionChart.data.datasets[0].data = times;
    reactionChart.update();
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
        
        updateChart();
        
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