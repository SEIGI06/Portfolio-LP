class Ghost {
    constructor(x, y, color) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.speed = 2;
        this.direction = Math.random() * Math.PI * 2;
        this.radius = 15;
    }

    update(pacman) {
        // Mouvement aléatoire avec tendance à suivre Pacman
        const dx = pacman.x - this.x;
        const dy = pacman.y - this.y;
        const angle = Math.atan2(dy, dx);
        
        // Ajouter un peu d'aléatoire au mouvement
        this.direction += (angle - this.direction) * 0.1 + (Math.random() - 0.5) * 0.2;
        
        this.x += Math.cos(this.direction) * this.speed;
        this.y += Math.sin(this.direction) * this.speed;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI, true);
        ctx.lineTo(this.x + this.radius, this.y + this.radius);
        ctx.lineTo(this.x - this.radius, this.y + this.radius);
        ctx.fillStyle = this.color;
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
        this.setupDots();
        this.setupGhosts();
        this.setupEventListeners();
        this.gameLoop();
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
            const x = Math.random() * this.canvas.width;
            const y = Math.random() * this.canvas.height;
            this.ghosts.push(new Ghost(x, y, colors[i]));
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
            ghost.update(this.pacman);
            
            // Collision avec les fantômes
            const dx = this.pacman.x - ghost.x;
            const dy = this.pacman.y - ghost.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            if (distance < this.pacman.radius + ghost.radius) {
                this.lives--;
                if (this.lives <= 0) {
                    this.gameOver = true;
                } else {
                    // Réinitialiser la position de Pacman
                    this.pacman.x = this.canvas.width / 2;
                    this.pacman.y = this.canvas.height / 2;
                }
            }
        });

        // Vérifier si tous les points sont collectés
        if (this.dots.every(dot => dot.collected)) {
            this.setupDots(); // Réinitialiser les points
        }
    }

    draw() {
        // Effacer le canvas
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
        this.ctx.fillStyle = 'yellow';
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