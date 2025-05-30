// Mode Agent Secret - Transforme le portfolio en une mission de cybersécurité
const secretAgent = {
    isActive: false,
    sequence: '',
    missionLevel: 1,
    terminal: null,
    glitchEffect: null,
    soundEffects: {
        type: new Audio('assets/sounds/type.mp3'),
        success: new Audio('assets/sounds/success.mp3'),
        error: new Audio('assets/sounds/error.mp3'),
        mission: new Audio('assets/sounds/mission.mp3')
    },

    init() {
        // Écouter la séquence de touches secrète
        document.addEventListener('keydown', (e) => {
            this.sequence += e.key;
            if (this.sequence.includes('mission')) {
                this.activate();
                this.sequence = '';
            }
        });

        // Créer le terminal caché
        this.createTerminal();
    },

    createTerminal() {
        this.terminal = document.createElement('div');
        this.terminal.className = 'secret-terminal';
        this.terminal.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">MISSION TERMINAL v1.0</span>
                <span class="terminal-status">EN ATTENTE</span>
            </div>
            <div class="terminal-content">
                <div class="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="prompt">></span>
                    <input type="text" class="terminal-input" autofocus>
                </div>
            </div>
        `;
        document.body.appendChild(this.terminal);

        // Gérer les commandes du terminal
        const input = this.terminal.querySelector('.terminal-input');
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                this.handleCommand(input.value);
                input.value = '';
            }
        });
    },

    activate() {
        this.isActive = true;
        this.soundEffects.mission.play();
        
        // Ajouter la classe au body
        document.body.classList.add('mission-mode');
        
        // Activer les effets de glitch
        this.activateGlitchEffect();
        
        // Afficher le terminal
        this.terminal.classList.add('active');
        
        // Message de bienvenue
        this.printToTerminal(`
            ╔════════════════════════════════════════════════════════════╗
            ║                    MISSION INITIÉE                          ║
            ║                                                            ║
            ║  Agent: ${this.generateAgentName()}                        ║
            ║  Niveau: ${this.missionLevel}                              ║
            ║  Objectif: Sécuriser le portfolio                          ║
            ║                                                            ║
            ║  Tapez 'help' pour voir les commandes disponibles          ║
            ╚════════════════════════════════════════════════════════════╝
        `);
    },

    handleCommand(command) {
        this.soundEffects.type.play();
        
        switch(command.toLowerCase()) {
            case 'help':
                this.printToTerminal(`
                    Commandes disponibles:
                    - scan: Analyser le système
                    - hack: Tenter de pénétrer le système
                    - decrypt: Décrypter les messages
                    - mission: Voir la mission en cours
                    - clear: Effacer le terminal
                `);
                break;
                
            case 'scan':
                this.startScan();
                break;
                
            case 'hack':
                this.startHacking();
                break;
                
            case 'decrypt':
                this.startDecryption();
                break;
                
            case 'mission':
                this.showMission();
                break;
                
            case 'clear':
                this.clearTerminal();
                break;
                
            default:
                this.printToTerminal(`Commande non reconnue: ${command}`);
        }
    },

    printToTerminal(text) {
        const output = this.terminal.querySelector('.terminal-output');
        const line = document.createElement('div');
        line.className = 'terminal-line';
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    },

    generateAgentName() {
        const prefixes = ['Agent', 'Officier', 'Spécialiste'];
        const names = ['Shadow', 'Phantom', 'Ghost', 'Echo', 'Zero'];
        return `${prefixes[Math.floor(Math.random() * prefixes.length)]} ${names[Math.floor(Math.random() * names.length)]}`;
    },

    activateGlitchEffect() {
        this.glitchEffect = setInterval(() => {
            if (Math.random() > 0.95) {
                document.body.classList.add('glitch');
                setTimeout(() => {
                    document.body.classList.remove('glitch');
                }, 100);
            }
        }, 1000);
    },

    startScan() {
        this.printToTerminal('Initialisation du scan...');
        let progress = 0;
        const scan = setInterval(() => {
            progress += 10;
            this.printToTerminal(`Scan en cours: ${progress}%`);
            if (progress >= 100) {
                clearInterval(scan);
                this.printToTerminal('Scan terminé. Vulnérabilités détectées: 3');
                this.soundEffects.success.play();
            }
        }, 500);
    },

    startHacking() {
        this.printToTerminal('Tentative de pénétration...');
        const hackSequence = ['Bypass du pare-feu...', 'Injection SQL...', 'Exploitation de vulnérabilité...'];
        let step = 0;
        
        const hack = setInterval(() => {
            if (step < hackSequence.length) {
                this.printToTerminal(hackSequence[step]);
                step++;
            } else {
                clearInterval(hack);
                this.printToTerminal('Accès obtenu!');
                this.soundEffects.success.play();
            }
        }, 1000);
    },

    startDecryption() {
        this.printToTerminal('Décryptage en cours...');
        const message = 'MISSION: Sécuriser le portfolio contre les attaques';
        let decrypted = '';
        let index = 0;
        
        const decrypt = setInterval(() => {
            if (index < message.length) {
                decrypted += message[index];
                this.printToTerminal(decrypted);
                index++;
            } else {
                clearInterval(decrypt);
                this.soundEffects.success.play();
            }
        }, 100);
    },

    showMission() {
        this.printToTerminal(`
            MISSION EN COURS:
            ----------------
            Objectif: Sécuriser le portfolio
            Niveau de difficulté: ${this.missionLevel}
            Points de contrôle: 3/5
            Temps restant: ${this.generateRandomTime()}
        `);
    },

    generateRandomTime() {
        const hours = Math.floor(Math.random() * 24);
        const minutes = Math.floor(Math.random() * 60);
        return `${hours}h ${minutes}m`;
    },

    clearTerminal() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML = '';
    }
};

// Initialiser le mode Agent Secret
document.addEventListener('DOMContentLoaded', () => {
    secretAgent.init();
}); 