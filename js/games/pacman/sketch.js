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
let ghostReleaseTimer = 180; // Timer to release ghosts after a few seconds (e.g., 3 seconds at 60 FPS)
let ghostsReleased = 0; // Counter for how many ghosts have been released

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
    ghostReleaseTimer = 180; // Reset the release timer
    ghostsReleased = 0; // Reset the released ghost counter

    // Créer les murs
    createWalls();
    
    // Créer les points
    createDots();
    
    // Créer les power-ups
    createPowerUps();

    // Créer Pacman à sa position de départ (ajustée pour être clairement hors mur)
    // Coordonnées basées sur la grille (13.5, 26.5) converties en pixels centrés
    pacman = new Pacman(13.5 * CELL_SIZE, 26.5 * CELL_SIZE);
    
    // Créer les fantômes à leurs positions de départ dans la cage
    // Coordonnées basées sur la grille et converties en pixels centrés
    ghosts = [
        new Ghost(13.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_RED, 'red'), // Blinky (dans la porte de la cage)
        new Ghost(11.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_PINK, 'pink'), // Pinky (à gauche dans la cage)
        new Ghost(15.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_CYAN, 'cyan'), // Inky (à droite dans la cage)
        new Ghost(13.5 * CELL_SIZE, 16.5 * CELL_SIZE, COLORS.GHOST_ORANGE, 'orange') // Clyde (en bas dans la cage)
    ];
    
    // Marquer les fantômes comme étant dans la cage initialement
    ghosts.forEach(ghost => ghost.inCage = true);
}

