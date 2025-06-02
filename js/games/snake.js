class Snake {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.gridSize = 15;
        this.snake = [{x: 5, y: 5}];
        this.direction = 'right';
        this.food = this.generateFood();
        this.score = 0;
        this.gameOver = false;
        this.speed = 100;
        this.obstacles = [];
        this.obstacleFrequency = 5;

        // Gestion des touches
        document.addEventListener('keydown', this.handleKeyPress.bind(this));
        
        // Démarrer le jeu
        this.gameLoop();
    }

    handleKeyPress(event) {
        const key = event.key;
        const directions = {
            'ArrowUp': 'up',
            'ArrowDown': 'down',
            'ArrowLeft': 'left',
            'ArrowRight': 'right'
        };

        if (directions[key]) {
            const newDirection = directions[key];
            const opposites = {
                'up': 'down',
                'down': 'up',
                'left': 'right',
                'right': 'left'
            };

            if (this.direction !== opposites[newDirection]) {
                this.direction = newDirection;
            }
        }
    }

    generateFood() {
        const maxX = Math.floor(this.canvas.width / this.gridSize);
        const maxY = Math.floor(this.canvas.height / this.gridSize);
        let food;
        do {
            food = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (
            this.snake.some(segment => segment.x === food.x && segment.y === food.y) ||
            this.obstacles.some(obs => obs.x === food.x && obs.y === food.y)
        );
        return food;
    }

    generateObstacle() {
        const maxX = Math.floor(this.canvas.width / this.gridSize);
        const maxY = Math.floor(this.canvas.height / this.gridSize);
        let obstacle;
        do {
            obstacle = {
                x: Math.floor(Math.random() * maxX),
                y: Math.floor(Math.random() * maxY)
            };
        } while (
            this.snake.some(segment => segment.x === obstacle.x && segment.y === obstacle.y) ||
            this.obstacles.some(obs => obs.x === obstacle.x && obs.y === obstacle.y) ||
            (this.food.x === obstacle.x && this.food.y === obstacle.y)
        );
        return obstacle;
    }

    update() {
        if (this.gameOver) return;

        const head = {...this.snake[0]};
        
        switch(this.direction) {
            case 'up': head.y--; break;
            case 'down': head.y++; break;
            case 'left': head.x--; break;
            case 'right': head.x++; break;
        }

        // Vérifier les collisions avec les murs
        if (head.x < 0 || head.x >= this.canvas.width / this.gridSize ||
            head.y < 0 || head.y >= this.canvas.height / this.gridSize) {
            this.gameOver = true;
            return;
        }

        // Vérifier les collisions avec le serpent
        if (this.snake.some(segment => segment.x === head.x && segment.y === head.y)) {
            this.gameOver = true;
            return;
        }

        // Vérifier les collisions avec les obstacles
        if (this.obstacles.some(obs => obs.x === head.x && obs.y === head.y)) {
            this.gameOver = true;
            return;
        }

        this.snake.unshift(head);

        // Vérifier si le serpent mange la nourriture
        if (head.x === this.food.x && head.y === this.food.y) {
            this.score += 10;
            this.food = this.generateFood();
            
            // Augmenter la vitesse plus rapidement
            this.speed = Math.max(30, this.speed - 8);

            // Ajouter un obstacle tous les X points
            if (this.score % this.obstacleFrequency === 0) {
                this.obstacles.push(this.generateObstacle());
            }
        } else {
            this.snake.pop();
        }
    }

    drawGrid() {
        this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
        this.ctx.lineWidth = 0.5;

        // Lignes verticales
        for (let x = 0; x <= this.canvas.width; x += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, this.canvas.height);
            this.ctx.stroke();
        }

        // Lignes horizontales
        for (let y = 0; y <= this.canvas.height; y += this.gridSize) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(this.canvas.width, y);
            this.ctx.stroke();
        }
    }

    draw() {
        // Effacer le canvas
        this.ctx.fillStyle = '#1a1a2e';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Dessiner la grille
        this.drawGrid();

        // Dessiner les obstacles
        this.ctx.fillStyle = '#666';
        console.log('Drawing obstacles:', this.obstacles);
        this.obstacles.forEach(obstacle => {
            this.ctx.fillRect(
                obstacle.x * this.gridSize,
                obstacle.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
             console.log(`Obstacle at x: ${obstacle.x * this.gridSize}, y: ${obstacle.y * this.gridSize}, size: ${this.gridSize - 2}`);
        });

        // Dessiner le serpent
        this.ctx.fillStyle = '#4CAF50';
        console.log('Drawing snake:', this.snake);
        this.snake.forEach((segment, index) => {
            this.ctx.fillRect(
                segment.x * this.gridSize,
                segment.y * this.gridSize,
                this.gridSize - 2,
                this.gridSize - 2
            );
            console.log(`Snake segment ${index} at x: ${segment.x * this.gridSize}, y: ${segment.y * this.gridSize}, size: ${this.gridSize - 2}`);
        });

        // Dessiner la nourriture
        this.ctx.fillStyle = '#ff0000';
        console.log('Drawing food:', this.food);
        this.ctx.fillRect(
            this.food.x * this.gridSize,
            this.food.y * this.gridSize,
            this.gridSize - 2,
            this.gridSize - 2
        );
         console.log(`Food at x: ${this.food.x * this.gridSize}, y: ${this.food.y * this.gridSize}, size: ${this.gridSize - 2}`);

        // Afficher le score
        this.ctx.fillStyle = '#ffffff';
        this.ctx.font = '20px Arial';
        this.ctx.fillText(`Score: ${this.score}`, 10, 30);

        // Afficher Game Over si nécessaire
        if (this.gameOver) {
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = '#ffffff';
            this.ctx.font = '48px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText('Game Over!', this.canvas.width / 2, this.canvas.height / 2);
            this.ctx.font = '24px Arial';
            this.ctx.fillText(`Score final: ${this.score}`, this.canvas.width / 2, this.canvas.height / 2 + 40);
            this.ctx.fillText('Appuyez sur F5 pour recommencer', this.canvas.width / 2, this.canvas.height / 2 + 80);
        }
    }

    gameLoop() {
        this.update();
        this.draw();
        if (!this.gameOver) {
            setTimeout(() => this.gameLoop(), this.speed);
        }
    }
} 