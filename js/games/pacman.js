class Ghost {
    constructor(x, y, color, mode = 'chase') {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = 2;
        this.direction = Math.random() * Math.PI * 2;
        this.radius = 15;
        this.mode = mode; // 'chase', 'scatter', 'frightened'
        this.targetX = 0;
        this.targetY = 0;
        this.frightenedTimer = 0;
    }

    update(pacman, walls) {
        if (this.mode === 'frightened') {
            this.frightenedTimer--;
            if (this.frightenedTimer <= 0) {
                this.mode = 'chase';
                this.speed = 2;
            }
        }

        // Définir la cible en fonction du mode
        if (this.mode === 'chase') {
            this.targetX = pacman.x;
            this.targetY = pacman.y;
        } else if (this.mode === 'scatter') {
            // Chaque fantôme a un coin différent
            switch(this.color) {
                case 'red': this.targetX = this.canvas.width; this.targetY = 0; break;
                case 'pink': this.targetX = 0; this.targetY = 0; break;
                case 'cyan': this.targetX = this.canvas.width; this.targetY = this.canvas.height; break;
                case 'orange': this.targetX = 0; this.targetY = this.canvas.height; break;
            }
        }

        // Calculer la direction vers la cible
        const dx = this.targetX - this.x;
        const dy = this.targetY - this.y;
        const targetAngle = Math.atan2(dy, dx);

        // Vérifier les collisions avec les murs
        const nextX = this.x + Math.cos(targetAngle) * this.speed;
        const nextY = this.y + Math.sin(targetAngle) * this.speed;

        if (!this.checkWallCollision(nextX, nextY, walls)) {
            this.direction = targetAngle;
        } else {
            // Si collision, essayer une direction alternative
            const angles = [0, Math.PI/2, Math.PI, -Math.PI/2];
            for (let angle of angles) {
                const testX = this.x + Math.cos(angle) * this.speed;
                const testY = this.y + Math.sin(angle) * this.speed;
                if (!this.checkWallCollision(testX, testY, walls)) {
                    this.direction = angle;
                    break;
                }
            }
        }

        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
    }

    checkWallCollision(x, y, walls) {
        for (let wall of walls) {
            if (x + this.radius > wall.x && 
                x - this.radius < wall.x + wall.width &&
                y + this.radius > wall.y && 
                y - this.radius < wall.y + wall.height) {
                return true;
            }
        }
        return false;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI, true);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.fillStyle = this.mode === 'frightened' ? 'blue' : this.color;
        ctx.fill();
        ctx.closePath();

        // Yeux
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(this.x - 5, this.y - 2, 3, 0, Math.PI * 2);
        ctx.arc(this.x + 5, this.y - 2, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();
    }

    setFrightened() {
        this.mode = 'frightened';
        this.speed = 1;
        this.frightenedTimer = 300; // 5 secondes à 60 FPS
    }
}