// Création des murs
function createWalls() {
    walls = []; // Réinitialiser les murs

    // Définition du labyrinthe simplifié et logique
    const mazeStructure = [
        // Cadre extérieur
        {x: 0, y: 0, w: 28, h: 1}, // Haut
        {x: 0, y: 30, w: 28, h: 1}, // Bas
        {x: 0, y: 1, w: 1, h: 14}, // Gauche (haut)
        {x: 0, y: 16, w: 1, h: 14}, // Gauche (bas)
        {x: 27, y: 1, w: 1, h: 14}, // Droite (haut)
        {x: 27, y: 16, w: 1, h: 14}, // Droite (bas)

        // Blocs supérieurs
        {x: 2, y: 2, w: 5, h: 3}, // Haut gauche
        {x: 9, y: 2, w: 4, h: 3}, // Haut milieu-gauche
        {x: 15, y: 2, w: 4, h: 3}, // Haut milieu-droite
        {x: 21, y: 2, w: 5, h: 3}, // Haut droite

        // Blocs intermédiaires
        {x: 2, y: 5, w: 5, h: 2}, // Milieu haut gauche
        {x: 9, y: 5, w: 2, h: 5}, // Milieu gauche
        {x: 17, y: 5, w: 2, h: 5}, // Milieu droite
        {x: 21, y: 5, w: 5, h: 2}, // Milieu haut droite

        // Séparateurs horizontaux
        {x: 7, y: 8, w: 2, h: 1}, // Séparateur gauche
        {x: 19, y: 8, w: 2, h: 1}, // Séparateur droite
        {x: 12, y: 8, w: 3, h: 1}, // Séparateur centre
        {x: 12, y: 17, w: 3, h: 1}, // Séparateur bas centre

        // Cage des fantômes
        {x: 11, y: 13, w: 6, h: 1}, // Barre supérieure de la cage
        {x: 11, y: 14, w: 1, h: 3}, // Barre gauche de la cage
        {x: 16, y: 14, w: 1, h: 3}, // Barre droite de la cage
        {x: 11, y: 16, w: 6, h: 1}, // Barre inférieure de la cage

        // Blocs inférieurs
        {x: 2, y: 18, w: 5, h: 3}, // Bas gauche
        {x: 9, y: 18, w: 4, h: 3}, // Bas milieu-gauche
        {x: 15, y: 18, w: 4, h: 3}, // Bas milieu-droite
        {x: 21, y: 18, w: 5, h: 3}, // Bas droite

        // Connecteurs horizontaux
        {x: 7, y: 20, w: 2, h: 1}, // Connecteur gauche
        {x: 19, y: 20, w: 2, h: 1}, // Connecteur droite
        {x: 12, y: 20, w: 3, h: 1}, // Connecteur centre

        // Structures du bas
        {x: 0, y: 22, w: 3, h: 1}, // Bas extrême gauche
        {x: 25, y: 22, w: 3, h: 1}, // Bas extrême droite
        {x: 3, y: 22, w: 1, h: 4}, // Vertical gauche
        {x: 24, y: 22, w: 1, h: 4}, // Vertical droite
        {x: 4, y: 23, w: 2, h: 1}, // Horizontal gauche
        {x: 22, y: 23, w: 2, h: 1}, // Horizontal droite

        // Structures finales
        {x: 6, y: 23, w: 1, h: 4}, // Vertical gauche bas
        {x: 21, y: 23, w: 1, h: 4}, // Vertical droite bas
        {x: 7, y: 26, w: 5, h: 1}, // Horizontal bas gauche
        {x: 16, y: 26, w: 5, h: 1}, // Horizontal bas droite

        // Barres verticales finales
        {x: 0, y: 25, w: 1, h: 5}, // Barre gauche finale
        {x: 27, y: 25, w: 1, h: 5}, // Barre droite finale
    ];

    mazeStructure.forEach(wall => {
        for (let x = wall.x; x < wall.x + wall.w; x++) {
            for (let y = wall.y; y < wall.y + wall.h; y++) {
                // Ne pas créer de mur dans l'ouverture de la cage des fantômes
                if (!((x >= 13 && x <= 14) && y === 13)) {
                    walls.push(new Wall(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE));
                }
            }
        }
    });

    // S'assurer que les tunnels sont libres
    walls = walls.filter(wall => 
        !((wall.x / CELL_SIZE === 0 || wall.x / CELL_SIZE === 27) && wall.y / CELL_SIZE === 14)
    );

    // Positions de départ
    pacman = new Pacman(13.5 * CELL_SIZE, 26.5 * CELL_SIZE);
    
    ghosts = [
        new Ghost(13.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_RED, 'red'), // Blinky (dans la porte)
        new Ghost(11.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_PINK, 'pink'), // Pinky (gauche)
        new Ghost(15.5 * CELL_SIZE, 14.5 * CELL_SIZE, COLORS.GHOST_CYAN, 'cyan'), // Inky (droite)
        new Ghost(13.5 * CELL_SIZE, 16.5 * CELL_SIZE, COLORS.GHOST_ORANGE, 'orange') // Clyde (bas)
    ];
    ghosts.forEach(ghost => ghost.inCage = true);
    ghosts.forEach(ghost => {
        ghost.exitCageTarget = {x: 13.5 * CELL_SIZE, y: 12.5 * CELL_SIZE};
        ghost.postExitTarget = {x: 13.5 * CELL_SIZE, y: 10.5 * CELL_SIZE};
    });

    // Recréer les points et power-ups
    dots = [];
    powerUps = [];
    createDots();
    createPowerUps();
}

// Création des points
function createDots() {
    dots = []; // Réinitialiser les points
    for (let x = 1; x < GRID_WIDTH - 1; x++) {
        for (let y = 1; y < GRID_HEIGHT - 1; y++) {
            const pixelX = x * CELL_SIZE + CELL_SIZE / 2; // Centrer le point dans la cellule
            const pixelY = y * CELL_SIZE + CELL_SIZE / 2; // Centrer le point dans la cellule
            // Vérifier si la position n'est pas un mur et n'est pas dans la zone des fantômes (incluant la cage et l'ouverture)
            // Utiliser une vérification de collision simple avec les murs créés
            if (!isWall(pixelX, pixelY)) {
                // Vérifier si la position n'est pas dans la zone approximative de la cage des fantômes
                const isGhostArea = (y >= 13 && y <= 17 && x >= 10 && x <= 17);
                if (!isGhostArea) {
                     dots.push(new Dot(pixelX, pixelY));
                }
            }
        }
    }
     // Affiner la suppression des points dans la zone de la cage (y=13 à 17, x=10 à 17) et l'ouverture (y=13, x=13 à 14)
     dots = dots.filter(dot => 
         !((dot.y / CELL_SIZE >= 13 && dot.y / CELL_SIZE <= 17) && (dot.x / CELL_SIZE >= 10 && dot.x / CELL_SIZE <= 17))
         && !((dot.x / CELL_SIZE >= 13 && dot.x / CELL_SIZE <= 14) && dot.y / CELL_SIZE === 13)
     );
}

