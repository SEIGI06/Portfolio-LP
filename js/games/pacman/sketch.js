// Constantes du jeu
const CELL_SIZE = 20;
const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;
const GAME_WIDTH = CELL_SIZE * GRID_WIDTH;
const GAME_HEIGHT = CELL_SIZE * GRID_HEIGHT;

// Variables globales
let pacman;
let ghosts = [];
let dots = [];
let walls = [];
let powerUps = [];
let score = 0;
let lives = 3;
let gameOver = false;
let gameStarted = false;

// Couleurs
const COLORS = {
    WALL: '#2121DE',
    DOT: '#FFB897',
    POWER_UP: '#FFFFFF',
    GHOST_RED: '#FF0000',
    GHOST_PINK: '#FFB8FF',
    GHOST_CYAN: '#00FFFF',
    GHOST_ORANGE: '#FFB852',
    GHOST_FRIGHTENED: '#2121DE',
    PACMAN: '#FFFF00'
};

// Configuration initiale
function setup() {
    createCanvas(GAME_WIDTH, GAME_HEIGHT);
    frameRate(60);
    initializeGame();
}

// Boucle principale
function draw() {
    background(0);
    
    if (!gameStarted) {
        drawStartScreen();
        return;
    }
    
    if (gameOver) {
        drawGameOver();
        return;
    }
    
    updateGame();
    drawGame();
}

// Initialisation du jeu
function initializeGame() {
    // Créer Pacman
    pacman = new Pacman(14 * CELL_SIZE, 23 * CELL_SIZE);
    
    // Créer les fantômes
    ghosts = [
        new Ghost(13 * CELL_SIZE, 11 * CELL_SIZE, COLORS.GHOST_RED, 'red'),
        new Ghost(14 * CELL_SIZE, 11 * CELL_SIZE, COLORS.GHOST_PINK, 'pink'),
        new Ghost(13 * CELL_SIZE, 12 * CELL_SIZE, COLORS.GHOST_CYAN, 'cyan'),
        new Ghost(14 * CELL_SIZE, 12 * CELL_SIZE, COLORS.GHOST_ORANGE, 'orange')
    ];
    
    // Créer les murs
    createWalls();
    
    // Créer les points
    createDots();
    
    // Créer les power-ups
    createPowerUps();
}

// Création des murs
function createWalls() {
    // Murs extérieurs
    for (let x = 0; x < GRID_WIDTH; x++) {
        walls.push(new Wall(x * CELL_SIZE, 0, CELL_SIZE, CELL_SIZE));
        walls.push(new Wall(x * CELL_SIZE, (GRID_HEIGHT - 1) * CELL_SIZE, CELL_SIZE, CELL_SIZE));
    }
    for (let y = 0; y < GRID_HEIGHT; y++) {
        walls.push(new Wall(0, y * CELL_SIZE, CELL_SIZE, CELL_SIZE));
        walls.push(new Wall((GRID_WIDTH - 1) * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE));
    }
    
    // Définition du labyrinthe
    const maze = [
        // En haut à gauche
        {x: 2, y: 2, w: 5, h: 1},
        {x: 2, y: 3, w: 1, h: 5},
        {x: 5, y: 3, w: 1, h: 2},
        
        // En haut à droite
        {x: 21, y: 2, w: 5, h: 1},
        {x: 25, y: 3, w: 1, h: 5},
        {x: 22, y: 3, w: 1, h: 2},
        
        // En bas à gauche
        {x: 2, y: 24, w: 5, h: 1},
        {x: 2, y: 23, w: 1, h: 5},
        {x: 5, y: 24, w: 1, h: 2},
        
        // En bas à droite
        {x: 21, y: 24, w: 5, h: 1},
        {x: 25, y: 23, w: 1, h: 5},
        {x: 22, y: 24, w: 1, h: 2},
        
        // Murs centraux
        {x: 11, y: 2, w: 6, h: 1},
        {x: 11, y: 3, w: 1, h: 5},
        {x: 16, y: 3, w: 1, h: 5},
        
        // Murs du milieu
        {x: 11, y: 8, w: 6, h: 1},
        {x: 11, y: 9, w: 1, h: 2},
        {x: 16, y: 9, w: 1, h: 2},
        
        // Murs du bas
        {x: 11, y: 24, w: 6, h: 1},
        {x: 11, y: 22, w: 1, h: 2},
        {x: 16, y: 22, w: 1, h: 2},
        
        // Murs verticaux centraux
        {x: 11, y: 11, w: 1, h: 3},
        {x: 16, y: 11, w: 1, h: 3},
        
        // Murs horizontaux centraux
        {x: 11, y: 14, w: 6, h: 1},
        {x: 11, y: 15, w: 1, h: 2},
        {x: 16, y: 15, w: 1, h: 2},
        
        // Murs de la cage des fantômes
        {x: 11, y: 17, w: 6, h: 1},
        {x: 11, y: 18, w: 1, h: 1},
        {x: 16, y: 18, w: 1, h: 1},
        {x: 12, y: 19, w: 4, h: 1},
        
        // Tunnels
        {x: 0, y: 14, w: 1, h: 1},
        {x: 27, y: 14, w: 1, h: 1}
    ];
    
    maze.forEach(wall => {
        for (let x = wall.x; x < wall.x + wall.w; x++) {
            for (let y = wall.y; y < wall.y + wall.h; y++) {
                walls.push(new Wall(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE));
            }
        }
    });
}