class Pacman {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pacman = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 15,
            speed: 3,
            direction: 0,
            mouthOpen: 0,
            mouthSpeed: 0.15,
            poweredUp: false,
            powerUpTimer: 0
        };
        this.keys = {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false
        };
        this.score = 0;
        this.lives = 3;
        this.dots = [];
        this.powerUps = [];
        this.ghosts = [];
        this.walls = [];
        this.gameOver = false;
        this.setupMaze();
        this.setupDots();
        this.setupPowerUps();
        this.setupGhosts();
        this.setupEventListeners();
        this.gameLoop();
    }

    setupMaze() {
        // Murs extérieurs
        this.walls = [
            { x: 0, y: 0, width: this.canvas.width, height: 20 },
            { x: 0, y: 0, width: 20, height: this.canvas.height },
            { x: 0, y: this.canvas.height - 20, width: this.canvas.width, height: 20 },
            { x: this.canvas.width - 20, y: 0, width: 20, height: this.canvas.height }
        ];

        // Ajouter quelques murs intérieurs
        const wallPositions = [
            { x: 100, y: 100, width: 200, height: 20 },
            { x: 100, y: 200, width: 20, height: 200 },
            { x: 280, y: 200, width: 20, height: 200 },
            { x: 100, y: 400, width: 200, height: 20 }
        ];

        this.walls.push(...wallPositions);
    }

    setupDots() {
        const gridSize = 20;
        const padding = 30;
        for (let x = padding; x < this.canvas.width - padding; x += gridSize) {
            for (let y = padding; y < this.canvas.height - padding; y += gridSize) {
                // Vérifier si le point n'est pas dans un mur
                if (!this.isInWall(x, y)) {
                    this.dots.push({ x, y, radius: 3, collected: false });
                }
            }
        }
    }

    setupPowerUps() {
        const powerUpPositions = [
            { x: 50, y: 50 },
            { x: this.canvas.width - 50, y: 50 },
            { x: 50, y: this.canvas.height - 50 },
            { x: this.canvas.width - 50, y: this.canvas.height - 50 }
        ];

        powerUpPositions.forEach(pos => {
            if (!this.isInWall(pos.x, pos.y)) {
                this.powerUps.push({ ...pos, radius: 8, collected: false });
            }
        });
    }

    isInWall(x, y) {
        for (let wall of this.walls) {
            if (x > wall.x && x < wall.x + wall.width &&
                y > wall.y && y < wall.y + wall.height) {
                return true;
            }
        }
        return false;
    }

    setupGhosts() {
        const colors = ['red', 'pink', 'cyan', 'orange'];
        const startPositions = [
            { x: 50, y: 50 },
            { x: this.canvas.width - 50, y: 50 },
            { x: 50, y: this.canvas.height - 50 },
            { x: this.canvas.width - 50, y: this.canvas.height - 50 }
        ];

        for (let i = 0; i < 4; i++) {
            this.ghosts.push(new Ghost(
                startPositions[i].x,
                startPositions[i].y,
                colors[i]
            ));
        }
    }

    setupEventListeners() {
        window.addEventListener('keydown', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        });

        window.addEventListener('keyup', (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        });
    }

    update() {
        if (this.gameOver) return;

        // Mise à jour de la position de Pacman
        let nextX = this.pacman.x;
        let nextY = this.pacman.y;

        if (this.keys.ArrowUp) {
            nextY -= this.pacman.speed;
            this.pacman.direction = -Math.PI / 2;
        }
        if (this.keys.ArrowDown) {
            nextY += this.pacman.speed;
            this.pacman.direction = Math.PI / 2;
        }
        if (this.keys.ArrowLeft) {
            nextX -= this.pacman.speed;
            this.pacman.direction = Math.PI;
        }
        if (this.keys.ArrowRight) {
            nextX += this.pacman.speed;
            this.pacman.direction = 0;
        }

        // Vérifier les collisions avec les murs
        if (!this.isInWall(nextX, nextY)) {
            this.pacman.x = nextX;
            this.pacman.y = nextY;
        }

        // Animation de la bouche
        this.pacman.mouthOpen += this.pacman.mouthSpeed;
        if (this.pacman.mouthOpen > 0.5 || this.pacman.mouthOpen < 0) {
            this.pacman.mouthSpeed = -this.pacman.mouthSpeed;
        }

        // Collecte des points
        this.dots.forEach(dot => {
            if (!dot.collected) {
                const dx = this.pacman.x - dot.x;
                const dy = this.pacman.y - dot.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.pacman.radius + dot.radius) {
                    dot.collected = true;
                    this.score += 10;
                }
            }
        });

        // Collecte des power-ups
        this.powerUps.forEach(powerUp => {
            if (!powerUp.collected) {
                const dx = this.pacman.x - powerUp.x;
                const dy = this.pacman.y - powerUp.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < this.pacman.radius + powerUp.radius) {
                    powerUp.collected = true;
                    this.pacman.poweredUp = true;
                    this.pacman.powerUpTimer = 300; // 5 secondes à 60 FPS
                    this.ghosts.forEach(ghost => ghost.setFrightened());
                }
            }
        });

        // Mise à jour du timer de power-up
        if (this.pacman.poweredUp) {
            this.pacman.powerUpTimer--;
            if (this.pacman.powerUpTimer <= 0) {
                this.pacman.poweredUp = false;
            }
        }

        // Mise à jour des fantômes
        this.ghosts.forEach(ghost => {
            ghost.update(this.pacman, this.walls);
            
            // Collision avec les fantômes
            const dx = this.pacman.x - ghost.x;
            const dy = this.pacman.y - ghost.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.pacman.radius + ghost.radius) {
                if (this.pacman.poweredUp) {
                    // Manger le fantôme
                    ghost.x = this.canvas.width / 2;
                    ghost.y = this.canvas.height / 2;
                    this.score += 200;
                } else {
                    this.lives--;
                    if (this.lives <= 0) {
                        this.gameOver = true;
                    } else {
                        // Réinitialiser la position de Pacman
                        this.pacman.x = this.canvas.width / 2;
                        this.pacman.y = this.canvas.height / 2;
                    }
                }
            }
        });

        // Vérifier si tous les points sont collectés
        if (this.dots.every(dot => dot.collected)) {
            this.setupDots();
            this.setupPowerUps();
        }
    }

    draw() {
        // Effacer le canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner les murs
        this.ctx.fillStyle = 'blue';
        this.walls.forEach(wall => {
            this.ctx.fillRect(wall.x, wall.y, wall.width, wall.height);
        });

        // Dessiner les points
        this.dots.forEach(dot => {
            if (!dot.collected) {
                this.ctx.beginPath();
                this.ctx.arc(dot.x, dot.y, dot.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = 'white';
                this.ctx.fill();
                this.ctx.closePath();
            }
        });

        // Dessiner les power-ups
        this.powerUps.forEach(powerUp => {
            if (!powerUp.collected) {
                this.ctx.beginPath();
                this.ctx.arc(powerUp.x, powerUp.y, powerUp.radius, 0, Math.PI * 2);
                this.ctx.fillStyle = 'yellow';
                this.ctx.fill();
                this.ctx.closePath();
            }
        });

        // Dessiner les fantômes
        this.ghosts.forEach(ghost => ghost.draw(this.ctx));

        // Dessiner Pacman
        this.ctx.beginPath();
        this.ctx.arc(
            this.pacman.x,
            this.pacman.y,
            this.pacman.radius,
            this.pacman.direction + this.pacman.mouthOpen,
            this.pacman.direction + 2 * Math.PI - this.pacman.mouthOpen
        );
        this.ctx.lineTo(this.pacman.x, this.pacman.y);
        this.ctx.fillStyle = this.pacman.poweredUp ? '#FFD700' : 'yellow';
        this.ctx.fill();
        this.ctx.closePath();

        // Afficher le score et les vies
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Vies: ${this.lives}`, 10, 60);

        // Afficher Game Over si nécessaire
        if (this.gameOver) {
            this.ctx.fillStyle = 'red';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Score final: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        requestAnimationFrame(() => this.gameLoop());
    }
}

// Initialisation du jeu
window.addEventListener('load', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.border = '2px solid black';
    canvas.style.display = 'none'; // Caché par défaut
    document.body.appendChild(canvas);
    
    const game = new Pacman(canvas);

    // Ajouter un bouton pour afficher/masquer le jeu
    const toggleButton = document.createElement('button');
    toggleButton.textContent = '🎮 Pacman';
    toggleButton.style.position = 'fixed';
    toggleButton.style.bottom = '20px';
    toggleButton.style.right = '20px';
    toggleButton.style.zIndex = '1000';
    toggleButton.style.padding = '10px';
    toggleButton.style.borderRadius = '5px';
    toggleButton.style.backgroundColor = '#4CAF50';
    toggleButton.style.color = 'white';
    toggleButton.style.border = 'none';
    toggleButton.style.cursor = 'pointer';

    toggleButton.addEventListener('click', () => {
        if (canvas.style.display === 'none') {
            canvas.style.display = 'block';
            canvas.style.position = 'fixed';
            canvas.style.bottom = '80px';
            canvas.style.right = '20px';
            canvas.style.backgroundColor = 'black';
            canvas.style.zIndex = '999';
        } else {
            canvas.style.display = 'none';
        }
    });

    document.body.appendChild(toggleButton);
}); 