// Création des power-ups
function createPowerUps() {
    powerUps = []; // Réinitialiser les power-ups
    // Positions des power-ups basées sur l'image Google Pacman (approximatif)
    const powerUpPositions = [
        {x: 1.5, y: 3.5}, 
        {x: GRID_WIDTH - 2.5, y: 3.5},
        {x: 1.5, y: GRID_HEIGHT - 6.5}, 
        {x: GRID_WIDTH - 2.5, y: GRID_HEIGHT - 6.5} 
    ];
    
    powerUpPositions.forEach(pos => {
         const pixelX = pos.x * CELL_SIZE; 
         const pixelY = pos.y * CELL_SIZE; 
        // Vérifier si la position (centrée dans la cellule) n'est pas un mur avant d'ajouter le power-up
        if (!isWall(pixelX + CELL_SIZE/2, pixelY + CELL_SIZE/2)) { 
            powerUps.push(new PowerUp(pixelX + CELL_SIZE/2, pixelY + CELL_SIZE/2)); // Centrer le power-up
        }
    });
}

// Vérification des collisions avec les murs
function isWall(x, y) {
     // Vérifie si le point donné (par exemple, le centre de l'entité) est à l'intérieur d'un mur
     // Utilise une petite tolérance pour un mouvement plus fluide
     const tolerance = 5; 

     return walls.some(wall => 
        x > wall.x + tolerance && 
        x < wall.x + wall.w - tolerance &&
        y > wall.y + tolerance && 
        y < wall.y + wall.h - tolerance
    );
}

// Mise à jour du jeu
function updateGame() {
    // Gérer la libération progressive des fantômes
    if (ghostsReleased < ghosts.length && ghostReleaseTimer > 0) {
        ghostReleaseTimer--;
        if (ghostReleaseTimer <= 0) {
            // Trouver le prochain fantôme dans la cage et le marquer pour la sortie
            // Priorité : Blinky (rouge), puis Pinky (rose), Inky (cyan), Clyde (orange)
            let ghostToRelease = null;
            if (ghostsReleased === 0) ghostToRelease = ghosts.find(ghost => ghost.type === 'red' && ghost.inCage);
            else if (ghostsReleased === 1) ghostToRelease = ghosts.find(ghost => ghost.type === 'pink' && ghost.inCage);
            else if (ghostsReleased === 2) ghostToRelease = ghosts.find(ghost => ghost.type === 'cyan' && ghost.inCage);
            else if (ghostsReleased === 3) ghostToRelease = ghosts.find(ghost => ghost.type === 'orange' && ghost.inCage);

            if (ghostToRelease) {
                 ghostToRelease.inCage = false; // Le fantôme est maintenant en train de sortir
                 // Pas besoin de changer le mode ici, la logique de mouvement dans Ghost.update gère la sortie
                 ghostsReleased++;
                 // Réinitialiser le timer pour la prochaine libération ou arrêter si tous sont sortis
                 if (ghostsReleased < ghosts.length) {
                     ghostReleaseTimer = 180; // Attendre encore 3 secondes pour le prochain
                 } else {
                     ghostReleaseTimer = 0; // Tous les fantômes sont sortis
                 }
            }
        }
    }

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
        this.size = CELL_SIZE; // Ajouter une taille pour une meilleure collision
    }
    
    update() {
        // Animation de la bouche
        this.mouthOpen += this.mouthSpeed;
        if (this.mouthOpen > 0.5 || this.mouthOpen < 0) {
            this.mouthSpeed = -this.mouthSpeed;
        }
        
        // Gérer les changements de direction demandés
         if (this.nextDirection !== null) {
             let potentialX = this.x;
             let potentialY = this.y;

             // Calculer la position potentielle basée sur la prochaine direction
             if (this.nextDirection === 0) potentialX += this.speed; // droite
             else if (this.nextDirection === PI) potentialX -= this.speed; // gauche
             else if (this.nextDirection === -PI/2) potentialY -= this.speed; // haut
             else if (this.nextDirection === PI/2) potentialY += this.speed; // bas

             // Vérifier si la nouvelle position potentielle n'est pas un mur
             // Utiliser le centre de Pacman pour la vérification
             if (!isWall(potentialX, potentialY)) {
                 this.direction = this.nextDirection;
                 this.nextDirection = null;
             }
         }

        // Mouvement dans la direction actuelle
        let nextX = this.x;
        let nextY = this.y;
        
        if (this.direction === 0) nextX += this.speed; // droite
        else if (this.direction === PI) nextX -= this.speed; // gauche
        else if (this.direction === -PI/2) nextY -= this.speed; // haut
        else if (this.direction === PI/2) nextY += this.speed; // bas
        
        // Vérifier les collisions avec les murs avant de bouger
        // Utiliser le centre de Pacman pour la vérification
        if (!isWall(nextX, nextY)) {
            this.x = nextX;
            this.y = nextY;
        }
        
        // Gestion des tunnels
        if (this.x < 0) this.x = width - CELL_SIZE/2; // Apparition de l'autre côté avec offset
        if (this.x > width) this.x = CELL_SIZE/2; // Apparition de l'autre côté avec offset
    }
    
    draw() {
        push();
        // Pacman est centré sur ses coordonnées x, y
        translate(this.x, this.y);
        rotate(this.direction);
        
        // Corps de Pacman
        fill(COLORS.PACMAN);
        
        // Dessiner l'arc pour la bouche
        arc(0, 0, this.size, this.size, this.mouthOpen, TWO_PI - this.mouthOpen);
        
        pop();
    }
    
    handleKeyPress(keyCode) {
        if (keyCode === RIGHT_ARROW) this.nextDirection = 0;
        else if (keyCode === LEFT_ARROW) this.nextDirection = PI;
        else if (keyCode === UP_ARROW) this.nextDirection = -PI/2; // Angle vers le haut en radians
        else if (keyCode === DOWN_ARROW) this.nextDirection = PI/2; // Angle vers le bas en radians
    }
    
    reset() {
        this.x = 13.5 * CELL_SIZE; // Position de départ après avoir perdu une vie
        this.y = 26.5 * CELL_SIZE;
        this.direction = 0;
        this.nextDirection = null;
    }
}

