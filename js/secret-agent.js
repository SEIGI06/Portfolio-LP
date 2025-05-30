// Mode Agent Secret - Terminal Debian Style
const secretAgent = {
    isActive: false,
    sequence: '',
    currentPath: '/home/agent',
    fileSystem: {
        '/home/agent': {
            type: 'directory',
            contents: {
                'documents': {
                    type: 'directory',
                    contents: {
                        'mission.txt': {
                            type: 'file',
                            content: 'MISSION: Sécuriser le portfolio contre les attaques\nNiveau: 1\nStatut: En cours'
                        },
                        'notes.txt': {
                            type: 'file',
                            content: 'Notes importantes:\n- Vérifier les vulnérabilités\n- Mettre à jour les systèmes\n- Renforcer la sécurité'
                        }
                    }
                },
                'tools': {
                    type: 'directory',
                    contents: {
                        'scanner.sh': {
                            type: 'file',
                            content: '#!/bin/bash\necho "Scanner de vulnérabilités v1.0"'
                        },
                        'decrypt.py': {
                            type: 'file',
                            content: '#!/usr/bin/python3\nprint("Module de décryptage")'
                        }
                    }
                },
                'logs': {
                    type: 'directory',
                    contents: {
                        'access.log': {
                            type: 'file',
                            content: '2024-03-15 10:30:15 - Tentative de connexion\n2024-03-15 10:31:20 - Accès autorisé'
                        }
                    }
                }
            }
        }
    },
    terminal: null,
    glitchEffect: null,
    soundEffects: {
        type: new Audio('assets/sounds/type.mp3'),
        success: new Audio('assets/sounds/success.mp3'),
        error: new Audio('assets/sounds/error.mp3'),
        mission: new Audio('assets/sounds/mission.mp3')
    },

    init() {
        document.addEventListener('keydown', (e) => {
            this.sequence += e.key;
            if (this.sequence.includes('mission')) {
                this.activate();
                this.sequence = '';
            }
        });
        this.createTerminal();
    },

    createTerminal() {
        this.terminal = document.createElement('div');
        this.terminal.className = 'secret-terminal';
        this.terminal.innerHTML = `
            <div class="terminal-header">
                <span class="terminal-title">DEBIAN TERMINAL v1.0</span>
                <span class="terminal-status">EN ATTENTE</span>
            </div>
            <div class="terminal-content">
                <div class="terminal-output"></div>
                <div class="terminal-input-line">
                    <span class="prompt">agent@debian:${this.currentPath}$</span>
                    <input type="text" class="terminal-input" autofocus>
                </div>
            </div>
        `;
        document.body.appendChild(this.terminal);

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
        document.body.classList.add('mission-mode');
        this.activateGlitchEffect();
        this.terminal.classList.add('active');
        this.printToTerminal(`
            ╔════════════════════════════════════════════════════════════╗
            ║                    DEBIAN TERMINAL v1.0                     ║
            ║                                                            ║
            ║  Agent: ${this.generateAgentName()}                        ║
            ║  Système: Debian GNU/Linux 12 (bookworm)                   ║
            ║  Shell: /bin/bash                                          ║
            ║                                                            ║
            ║  Tapez 'help' pour voir les commandes disponibles          ║
            ╚════════════════════════════════════════════════════════════╝
        `);
    },

    handleCommand(command) {
        this.soundEffects.type.play();
        const [cmd, ...args] = command.split(' ');

        switch(cmd.toLowerCase()) {
            case 'help':
                this.printToTerminal(`
                    Commandes disponibles:
                    - ls [chemin]: Lister les fichiers
                    - cd [chemin]: Changer de répertoire
                    - cat [fichier]: Afficher le contenu d'un fichier
                    - pwd: Afficher le répertoire courant
                    - clear: Effacer le terminal
                    - scan: Lancer le scanner de vulnérabilités
                    - hack: Tenter de pénétrer le système
                    - decrypt: Décrypter les messages
                `);
                break;

            case 'ls':
                this.listFiles(args[0] || this.currentPath);
                break;

            case 'cd':
                this.changeDirectory(args[0]);
                break;

            case 'cat':
                this.showFileContent(args[0]);
                break;

            case 'pwd':
                this.printToTerminal(this.currentPath);
                break;

            case 'clear':
                this.clearTerminal();
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

            default:
                this.printToTerminal(`Commande non reconnue: ${cmd}`);
        }
    },

    listFiles(path) {
        const targetPath = path.startsWith('/') ? path : `${this.currentPath}/${path}`;
        const dir = this.getDirectory(targetPath);
        
        if (!dir) {
            this.printToTerminal(`ls: impossible d'accéder à '${path}': Aucun fichier ou dossier de ce type`);
            return;
        }

        let output = '';
        for (const [name, item] of Object.entries(dir.contents)) {
            const type = item.type === 'directory' ? 'd' : '-';
            const color = item.type === 'directory' ? '\x1b[34m' : '\x1b[32m';
            output += `${color}${type}rwxr-xr-x 1 agent agent ${name}\x1b[0m\n`;
        }
        this.printToTerminal(output);
    },

    changeDirectory(path) {
        if (!path) {
            this.currentPath = '/home/agent';
            return;
        }

        const targetPath = path.startsWith('/') ? path : `${this.currentPath}/${path}`;
        const dir = this.getDirectory(targetPath);

        if (!dir || dir.type !== 'directory') {
            this.printToTerminal(`cd: ${path}: Aucun fichier ou dossier de ce type`);
            return;
        }

        this.currentPath = targetPath;
        this.updatePrompt();
    },

    showFileContent(path) {
        const targetPath = path.startsWith('/') ? path : `${this.currentPath}/${path}`;
        const file = this.getFile(targetPath);

        if (!file || file.type !== 'file') {
            this.printToTerminal(`cat: ${path}: Aucun fichier de ce type`);
            return;
        }

        this.printToTerminal(file.content);
    },

    getDirectory(path) {
        const parts = path.split('/').filter(Boolean);
        let current = this.fileSystem['/home/agent'];

        for (const part of parts) {
            if (!current.contents[part]) return null;
            current = current.contents[part];
        }

        return current;
    },

    getFile(path) {
        const parts = path.split('/').filter(Boolean);
        let current = this.fileSystem['/home/agent'];

        for (let i = 0; i < parts.length - 1; i++) {
            if (!current.contents[parts[i]]) return null;
            current = current.contents[parts[i]];
        }

        return current.contents[parts[parts.length - 1]];
    },

    updatePrompt() {
        const prompt = this.terminal.querySelector('.prompt');
        prompt.textContent = `agent@debian:${this.currentPath}$`;
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

    clearTerminal() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML = '';
    }
};

// Initialiser le mode Agent Secret
document.addEventListener('DOMContentLoaded', () => {
    secretAgent.init();
}); 