// Création des points
function createDots() {
    for (let x = 1; x < GRID_WIDTH - 1; x++) {
        for (let y = 1; y < GRID_HEIGHT - 1; y++) {
            // Vérifier si la position n'est pas un mur
            if (!isWall(x * CELL_SIZE, y * CELL_SIZE)) {
                dots.push(new Dot(x * CELL_SIZE, y * CELL_SIZE));
            }
        }
    }
}

// Création des power-ups
function createPowerUps() {
    const powerUpPositions = [
        {x: 2, y: 2},
        {x: GRID_WIDTH - 3, y: 2},
        {x: 2, y: GRID_HEIGHT - 3},
        {x: GRID_WIDTH - 3, y: GRID_HEIGHT - 3}
    ];
    
    powerUpPositions.forEach(pos => {
        if (!isWall(pos.x * CELL_SIZE, pos.y * CELL_SIZE)) {
            powerUps.push(new PowerUp(pos.x * CELL_SIZE, pos.y * CELL_SIZE));
        }
    });
}

// Vérification des collisions avec les murs
function isWall(x, y) {
    return walls.some(wall => 
        x >= wall.x && x < wall.x + wall.w &&
        y >= wall.y && y < wall.y + wall.h
    );
}

// Mise à jour du jeu
function updateGame() {
    pacman.update();
    ghosts.forEach(ghost => ghost.update());
    checkCollisions();
}

// Vérification des collisions
function checkCollisions() {
    // Collision avec les points
    dots = dots.filter(dot => {
        if (!dot.collected && dist(pacman.x, pacman.y, dot.x, dot.y) < CELL_SIZE/2) {
            score += 10;
            return false;
        }
        return true;
    });
    
    // Collision avec les power-ups
    powerUps = powerUps.filter(powerUp => {
        if (!powerUp.collected && dist(pacman.x, pacman.y, powerUp.x, powerUp.y) < CELL_SIZE/2) {
            score += 50;
            ghosts.forEach(ghost => ghost.setFrightened());
            return false;
        }
        return true;
    });
    
    // Collision avec les fantômes
    ghosts.forEach(ghost => {
        if (dist(pacman.x, pacman.y, ghost.x, ghost.y) < CELL_SIZE) {
            if (ghost.isFrightened) {
                ghost.reset();
                score += 200;
            } else {
                lives--;
                if (lives <= 0) {
                    gameOver = true;
                } else {
                    resetPositions();
                }
            }
        }
    });
    
    // Vérifier si tous les points sont collectés
    if (dots.length === 0) {
        createDots();
        createPowerUps();
    }
}

// Réinitialisation des positions
function resetPositions() {
    pacman.reset();
    ghosts.forEach(ghost => ghost.reset());
}

// Dessin du jeu
function drawGame() {
    // Dessiner les murs
    walls.forEach(wall => wall.draw());
    
    // Dessiner les points
    dots.forEach(dot => dot.draw());
    
    // Dessiner les power-ups
    powerUps.forEach(powerUp => powerUp.draw());
    
    // Dessiner les fantômes
    ghosts.forEach(ghost => ghost.draw());
    
    // Dessiner Pacman
    pacman.draw();
    
    // Dessiner le score et les vies
    drawHUD();
}

// Dessin du HUD
function drawHUD() {
    fill(255);
    textSize(16);
    textAlign(LEFT);
    text(`Score: ${score}`, 10, 20);
    text(`Lives: ${lives}`, 10, 40);
}

// Écran de démarrage
function drawStartScreen() {
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('PACMAN', width/2, height/2 - 40);
    textSize(16);
    text('Press SPACE to start', width/2, height/2 + 20);
}

// Écran de game over
function drawGameOver() {
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width/2, height/2 - 40);
    textSize(16);
    text(`Final Score: ${score}`, width/2, height/2 + 20);
    text('Press SPACE to restart', width/2, height/2 + 60);
}

// Gestion des touches
function keyPressed() {
    if (keyCode === 32) { // SPACE
        if (!gameStarted) {
            gameStarted = true;
        } else if (gameOver) {
            gameOver = false;
            score = 0;
            lives = 3;
            initializeGame();
        }
    }
    
    if (gameStarted && !gameOver) {
        pacman.handleKeyPress(keyCode);
    }
}

