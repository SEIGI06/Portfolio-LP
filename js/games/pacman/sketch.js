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
    score = 0;
    lives = 3;
    gameOver = false;
    walls = [];
    dots = [];
    powerUps = [];
    ghosts = [];

    // Créer les murs
    createWalls();
    
    // Créer les points
    createDots();
    
    // Créer les power-ups
    createPowerUps();

     // Créer Pacman
    pacman = new Pacman(13.5 * CELL_SIZE, 23.5 * CELL_SIZE);
    
    // Créer les fantômes
    ghosts = [
        new Ghost(13.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_RED, 'red'), // Blinky
        new Ghost(11.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_PINK, 'pink'), // Pinky
        new Ghost(15.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_CYAN, 'cyan'), // Inky
        new Ghost(13.5 * CELL_SIZE, 16.5 * CELL_SIZE, COLORS.GHOST_ORANGE, 'orange') // Clyde
    ];
}

// Création des murs
function createWalls() {
    walls = []; // Réinitialiser les murs

    // Définition du labyrinthe basée sur l'image fournie
    const maze = [
        // Murs horizontaux extérieurs
        {x: 0, y: 0, w: 28, h: 1},
        {x: 0, y: 30, w: 28, h: 1},

        // Murs verticaux extérieurs
        {x: 0, y: 1, w: 1, h: 11},
        {x: 0, y: 15, w: 1, h: 15},
        {x: 27, y: 1, w: 1, h: 11},
        {x: 27, y: 15, w: 1, h: 15},

        // Murs horizontaux intérieurs
        {x: 2, y: 2, w: 5, h: 1},
        {x: 9, y: 2, w: 4, h: 1},
        {x: 15, y: 2, w: 4, h: 1},
        {x: 21, y: 2, w: 5, h: 1},

        {x: 2, y: 5, w: 5, h: 1},
        {x: 9, y: 5, w: 2, h: 1},
        {x: 17, y: 5, w: 2, h: 1},
        {x: 21, y: 5, w: 5, h: 1},

        {x: 2, y: 8, w: 5, h: 1},
        {x: 9, y: 8, w: 4, h: 1},
        {x: 15, y: 8, w: 4, h: 1},
        {x: 21, y: 8, w: 5, h: 1},

        {x: 0, y: 11, w: 6, h: 1},
        {x: 7, y: 11, w: 5, h: 1},
        {x: 16, y: 11, w: 5, h: 1},
        {x: 22, y: 11, w: 6, h: 1},

        {x: 7, y: 17, w: 5, h: 1},
        {x: 16, y: 17, w: 5, h: 1},

        {x: 0, y: 20, w: 6, h: 1},
        {x: 7, y: 20, w: 5, h: 1},
        {x: 16, y: 20, w: 5, h: 1},
        {x: 22, y: 20, w: 6, h: 1},

        {x: 2, y: 23, w: 5, h: 1},
        {x: 9, y: 23, w: 4, h: 1},
        {x: 15, y: 23, w: 4, h: 1},
        {x: 21, y: 23, w: 5, h: 1},

        {x: 4, y: 26, w: 2, h: 1},
        {x: 9, y: 26, w: 4, h: 1},
        {x: 15, y: 26, w: 4, h: 1},
        {x: 22, y: 26, w: 2, h: 1},

        {x: 0, y: 29, w: 3, h: 1},
        {x: 25, y: 29, w: 3, h: 1},

        // Murs verticaux intérieurs
        {x: 6, y: 2, w: 1, h: 4},
        {x: 6, y: 7, w: 1, h: 5},
        {x: 6, y: 14, w: 1, h: 4},
        {x: 6, y: 19, w: 1, h: 5},
        {x: 6, y: 25, w: 1, h: 4},

        {x: 12, y: 2, w: 1, h: 4},
        {x: 12, y: 7, w: 1, h: 2},
        {x: 12, y: 10, w: 1, h: 2},
        {x: 12, y: 13, w: 1, h: 5},
        {x: 12, y: 19, w: 1, h: 5},
        {x: 12, y: 22, w: 1, h: 5},

        {x: 15, y: 2, w: 1, h: 4},
        {x: 15, y: 7, w: 1, h: 2},
        {x: 15, y: 10, w: 1, h: 2},
        {x: 15, y: 13, w: 1, h: 5},
        {x: 15, y: 19, w: 1, h: 5},
        {x: 15, y: 22, w: 1, h: 5},

        {x: 21, y: 2, w: 1, h: 4},
        {x: 21, y: 7, w: 1, h: 5},
        {x: 21, y: 14, w: 1, h: 4},
        {x: 21, y: 19, w: 1, h: 5},
        {x: 21, y: 25, w: 1, h: 4},

        {x: 3, y: 26, w: 1, h: 4},
        {x: 24, y: 26, w: 1, h: 4},

        // Cage des fantômes
        {x: 11, y: 13, w: 6, h: 1},
        {x: 11, y: 14, w: 1, h: 3},
        {x: 16, y: 14, w: 1, h: 3},
        {x: 11, y: 16, w: 6, h: 1},
        {x: 13, y: 14, w: 2, h: 1}, // Entrée de la cage (espace vide)

        // Connexions entre murs
        {x: 9, y: 5, w: 4, h: 1},
        {x: 15, y: 5, w: 4, h: 1},
        {x: 9, y: 20, w: 4, h: 1},
        {x: 15, y: 20, w: 4, h: 1},
        {x: 12, y: 8, w: 3, h: 1},
        {x: 12, y: 23, w: 3, h: 1},

        // Tunnels (visuellement des espaces sans murs - assurons qu'il n'y a pas de murs à ces positions)

    ];
    
    maze.forEach(wall => {
        for (let x = wall.x; x < wall.x + wall.w; x++) {
            for (let y = wall.y; y < wall.y + wall.h; y++) {
                walls.push(new Wall(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE));
            }
        }
    });

    // Les tunnels sont des espaces vides aux bords
    // S'assurer qu'il n'y a pas de murs aux positions des tunnels (0, 14) et (27, 14)
    walls = walls.filter(wall => 
        !(wall.x === 0 * CELL_SIZE && wall.y === 14 * CELL_SIZE) &&
        !(wall.x === 27 * CELL_SIZE && wall.y === 14 * CELL_SIZE)
    );


    // Ajuster les positions de départ si nécessaire en fonction du nouveau labyrinthe
    // Pacman: (14, 26) dans la grille originale -> (13.5 * CELL_SIZE, 26.5 * CELL_SIZE) en pixels centrés
    // Fantômes: Blinky (13.5, 14.5), Pinky (11.5, 14.5), Inky (15.5, 14.5), Clyde (13.5, 16.5) en pixels centrés

    pacman = new Pacman(13.5 * CELL_SIZE, 26.5 * CELL_SIZE); // Position approximative
    
    ghosts = [
        new Ghost(13.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_RED, 'red'), // Blinky
        new Ghost(11.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_PINK, 'pink'), // Pinky (à gauche de Blinky)
        new Ghost(15.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_CYAN, 'cyan'), // Inky (à droite de Blinky)
        new Ghost(13.5 * CELL_SIZE, 16.5 * CELL_SIZE, COLORS.GHOST_ORANGE, 'orange') // Clyde (en dessous de Blinky)
    ];

    // Supprimer les points et power-ups dans les murs de la nouvelle carte et ajuster leurs positions
    dots = [];
    powerUps = [];
    createDots(); // Recréer les points pour le nouveau labyrinthe
    createPowerUps(); // Recréer les power-ups pour le nouveau labyrinthe
}