// Classe Ghost
class Ghost {
    constructor(x, y, color, type) {
        this.x = x;
        this.y = y;
        this.initialX = x; // Position initiale dans la cage
        this.initialY = y;
        this.color = color;
        this.type = type;
        this.speed = 2; // Vitesse par défaut
        this.direction = 0; // Direction initiale
        this.isFrightened = false;
        this.frightenedTimer = 0;
        this.mode = 'scatter'; // 'scatter', 'chase', 'frightened', 'exit'
        this.scatterTimer = 0; // Timer pour le mode scatter
        this.inCage = true; // Flag pour indiquer si le fantôme est dans la cage
        // Cible pour sortir de la cage - un point juste au-dessus de la barrière
        this.exitCageTarget = {x: 13.5 * CELL_SIZE, y: 12.5 * CELL_SIZE};
         // Cible une fois sorti de la cage et avant de rejoindre le labyrinthe principal (par exemple, centre au-dessus de la cage)
        this.postExitTarget = {x: 13.5 * CELL_SIZE, y: 10.5 * CELL_SIZE};
    }
    
    update() {
        // Logique de sortie de la cage
        if (this.inCage) {
             // Déplacer les fantômes dans la cage vers la cible de sortie de la cage
             const targetX = this.exitCageTarget.x;
             const targetY = this.exitCageTarget.y;

             const angleToTarget = atan2(targetY - this.y, targetX - this.x);
             const nextX = this.x + cos(angleToTarget) * this.speed;
             const nextY = this.y + sin(angleToTarget) * this.speed;

             // Permettre aux fantômes dans la cage de se déplacer sans collision avec les murs de la cage interne
              this.x = nextX;
              this.y = nextY;

             // Si le fantôme atteint presque la sortie de la cage
             if (dist(this.x, this.y, targetX, targetY) < this.speed * 1.5) { // Utiliser une petite tolérance
                 this.x = targetX; // Snap to target
                 this.y = targetY;
                 this.inCage = false; // Le fantôme est sorti
                 this.mode = 'scatter'; // Revenir en mode scatter (ou chase selon le design)
             }
            return; // Ne pas appliquer la logique de poursuite/dispersion tant qu'il est dans la cage ou en cours de sortie interne
        }

         // Logique de mouvement une fois sorti de la cage mais avant de rejoindre le labyrinthe principal
         // Se déplacer vers le point post-sortie (juste au-dessus de la cage) s'il n'est pas déjà là
         if (dist(this.x, this.y, this.postExitTarget.x, this.postExitTarget.y) > this.speed * 1.5 && !this.inCage) {
             const angleToPostExit = atan2(this.postExitTarget.y - this.y, this.postExitTarget.x - this.x);
             const nextX = this.x + cos(angleToPostExit) * this.speed;
             const nextY = this.y + sin(angleToPostExit) * this.speed;

             // Vérifier les collisions avec les murs avant de bouger vers le point post-sortie
             // Permettre le passage à travers la barrière de la cage s'ils remontent
             if (!isWall(nextX, nextY) || (this.y >= 13 * CELL_SIZE && nextY < 13 * CELL_SIZE)) {
                  this.x = nextX;
                  this.y = nextY;
             } else {
                 // Si bloqué en allant vers le point post-sortie, tenter de se diriger vers Pacman ou coin scatter
                  this.mode = (this.type === 'red') ? 'chase' : 'scatter'; // Revenir à la logique normale si bloqué
             }
             return; // Continuer vers le point post-sortie s'il n'est pas bloqué
         }

         // Une fois au point post-sortie ou déjà dans le labyrinthe principal
         // Appliquer la logique normale de mouvement (scatter/chase/frightened)

        if (this.isFrightened) {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.isFrightened = false;
                this.speed = 2; // Vitesse normale
            } else {
                 this.speed = 1; // Vitesse réduite en mode frightened
            }
        }
        
