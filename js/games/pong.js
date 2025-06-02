// Variables du jeu
const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

const paddleHeight = 100;
const paddleWidth = 10;
let paddle1Y = canvas.height/2 - paddleHeight/2;
let paddle2Y = canvas.height/2 - paddleHeight/2;
let ballX = canvas.width/2;
let ballY = canvas.height/2;
let ballSpeedX = 5;
let ballSpeedY = 5;
let ballRadius = 10;
let score1 = 0;
let score2 = 0;
let isSoloMode = true;

// Contrôles
let wPressed = false;
let sPressed = false;
let upPressed = false;
let downPressed = false;

// Sélecteurs de mode
const soloModeBtn = document.getElementById('soloMode');
const multiModeBtn = document.getElementById('multiMode');
const player2Controls = document.getElementById('player2Controls');

soloModeBtn.addEventListener('click', function() {
    isSoloMode = true;
    soloModeBtn.classList.add('active');
    multiModeBtn.classList.remove('active');
    player2Controls.style.display = 'none';
});

multiModeBtn.addEventListener('click', function() {
    isSoloMode = false;
    multiModeBtn.classList.add('active');
    soloModeBtn.classList.remove('active');
    player2Controls.style.display = 'block';
});

document.addEventListener('keydown', function(e) {
    if(e.key === 'w') wPressed = true;
    if(e.key === 's') sPressed = true;
    if(!isSoloMode) {
        if(e.key === 'ArrowUp') upPressed = true;
        if(e.key === 'ArrowDown') downPressed = true;
    }
});

document.addEventListener('keyup', function(e) {
    if(e.key === 'w') wPressed = false;
    if(e.key === 's') sPressed = false;
    if(!isSoloMode) {
        if(e.key === 'ArrowUp') upPressed = false;
        if(e.key === 'ArrowDown') downPressed = false;
    }
});

function moveAIPaddle() {
    if(isSoloMode) {
        // Calculer la position cible de l'IA
        const paddleCenter = paddle2Y + paddleHeight/2;
        const ballCenter = ballY;
        
        // Ajouter un peu d'erreur pour rendre l'IA moins parfaite
        const error = Math.random() * 30 - 15;
        
        // Déplacer la raquette vers la balle avec une vitesse limitée
        if(paddleCenter < ballCenter + error) {
            paddle2Y = Math.min(paddle2Y + 5, canvas.height - paddleHeight);
        } else {
            paddle2Y = Math.max(paddle2Y - 5, 0);
        }
    }
}

function draw() {
    // Effacer le canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Dessiner la ligne centrale
    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.moveTo(canvas.width/2, 0);
    ctx.lineTo(canvas.width/2, canvas.height);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    
    // Dessiner les raquettes
    ctx.fillStyle = 'white';
    ctx.fillRect(0, paddle1Y, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, paddle2Y, paddleWidth, paddleHeight);
    
    // Dessiner la balle
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.closePath();
    
    // Déplacer les raquettes
    if(wPressed && paddle1Y > 0) paddle1Y -= 7;
    if(sPressed && paddle1Y < canvas.height - paddleHeight) paddle1Y += 7;
    if(!isSoloMode) {
        if(upPressed && paddle2Y > 0) paddle2Y -= 7;
        if(downPressed && paddle2Y < canvas.height - paddleHeight) paddle2Y += 7;
    }
    
    // Déplacer la raquette IA en mode solo
    moveAIPaddle();
    
    // Déplacer la balle
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    
    // Collision avec les murs haut et bas
    if(ballY - ballRadius < 0 || ballY + ballRadius > canvas.height) {
        ballSpeedY = -ballSpeedY;
    }
    
    // Collision avec les raquettes
    if(ballX - ballRadius < paddleWidth && 
       ballY > paddle1Y && 
       ballY < paddle1Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    
    if(ballX + ballRadius > canvas.width - paddleWidth && 
       ballY > paddle2Y && 
       ballY < paddle2Y + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    
    // Score et reset
    if(ballX < 0) {
        score2++;
        document.getElementById('score2').textContent = score2;
        resetBall();
    }
    if(ballX > canvas.width) {
        score1++;
        document.getElementById('score1').textContent = score1;
        resetBall();
    }
    
    requestAnimationFrame(draw);
}

function resetBall() {
    ballX = canvas.width/2;
    ballY = canvas.height/2;
    ballSpeedX = -ballSpeedX;
}

// Démarrer le jeu
draw(); 