// Création des points
function createDots() {
    dots = []; // Réinitialiser les points
    for (let x = 1; x < GRID_WIDTH - 1; x++) {
        for (let y = 1; y < GRID_HEIGHT - 1; y++) {
            const pixelX = x * CELL_SIZE + CELL_SIZE / 2; // Centrer le point dans la cellule
            const pixelY = y * CELL_SIZE + CELL_SIZE / 2; // Centrer le point dans la cellule
            // Vérifier si la position n'est pas un mur et n'est pas dans la zone des fantômes
            if (!isWall(pixelX, pixelY) && !(y >= 13 && y <= 17 && x >= 10 && x <= 17)) {
                dots.push(new Dot(pixelX, pixelY));
            }
        }
    }
}

// Création des power-ups
function createPowerUps() {
    powerUps = []; // Réinitialiser les power-ups
    const powerUpPositions = [
        {x: 1.5, y: 3.5}, // Position basée sur la grille et centrée
        {x: GRID_WIDTH - 2.5, y: 3.5},
        {x: 1.5, y: GRID_HEIGHT - 3.5},
        {x: GRID_WIDTH - 2.5, y: GRID_HEIGHT - 3.5}
    ];
    
    powerUpPositions.forEach(pos => {
         const pixelX = pos.x * CELL_SIZE; // Positionnement basé sur la grille
         const pixelY = pos.y * CELL_SIZE; // Positionnement basé sur la grille
        if (!isWall(pixelX, pixelY)) {
            powerUps.push(new PowerUp(pixelX, pixelY));
        }
    });
}

// Vérification des collisions avec les murs
function isWall(x, y) {
     return walls.some(wall => 
        x + CELL_SIZE/4 > wall.x && // Ajouter un petit offset pour la collision
        x - CELL_SIZE/4 < wall.x + wall.w &&
        y + CELL_SIZE/4 > wall.y && 
        y - CELL_SIZE/4 < wall.y + wall.h
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