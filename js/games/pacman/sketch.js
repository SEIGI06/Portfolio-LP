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
function isWall(x, y, w = CELL_SIZE, h = CELL_SIZE) {
     // Vérifie si la boîte définie par (x, y, w, h) chevauche l'un des murs.
     // Nous allons utiliser collideRectRect de p5.js

     for (const wall of walls) {
         if (collideRectRect(x, y, w, h, wall.x, wall.y, wall.w, wall.h)) {
             return true; // Collision détectée avec un mur
         }
     }

     // Vérifier aussi les limites de la grille comme des murs (sauf les tunnels)
     // Tunnels sont approximativement au milieu de la hauteur
     const tunnelYStart = Math.floor((GRID_HEIGHT / 2) - 1) * CELL_SIZE; // Approximation de la ligne supérieure du tunnel
     const tunnelYEnd = Math.floor((GRID_HEIGHT / 2) + 1) * CELL_SIZE; // Approximation de la ligne inférieure du tunnel

     const isAtTunnelHeight = (y + h > tunnelYStart && y < tunnelYEnd);

     if (x < 0 && !isAtTunnelHeight) return true; // Collision avec bord gauche (pas un tunnel)
     if (x + w > GAME_WIDTH && !isAtTunnelHeight) return true; // Collision avec bord droit (pas un tunnel)
     if (y < 0) return true; // Collision avec bord supérieur
     if (y + h > GAME_HEIGHT) return true; // Collision avec bord inférieur

     return false; // Aucune collision
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
             const step = this.speed; // Use speed for potential step
             if (this.nextDirection === 0) potentialX += step; // droite
             else if (this.nextDirection === PI) potentialX -= step; // gauche
             else if (this.nextDirection === -PI/2) potentialY -= step; // haut
             else if (this.nextDirection === PI/2) potentialY += step; // bas

             // Vérifier si la nouvelle position potentielle (en utilisant le centre de Pacman + direction) n'est pas un mur
             // Ajouter un petit offset dans la direction du mouvement pour anticiper la collision
             const checkX = this.x + cos(this.nextDirection) * (this.size / 2 + 1); // Check slightly ahead of center
             const checkY = this.y + sin(this.nextDirection) * (this.size / 2 + 1); // Check slightly ahead of center

             if (!isWall(checkX, checkY)) {
                 this.direction = this.nextDirection;
                 this.nextDirection = null;
             } else {
                 // Si la direction voulue bloque, annuler la demande de changement de direction
                 this.nextDirection = null;
             }
         }

        // Mouvement dans la direction actuelle
        let nextX = this.x;
        let nextY = this.y;
        
        const step = this.speed; // Use speed for current step
        if (this.direction === 0) nextX += step; // droite
        else if (this.direction === PI) nextX -= step; // gauche
        else if (this.direction === -PI/2) nextY -= step; // haut
        else if (this.direction === PI/2) nextY += step; // bas
        
        // Vérifier les collisions avec les murs avant de bouger
        // Utiliser le centre de Pacman + un petit offset dans la direction du mouvement
        const checkX = this.x + cos(this.direction) * (this.size / 2 + 1);
        const checkY = this.y + sin(this.direction) * (this.size / 2 + 1);

        if (!isWall(checkX, checkY)) {
            this.x = nextX;
            this.y = nextY;
        } else {
             // Si collision, arrêter le mouvement dans cette direction
             // Optionally snap to the edge of the wall
             // This part might need more complex logic depending on desired behavior
        }
        
        // Gestion des tunnels
        if (this.x < -CELL_SIZE/2) this.x = width - CELL_SIZE/2; // Apparition de l'autre côté avec offset
        if (this.x > width + CELL_SIZE/2) this.x = CELL_SIZE/2; // Apparition de l'autre côté avec offset
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
             // Move towards the exit target
             const targetX = this.exitCageTarget.x;
             const targetY = this.exitCageTarget.y;

             const angleToTarget = atan2(targetY - this.y, targetX - this.x);
             const nextX = this.x + cos(angleToTarget) * this.speed;
             const nextY = this.y + sin(angleToTarget) * this.speed;

             // Check for wall collision for the ghost's bounding box at the next position
             if (!isWall(nextX - this.size/2, nextY - this.size/2, this.size, this.size)) {
                  this.x = nextX;
                  this.y = nextY;
             }

             // If reached the exit target
             if (dist(this.x, this.y, targetX, targetY) < this.speed) { // Further reduced tolerance for snapping
                 this.x = targetX; // Snap to target
                 this.y = targetY;
                 this.inCage = false; // Ghost is out of the cage
                 this.mode = 'scatter'; // Or 'chase' based on initial logic
                 this.direction = -PI/2; // Set initial direction upwards
             }
            return; // Don't apply normal movement while in cage or exiting it
        }

        // Once out of the cage, move towards the post-exit target if not there yet
         if (dist(this.x, this.y, this.postExitTarget.x, this.postExitTarget.y) > this.speed) { // Further reduced tolerance
             // Allow upward movement from the cage exit regardless of wall presence check at that specific point
             // Simplified check for moving upwards out of the cage
             const movingUpOutOfCageArea = this.y >= (14 * CELL_SIZE - this.speed) && nextY < (14 * CELL_SIZE) && this.x > (13 * CELL_SIZE - CELL_SIZE/2) && this.x < (15 * CELL_SIZE + CELL_SIZE/2); // Use full cell size tolerance

             // Check for wall collision for the ghost's bounding box at the next position, or allow movement if exiting cage upwards
             if (!isWall(nextX - this.size/2, nextY - this.size/2, this.size, this.size) || movingUpOutOfCageArea) {
                  this.x = nextX;
                  this.y = nextY;
             } else {
                 // If blocked, try moving purely upwards as a fallback
                 const checkUpY = this.y + sin(-PI/2) * this.speed;
                 // Check collision for moving purely upwards
                  if (!isWall(this.x - this.size/2, checkUpY - this.size/2, this.size, this.size)) { // Pass bounding box
                       this.y = checkUpY;
                       this.direction = -PI/2; // Set direction to upwards
                  } else {
                      // If still blocked, revert to normal scatter/chase logic (shouldn't happen often here)
                      this.mode = (this.type === 'red') ? 'chase' : 'scatter';
                  }
             }
             // Snap to post-exit target if close
             if (dist(this.x, this.y, this.postExitTarget.x, this.postExitTarget.y) < this.speed) { // Further reduced tolerance
                 this.x = this.postExitTarget.x;
                 this.y = this.postExitTarget.y;
             }
             return; // Continue towards post-exit target
         }

        // Normal movement logic (scatter/chase/frightened)

        if (this.isFrightened) {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.isFrightened = false;
                this.speed = 2; // Normal speed
            } else {
                 this.speed = 1; // Reduced speed
            }
        }

        let targetX, targetY;

        // Determine target based on mode
        if (this.isFrightened) {
            // In frightened mode, target is a random valid spot (handled below)
        } else if (this.mode === 'chase') {
            switch(this.type) {
                case 'red': targetX = pacman.x; targetY = pacman.y; break; // Blinky targets Pacman directly
                case 'pink': // Pinky targets 4 tiles ahead of Pacman
                     targetX = pacman.x + cos(pacman.direction) * 4 * CELL_SIZE;
                     targetY = pacman.y + sin(pacman.direction) * 4 * CELL_SIZE;
                     break;
                case 'cyan': // Inky targets a point based on Blinky and Pacman
                     const blinky = ghosts.find(g => g.type === 'red');
                     if (blinky) {
                         const pacmanTargetX = pacman.x + cos(pacman.direction) * 2 * CELL_SIZE; // 2 tiles ahead of Pacman
                         const pacmanTargetY = pacman.y + sin(pacman.direction) * 2 * CELL_SIZE;
                         targetX = blinky.x + (pacmanTargetX - blinky.x) * 2; // Vector from Blinky to PacmanTarget, doubled
                         targetY = blinky.y + (pacmanTargetY - blinky.y) * 2;
                     } else { targetX = pacman.x; targetY = pacman.y; } // Fallback
                     break;
                case 'orange': // Clyde targets Pacman unless within 8 tiles, then scatters
                     const distance = dist(this.x, this.y, pacman.x, pacman.y);
                     if (distance < 8 * CELL_SIZE) { targetX = 0; targetY = height; } // Scatter corner (bottom left)
                     else { targetX = pacman.x; targetY = pacman.y; } // Chase Pacman
                     break;
            }
        } else { // Scatter mode
             switch(this.type) {
                 case 'red': targetX = (GRID_WIDTH - 1) * CELL_SIZE; targetY = 0; break; // Top right corner
                 case 'pink': targetX = 0; targetY = 0; break; // Top left corner
                 case 'cyan': targetX = (GRID_WIDTH - 1) * CELL_SIZE; targetY = (GRID_HEIGHT - 1) * CELL_SIZE; break; // Bottom right corner
                 case 'orange': targetX = 0; targetY = (GRID_HEIGHT - 1) * CELL_SIZE; break; // Bottom left corner
             }
        }

        // --- Grid Alignment and Movement Logic ---
        const gridTolerance = this.speed / 2; // Tolerance for being considered aligned with grid center
        const isAligned = (Math.abs((this.x % CELL_SIZE) - CELL_SIZE / 2) < gridTolerance) && (Math.abs((this.y % CELL_SIZE) - CELL_SIZE / 2) < gridTolerance);

        // If ghost is aligned or close to aligned, potentially change direction
        if (isAligned) {
             // Snap to grid center to avoid minor misalignment issues
             this.x = round(this.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
             this.y = round(this.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;

            const directions = [0, PI/2, PI, -PI/2]; // Right, Down, Left, Up
            let possibleMoves = [];

            for (const angle of directions) {
                // Calculate potential next grid cell center
                const nextCellX = this.x + cos(angle) * CELL_SIZE;
                const nextCellY = this.y + sin(angle) * CELL_SIZE;

                 // Check for wall collision in the next cell's area
                 if (!isWall(nextCellX - CELL_SIZE/2, nextCellY - CELL_SIZE/2, CELL_SIZE, CELL_SIZE)) {
                     const isReversing = abs(angle - (this.direction + PI)) < 0.1 || abs(angle - (this.direction - PI)) < 0.1;
                      if (!isReversing || this.isFrightened) { // Allow reversing if frightened or as a last resort
                         possibleMoves.push({ angle: angle, nextX: nextCellX, nextY: nextCellY });
                      }
                 }
            }

            // If frightened, pick a random valid move from possible grid-aligned moves
            if (this.isFrightened && possibleMoves.length > 0) {
                 const chosenMove = random(possibleMoves);
                 this.direction = chosenMove.angle;
            } else if (!this.isFrightened && possibleMoves.length > 0) { // If not frightened, choose the best grid-aligned move
                let bestAngle = this.direction; // Default to current direction if valid
                let minDistance = Infinity;

                // Find the move that minimizes distance to target (among valid non-reversing moves initially)
                let nonReversingMoves = possibleMoves.filter(move => abs(move.angle - (this.direction + PI)) > 0.1 && abs(move.angle - (this.direction - PI)) > 0.1);

                if (nonReversingMoves.length > 0) {
                     // Sort non-reversing moves by distance to target
                     nonReversingMoves.sort((a, b) => dist(a.nextX, a.nextY, targetX, targetY) - dist(b.nextX, b.nextY, targetX, targetY));
                     bestAngle = nonReversingMoves[0].angle; // Choose the non-reversing move closest to target
                } else {
                    // If only reversing move is possible, take it
                    if(possibleMoves.length > 0) {
                        bestAngle = possibleMoves[0].angle; // This will be the reverse move's angle
                    }
                }
                this.direction = bestAngle; // Update ghost direction
            }
            // If no valid moves from this aligned position, ghost stays in this cell directionless until a path opens
        }

        // Move in the current direction if it's not blocked by a wall for the next small step
        const nextStepX = this.x + cos(this.direction) * this.speed;
        const nextStepY = this.y + sin(this.direction) * this.speed;

        // Check wall collision for the next small step using bounding box
        if (!isWall(nextStepX - this.size/2, nextStepY - this.size/2, this.size, this.size)) {
            this.x = nextStepX;
            this.y = nextStepY;
        } else {
            // If next step is blocked, snap back to the last valid position or grid center if aligned
             if(isAligned) { // If blocked while aligned, stay snapped
                 this.x = round(this.x / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
                 this.y = round(this.y / CELL_SIZE) * CELL_SIZE + CELL_SIZE / 2;
             } else { // If blocked between cells, this might still allow getting stuck. More advanced would be path interruption handling.
                 // Simple fallback: stay put
             }
        }

        // --- Basic Ghost Separation ---
        // Discourage ghosts from occupying the exact same spot
        for (const otherGhost of ghosts) {
            if (otherGhost !== this && dist(this.x, this.y, otherGhost.x, otherGhost.y) < CELL_SIZE * 0.9) { // Check if too close, slightly larger threshold
                 // If too close, slightly push this ghost away from the other
                 const angleAway = atan2(this.y - otherGhost.y, this.x - otherGhost.x);
                 // Calculate push distance based on how much they overlap
                 const overlap = (CELL_SIZE * 0.9) - dist(this.x, this.y, otherGhost.x, otherGhost.y);
                 const pushMagnitude = overlap / 2; // Push by half of the overlap distance

                 const pushX = cos(angleAway) * pushMagnitude;
                 const pushY = sin(angleAway) * pushMagnitude;

                 // Apply push only if it doesn't push into a wall
                 if (!isWall(this.x + pushX - this.size/2, this.y + pushY - this.size/2, this.size, this.size)){
                      this.x += pushX;
                      this.y += pushY;
                 }
            }
        }

        // Gestion des tunnels
        if (this.x < -CELL_SIZE/2) this.x = width + CELL_SIZE/2 - 1; // Appear on the other side, adjust for width
        if (this.x > width + CELL_SIZE/2 -1) this.x = -CELL_SIZE/2; // Appear on the other side, adjust for width
    }
    
    draw() {
        push();
        // Fantôme centré sur ses coordonnées x, y
        translate(this.x, this.y);

        // Corps du fantôme
        fill(this.isFrightened ? COLORS.GHOST_FRIGHTENED : this.color);
        // Dessiner le corps comme un cercle pour la collision simple avec Pacman
        ellipse(0, 0, CELL_SIZE * 0.9, CELL_SIZE * 0.9); // Slightly smaller to reduce overlap visualization

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

    // Helper to get discrete direction from angle (not strictly used in simplified movement but kept)
    getDirectionFromAngle(angle) {
         if (angle > -PI/4 && angle <= PI/4) return 0; // Right
         if (angle > PI/4 && angle <= 3*PI/4) return PI/2; // Down
         if (angle > 3*PI/4 || angle <= -3*PI/4) return PI; // Left
         return -PI/2; // Up
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