        // Logique de mouvement basée sur le type de fantôme et le mode
        let targetX, targetY;

        if (this.isFrightened) {
            // Mouvement aléatoire en mode frightened
             const possibleDirections = [-PI, -PI/2, 0, PI/2]; // gauche, haut, droite, bas (en radians)
             let chosenDirection = random(possibleDirections);
             targetX = this.x + cos(chosenDirection) * CELL_SIZE;
             targetY = this.y + sin(chosenDirection) * CELL_SIZE;

        } else if (this.mode === 'chase') {
            // Logique de poursuite (basée sur le type de fantôme)
            switch(this.type) {
                case 'red': // Blinky
                    targetX = pacman.x;
                    targetY = pacman.y;
                    break;
                case 'pink': // Pinky
                    targetX = pacman.x + cos(pacman.direction) * 4 * CELL_SIZE;
                    targetY = pacman.y + sin(pacman.direction) * 4 * CELL_SIZE;
                    break;
                case 'cyan': // Inky
                    const blinky = ghosts.find(g => g.type === 'red');
                    if (blinky) {
                        targetX = blinky.x + (pacman.x - blinky.x) * 2;
                        targetY = blinky.y + (pacman.y - blinky.y) * 2;
                    } else { targetX = pacman.x; targetY = pacman.y; }
                    break;
                case 'orange': // Clyde
                    const distance = dist(this.x, this.y, pacman.x, pacman.y);
                    if (distance < 8 * CELL_SIZE) { targetX = 0; targetY = height; }
                    else { targetX = pacman.x; targetY = pacman.y; }
                    break;
            }
        } else if (this.mode === 'scatter') {
            // Cibles pour le mode scatter (coins du labyrinthe - ajusté pour le nouveau labyrinthe)
             switch(this.type) {
                 case 'red': targetX = GRID_WIDTH * CELL_SIZE; targetY = 0; break; // Top right
                 case 'pink': targetX = 0; targetY = 0; break; // Top left
                 case 'cyan': targetX = GRID_WIDTH * CELL_SIZE; targetY = GRID_HEIGHT * CELL_SIZE; break; // Bottom right
                 case 'orange': targetX = 0; targetY = GRID_HEIGHT * CELL_SIZE; break; // Bottom left
             }
        }
        
        // Calculer la direction vers la cible
        const angle = atan2(targetY - this.y, targetX - this.x);
        
        // Mouvement
        let nextX = this.x + cos(angle) * this.speed;
        let nextY = this.y + sin(angle) * this.speed;
        
