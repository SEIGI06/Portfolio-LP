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
        console.log('Initialisation du jeu Pacman');
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.pacman = {
            x: canvas.width / 2,
            y: canvas.height / 2,
            radius: 15,
            speed: 3,
            direction: 0,
            mouthOpen: 0,
            mouthSpeed: 0.15
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
        this.ghosts = [];
        this.gameOver = false;
        this.animationId = null;
        this.isRunning = false;
        
        this.setupDots();
        this.setupGhosts();
        this.setupEventListeners();
    }

    setupDots() {
        const gridSize = 20;
        const padding = 30;
        for (let x = padding; x < this.canvas.width - padding; x += gridSize) {
            for (let y = padding; y < this.canvas.height - padding; y += gridSize) {
                this.dots.push({ x, y, radius: 3, collected: false });
            }
        }
    }

    setupGhosts() {
        const colors = ['red', 'pink', 'cyan', 'orange'];
        for (let i = 0; i < 4; i++) {
            const x = Math.random() * (this.canvas.width - 100) + 50;
            const y = Math.random() * (this.canvas.height - 100) + 50;
            this.ghosts.push({
                x: x,
                y: y,
                color: colors[i],
                speed: 2,
                direction: Math.random() * Math.PI * 2
            });
        }
    }

    setupEventListeners() {
        const handleKeyDown = (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = true;
            }
        };

        const handleKeyUp = (e) => {
            if (this.keys.hasOwnProperty(e.key)) {
                this.keys[e.key] = false;
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Nettoyer les événements quand le jeu est arrêté
        this.cleanup = () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }

    update() {
        if (this.gameOver || !this.isRunning) return;

        // Mise à jour de la position de Pacman
        if (this.keys.ArrowUp) {
            this.pacman.y -= this.pacman.speed;
            this.pacman.direction = -Math.PI / 2;
        }
        if (this.keys.ArrowDown) {
            this.pacman.y += this.pacman.speed;
            this.pacman.direction = Math.PI / 2;
        }
        if (this.keys.ArrowLeft) {
            this.pacman.x -= this.pacman.speed;
            this.pacman.direction = Math.PI;
        }
        if (this.keys.ArrowRight) {
            this.pacman.x += this.pacman.speed;
            this.pacman.direction = 0;
        }

        // Animation de la bouche
        this.pacman.mouthOpen += this.pacman.mouthSpeed;
        if (this.pacman.mouthOpen > 0.5 || this.pacman.mouthOpen < 0) {
            this.pacman.mouthSpeed = -this.pacman.mouthSpeed;
        }

        // Limites du canvas
        this.pacman.x = Math.max(this.pacman.radius, Math.min(this.canvas.width - this.pacman.radius, this.pacman.x));
        this.pacman.y = Math.max(this.pacman.radius, Math.min(this.canvas.height - this.pacman.radius, this.pacman.y));

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

        // Mise à jour des fantômes
        this.ghosts.forEach(ghost => {
            const dx = this.pacman.x - ghost.x;
            const dy = this.pacman.y - ghost.y;
            const angle = Math.atan2(dy, dx);
            
            ghost.direction += (angle - ghost.direction) * 0.1 + (Math.random() - 0.5) * 0.2;
            
            ghost.x += Math.cos(ghost.direction) * ghost.speed;
            ghost.y += Math.sin(ghost.direction) * ghost.speed;

            ghost.x = Math.max(20, Math.min(this.canvas.width - 20, ghost.x));
            ghost.y = Math.max(20, Math.min(this.canvas.height - 20, ghost.y));
            
            const ghostDx = this.pacman.x - ghost.x;
            const ghostDy = this.pacman.y - ghost.y;
            const ghostDistance = Math.sqrt(ghostDx * ghostDx + ghostDy * ghostDy);
            if (ghostDistance < this.pacman.radius + 15) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver = true;
                } else {
                    this.pacman.x = this.canvas.width / 2;
                    this.pacman.y = this.canvas.height / 2;
                }
            }
        });

        if (this.dots.every(dot => dot.collected)) {
            this.setupDots();
        }
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

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

        // Dessiner les fantômes
        this.ghosts.forEach(ghost => {
            this.ctx.beginPath();
            this.ctx.arc(ghost.x, ghost.y, 15, 0, Math.PI, true);
            this.ctx.lineTo(ghost.x + 15, ghost.y + 15);
            this.ctx.lineTo(ghost.x - 15, ghost.y + 15);
            this.ctx.fillStyle = ghost.color;
            this.ctx.fill();
            this.ctx.closePath();

            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(ghost.x - 5, ghost.y - 2, 3, 0, Math.PI * 2);
            this.ctx.arc(ghost.x + 5, ghost.y - 2, 3, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.closePath();
        });

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
        this.ctx.fillStyle = 'yellow';
        this.ctx.fill();
        this.ctx.closePath();

        // Afficher le score et les vies
        this.ctx.fillStyle = 'white';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);
        this.ctx.fillText(`Vies: ${this.lives}`, 10, 60);

        if (this.gameOver) {
            this.ctx.fillStyle = 'red';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('GAME OVER', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Score final: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
        }
    }

    start() {
        if (!this.isRunning) {
            this.isRunning = true;
            this.animationId = setInterval(() => {
                this.update();
                this.draw();
            }, 16);
        }
    }

    stop() {
        if (this.isRunning) {
            this.isRunning = false;
            clearInterval(this.animationId);
            this.animationId = null;
        }
    }

    reset() {
        this.score = 0;
        this.lives = 3;
        this.gameOver = false;
        this.pacman.x = this.canvas.width / 2;
        this.pacman.y = this.canvas.height / 2;
        this.setupDots();
        this.setupGhosts();
    }
}

// Attendre que le DOM soit complètement chargé
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM chargé, initialisation du jeu Pacman');
    
    // Vérifier si le canvas est supporté
    const canvas = document.createElement('canvas');
    if (!canvas.getContext) {
        console.error('Canvas non supporté par votre navigateur');
        return;
    }

    // Configuration du canvas
    canvas.width = 400;
    canvas.height = 400;
    canvas.style.border = '2px solid black';
    canvas.style.display = 'none';
    canvas.style.backgroundColor = 'black';
    document.body.appendChild(canvas);

    let game = null;

    // Création du bouton
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
            canvas.style.zIndex = '999';
            
            if (!game) {
                game = new Pacman(canvas);
            } else {
                game.reset();
            }
            game.start();
        } else {
            canvas.style.display = 'none';
            if (game) {
                game.stop();
            }
        }
    });

    document.body.appendChild(toggleButton);
}); 