// Classe Pacman
class Pacman {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.speed = 3;
        this.direction = 0;
        this.mouthOpen = 0;
        this.mouthSpeed = 0.1;
        this.nextDirection = null;
    }
    
    update() {
        // Animation de la bouche
        this.mouthOpen += this.mouthSpeed;
        if (this.mouthOpen > 0.5 || this.mouthOpen < 0) {
            this.mouthSpeed = -this.mouthSpeed;
        }
        
        // Mouvement
        let nextX = this.x;
        let nextY = this.y;
        
        if (this.direction === 0) nextX += this.speed; // droite
        else if (this.direction === PI) nextX -= this.speed; // gauche
        else if (this.direction === -PI/2) nextY -= this.speed; // haut
        else if (this.direction === PI/2) nextY += this.speed; // bas
        
        // Vérifier les collisions avec les murs
        if (!isWall(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }
        
        // Gestion des tunnels
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
    }
    
    draw() {
        push();
        translate(this.x, this.y);
        rotate(this.direction);
        
        // Corps de Pacman
        fill(COLORS.PACMAN);
        arc(0, 0, CELL_SIZE, CELL_SIZE, this.mouthOpen, 2*PI - this.mouthOpen);
        
        pop();
    }
    
    handleKeyPress(keyCode) {
        if (keyCode === RIGHT_ARROW) this.direction = 0;
        else if (keyCode === LEFT_ARROW) this.direction = PI;
        else if (keyCode === UP_ARROW) this.direction = -PI/2;
        else if (keyCode === DOWN_ARROW) this.direction = PI/2;
    }
    
    reset() {
        this.x = 14 * CELL_SIZE;
        this.y = 23 * CELL_SIZE;
        this.direction = 0;
    }
}

// Classe Ghost
class Ghost {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;
        this.speed = 2;
        this.direction = 0;
        this.isFrightened = false;
        this.frightenedTimer = 0;
        this.mode = 'scatter'; // 'scatter', 'chase', 'frightened'
        this.scatterTimer = 0;
    }
    
    update() {
        if (this.isFrightened) {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.isFrightened = false;
                this.speed = 2;
            }
        }
        
        // Logique de mouvement basée sur le type de fantôme
        let targetX = pacman.x;
        let targetY = pacman.y;
        
        switch(this.type) {
            case 'red': // Blinky
                // Suit directement Pacman
                break;
            case 'pink': // Pinky
                // Vise 4 cases devant Pacman
                targetX = pacman.x + cos(pacman.direction) * 4 * CELL_SIZE;
                targetY = pacman.y + sin(pacman.direction) * 4 * CELL_SIZE;
                break;
            case 'cyan': // Inky
                // Utilise la position de Blinky
                const blinky = ghosts.find(g => g.type === 'red');
                targetX = blinky.x + (pacman.x - blinky.x) * 2;
                targetY = blinky.y + (pacman.y - blinky.y) * 2;
                break;
            case 'orange': // Clyde
                // S'éloigne si trop proche
                const distance = dist(this.x, this.y, pacman.x, pacman.y);
                if (distance < 8 * CELL_SIZE) {
                    targetX = 0;
                    targetY = height;
                }
                break;
        }
        
        // Calculer la direction vers la cible
        const angle = atan2(targetY - this.y, targetX - this.x);
        
        // Mouvement
        let nextX = this.x + cos(angle) * this.speed;
        let nextY = this.y + sin(angle) * this.speed;
        
        if (!isWall(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }
        
        // Gestion des tunnels
        if (this.x < 0) this.x = width;
        if (this.x > width) this.x = 0;
    }
    
    draw() {
        push();
        translate(this.x, this.y);
        
        // Corps du fantôme
        fill(this.isFrightened ? COLORS.GHOST_FRIGHTENED : this.color);
        beginShape();
        vertex(-CELL_SIZE/2, -CELL_SIZE/2);
        vertex(CELL_SIZE/2, -CELL_SIZE/2);
        vertex(CELL_SIZE/2, 0);
        vertex(CELL_SIZE/4, CELL_SIZE/2);
        vertex(0, CELL_SIZE/4);
        vertex(-CELL_SIZE/4, CELL_SIZE/2);
        vertex(-CELL_SIZE/2, 0);
        endShape(CLOSE);
        
        // Yeux
        fill(255);
        ellipse(-CELL_SIZE/4, -CELL_SIZE/4, CELL_SIZE/4, CELL_SIZE/4);
        ellipse(CELL_SIZE/4, -CELL_SIZE/4, CELL_SIZE/4, CELL_SIZE/4);
        
        pop();
    }
    
    setFrightened() {
        this.isFrightened = true;
        this.frightenedTimer = 300; // 5 secondes à 60 FPS
        this.speed = 1;
    }
    
    reset() {
        this.x = 13 * CELL_SIZE;
        this.y = 11 * CELL_SIZE;
        this.isFrightened = false;
        this.speed = 2;
    }
}

// Classe Wall
class Wall {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
    }
    
    draw() {
        fill(COLORS.WALL);
        rect(this.x, this.y, this.w, this.h);
    }
}

// Classe Dot
class Dot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.collected = false;
    }
    
    draw() {
        if (!this.collected) {
            fill(COLORS.DOT);
            ellipse(this.x, this.y, CELL_SIZE/4, CELL_SIZE/4);
        }
    }
}

// Classe PowerUp
class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.collected = false;
    }
    
    draw() {
        if (!this.collected) {
            fill(COLORS.POWER_UP);
            ellipse(this.x, this.y, CELL_SIZE/2, CELL_SIZE/2);
        }
    }
} 