        // Vérifier les collisions avec les murs et ajuster la direction si nécessaire
        if (!isWall(nextX, nextY)) {
             this.x = nextX;
             this.y = nextY;
             // Mettre à jour la direction basée sur le mouvement réussi
             this.direction = angle; // Mettre à jour la direction pour la logique future
        } else {
            // Si collision, trouver une direction alternative (éviter de faire demi-tour instantanément)
            const possibleDirections = [-PI, -PI/2, 0, PI/2]; // gauche, haut, droite, bas (en radians)
            let bestDirection = this.direction; // Garder la direction actuelle par défaut
            let minDistance = Infinity;

            for (let dir of possibleDirections) {
                 // Éviter de faire demi-tour (angle différent de PI ou -PI)
                 // Ajouter une petite tolérance pour les comparaisons d'angles flottants
                 if (abs(dir - this.direction) > 0.1 && abs(dir - this.direction) < PI * 1.9) { // Moins strict que !== PI
                    const testX = this.x + cos(dir) * this.speed;
                    const testY = this.y + sin(dir) * this.speed;
                         // Vérifier si la direction alternative n'est pas un mur
                         if (!isWall(testX, testY)) {
                             const distToTarget = dist(testX, testY, targetX, targetY);
                             // Choisir la direction alternative qui rapproche le plus de la cible
                             if (distToTarget < minDistance) {
                                minDistance = distToTarget;
                                bestDirection = dir;
                             }
                         }
                     }
            }
             this.direction = bestDirection; // Mettre à jour la direction vers la meilleure alternative
             // Tenter de bouger dans la meilleure direction alternative trouvée
             const finalNextX = this.x + cos(this.direction) * this.speed;
             const finalNextY = this.y + sin(this.direction) * this.speed;
              if (!isWall(finalNextX, finalNextY)) {
                  this.x = finalNextX;
                  this.y = finalNextY;
              }
        }

        
        // Gestion des tunnels
        if (this.x < 0) this.x = width - CELL_SIZE/2; // Apparition de l'autre côté avec offset
        if (this.x > width) this.x = CELL_SIZE/2; // Apparition de l'autre côté avec offset
    }
    
    draw() {
        push();
        // Fantôme centré sur ses coordonnées x, y
        translate(this.x, this.y);
        
        // Corps du fantôme
        fill(this.isFrightened ? COLORS.GHOST_FRIGHTENED : this.color);
        // Dessiner le corps comme un cercle pour la collision simple avec Pacman
        ellipse(0, 0, CELL_SIZE, CELL_SIZE);
        
        // Yeux
        fill(255);
        ellipse(-CELL_SIZE/4, -CELL_SIZE/4, CELL_SIZE/4, CELL_SIZE/4);
        ellipse(CELL_SIZE/4, -CELL_SIZE/4, CELL_SIZE/4, CELL_SIZE/4);
        
        pop();
    }
    
    setFrightened() {
        this.isFrightened = true;
        this.frightenedTimer = 300; // 5 secondes à 60 FPS
        this.speed = 1; // Vitesse réduite
    }
    
    reset() {
        this.x = this.initialX; // Retour à la position initiale dans la cage
        this.y = this.initialY;
        this.isFrightened = false;
        this.speed = 2; // Vitesse normale
        this.inCage = true; // Retourne dans la cage après avoir été mangé
        // Réinitialiser les cibles de sortie de la cage
         this.exitCageTarget = {x: 13.5 * CELL_SIZE, y: 12.5 * CELL_SIZE};
         this.postExitTarget = {x: 13.5 * CELL_SIZE, y: 10.5 * CELL_SIZE};
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
        this.size = CELL_SIZE / 4; // Taille du point
    }
    
    draw() {
        if (!this.collected) {
            fill(COLORS.DOT);
            // Dessiner le point centré sur ses coordonnées x, y
            ellipse(this.x, this.y, this.size, this.size);
        }
    }
}

// Classe PowerUp
class PowerUp {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.collected = false;
        this.size = CELL_SIZE / 2; // Taille du power-up
    }
    
    draw() {
        if (!this.collected) {
            fill(COLORS.POWER_UP);
            // Dessiner le power-up centré sur ses coordonnées x, y
            ellipse(this.x, this.y, this.size, this.size);
        }
    }
} 