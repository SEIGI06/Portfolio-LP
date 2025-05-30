// Terminal Debian Virtuel - Système Complet
const debianTerminal = {
    // Configuration système
    config: {
        hostname: 'debian-vm',
        kernel: '5.10.0-21-amd64',
        distro: 'Debian GNU/Linux 12 (bookworm)',
        architecture: 'x86_64',
        timezone: 'Europe/Paris',
        locale: 'fr_FR.UTF-8',
        shell: '/bin/bash',
        editor: 'nano',
        pager: 'less',
        umask: '022'
    },

    // État du système
    state: {
        isActive: false,
        currentPath: '/home/user',
        currentUser: 'user',
        sudoEnabled: false,
        lastCommand: '',
        commandHistory: [],
        sequence: '',
        uptime: 0,
        cpu: { usage: 0 },
        environment: {
            PATH: '/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/home/user/.local/bin',
            HOME: '/home/user',
            SHELL: '/bin/bash',
            TERM: 'xterm-256color',
            LANG: 'fr_FR.UTF-8',
            USER: 'user',
            DISPLAY: ':0'
        }
    },

    // Système de fichiers
    fileSystem: {
        '/': {
            type: 'directory',
            permissions: '755',
            owner: 'root',
            group: 'root',
            contents: {
                'bin': { type: 'directory', contents: {} },
                'boot': { type: 'directory', contents: {} },
                'dev': { type: 'directory', contents: {} },
                'etc': {
                    type: 'directory',
                    contents: {
                        'apt': {
                            type: 'directory',
                            contents: {
                                'sources.list': {
                                    type: 'file',
                                    content: 'deb http://deb.debian.org/debian bookworm main\ndeb http://security.debian.org/debian-security bookworm-security main\ndeb http://deb.debian.org/debian bookworm-updates main',
                                    permissions: '644',
                                    owner: 'root',
                                    group: 'root'
                                }
                            }
                        },
                        'network': {
                            type: 'directory',
                            contents: {
                                'interfaces': {
                                    type: 'file',
                                    content: 'auto lo\niface lo inet loopback\n\nauto eth0\niface eth0 inet dhcp',
                                    permissions: '644',
                                    owner: 'root',
                                    group: 'root'
                                }
                            }
                        },
                        'hostname': {
                            type: 'file',
                            content: 'debian-vm',
                            permissions: '644',
                            owner: 'root',
                            group: 'root'
                        },
                        'passwd': {
                            type: 'file',
                            content: 'root:x:0:0:root:/root:/bin/bash\nuser:x:1000:1000:user:/home/user:/bin/bash',
                            permissions: '644',
                            owner: 'root',
                            group: 'root'
                        },
                        'group': {
                            type: 'file',
                            content: 'root:x:0:\nuser:x:1000:',
                            permissions: '644',
                            owner: 'root',
                            group: 'root'
                        }
                    }
                },
                'home': {
                    type: 'directory',
                    contents: {
                        'user': {
                            type: 'directory',
                            permissions: '755',
                            owner: 'user',
                            group: 'user',
                            contents: {
                                'Documents': {
                                    type: 'directory',
                                    contents: {
                                        'projet1.txt': {
                                            type: 'file',
                                            content: 'Notes sur le projet 1\n- Fonctionnalités\n- Architecture\n- Dépendances',
                                            permissions: '644',
                                            owner: 'user',
                                            group: 'user'
                                        }
                                    }
                                },
                                'Projects': {
                                    type: 'directory',
                                    contents: {
                                        'website': {
                                            type: 'directory',
                                            contents: {
                                                'index.html': {
                                                    type: 'file',
                                                    content: '<!DOCTYPE html>\n<html>\n<head>\n<title>Mon Site</title>\n</head>\n<body>\n<h1>Bienvenue</h1>\n</body>\n</html>',
                                                    permissions: '644',
                                                    owner: 'user',
                                                    group: 'user'
                                                }
                                            }
                                        }
                                    }
                                },
                                '.bashrc': {
                                    type: 'file',
                                    content: '# Configuration du shell\nPS1="\\u@\\h:\\w\\$ "\nexport PATH=$PATH:/home/user/.local/bin',
                                    permissions: '644',
                                    owner: 'user',
                                    group: 'user'
                                },
                                '.profile': {
                                    type: 'file',
                                    content: '# Fichier de profil\nif [ -f "$HOME/.bashrc" ]; then\n    . "$HOME/.bashrc"\nfi',
                                    permissions: '644',
                                    owner: 'user',
                                    group: 'user'
                                }
                            }
                        }
                    }
                },
                'lib': { type: 'directory', contents: {} },
                'media': { type: 'directory', contents: {} },
                'mnt': { type: 'directory', contents: {} },
                'opt': { type: 'directory', contents: {} },
                'proc': { type: 'directory', contents: {} },
                'root': { type: 'directory', contents: {} },
                'run': { type: 'directory', contents: {} },
                'sbin': { type: 'directory', contents: {} },
                'srv': { type: 'directory', contents: {} },
                'sys': { type: 'directory', contents: {} },
                'tmp': { type: 'directory', contents: {} },
                'usr': {
                    type: 'directory',
                    contents: {
                        'bin': { type: 'directory', contents: {} },
                        'sbin': { type: 'directory', contents: {} },
                        'local': { type: 'directory', contents: {} }
                    }
                },
                'var': {
                    type: 'directory',
                    contents: {
                        'log': { type: 'directory', contents: {} },
                        'cache': { type: 'directory', contents: {} },
                        'lib': { type: 'directory', contents: {} }
                    }
                }
            }
        }
    },

    // Gestionnaire de paquets
    packageManager: {
        sources: [
            'deb http://deb.debian.org/debian bookworm main',
            'deb http://security.debian.org/debian-security bookworm-security main',
            'deb http://deb.debian.org/debian bookworm-updates main'
        ],
        installed: [
            { name: 'vim', version: '2:8.2.2434', description: 'Vi IMproved - enhanced vi editor' },
            { name: 'git', version: '1:2.30.2', description: 'Version control system' },
            { name: 'python3', version: '3.9.2', description: 'Python programming language' },
            { name: 'nodejs', version: '16.13.0', description: 'JavaScript runtime' },
            { name: 'nginx', version: '1.18.0', description: 'Web server' },
            { name: 'systemd', version: '247.3', description: 'System and service manager' },
            { name: 'bash', version: '5.1.4', description: 'GNU Bourne Again SHell' },
            { name: 'coreutils', version: '8.32', description: 'GNU core utilities' },
            { name: 'grep', version: '3.6', description: 'GNU grep' },
            { name: 'sed', version: '4.7', description: 'GNU stream editor' },
            { name: 'awk', version: '1:5.1.0', description: 'GNU awk' },
            { name: 'tar', version: '1.34', description: 'GNU tar' },
            { name: 'gzip', version: '1.10', description: 'GNU compression utilities' },
            { name: 'openssh-server', version: '8.4p1', description: 'Secure shell server' },
            { name: 'sudo', version: '1.9.5p2', description: 'Execute commands as another user' }
        ],
        available: [
            { name: 'docker', version: '20.10.12', description: 'Container platform' },
            { name: 'postgresql', version: '13.5', description: 'Database server' },
            { name: 'redis-server', version: '6.0.12', description: 'In-memory data store' },
            { name: 'apache2', version: '2.4.54', description: 'Web server' },
            { name: 'mysql-server', version: '8.0.31', description: 'Database server' },
            { name: 'php', version: '7.4.30', description: 'Server-side scripting language' },
            { name: 'ruby', version: '2.7.4', description: 'Object-oriented scripting language' },
            { name: 'golang', version: '1.18.3', description: 'Go programming language' },
            { name: 'rustc', version: '1.58.1', description: 'Rust programming language' },
            { name: 'clang', version: '11.0.1', description: 'C language family frontend for LLVM' }
        ],
        updateCache: function() {
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve('Liste des paquets mise à jour');
                }, 1000);
            });
        },
        install: function(package) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const pkg = this.available.find(p => p.name === package);
                    if (pkg) {
                        this.installed.push(pkg);
                        this.available = this.available.filter(p => p.name !== package);
                        resolve(`${package} installé avec succès`);
                    } else {
                        resolve(`Paquet non trouvé: ${package}`);
                    }
                }, 2000);
            });
        },
        remove: function(package) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const pkg = this.installed.find(p => p.name === package);
                    if (pkg) {
                        this.available.push(pkg);
                        this.installed = this.installed.filter(p => p.name !== package);
                        resolve(`${package} supprimé avec succès`);
                    } else {
                        resolve(`Paquet non trouvé: ${package}`);
                    }
                }, 1000);
            });
        }
    },

    // Système de processus
    processManager: {
        processes: [
            { pid: 1, user: 'root', cpu: '0.0', mem: '0.1', command: 'systemd' },
            { pid: 2, user: 'root', cpu: '0.0', mem: '0.0', command: 'kthreadd' },
            { pid: 3, user: 'root', cpu: '0.0', mem: '0.0', command: 'ksoftirqd/0' },
            { pid: 4, user: 'root', cpu: '0.0', mem: '0.0', command: 'kworker/0:0' },
            { pid: 5, user: 'root', cpu: '0.0', mem: '0.0', command: 'kworker/0:0H' }
        ],
        services: [
            { name: 'ssh', status: 'active', enabled: true },
            { name: 'nginx', status: 'active', enabled: true },
            { name: 'systemd-timesyncd', status: 'active', enabled: true }
        ],
        startService: function(service) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const svc = this.services.find(s => s.name === service);
                    if (svc) {
                        svc.status = 'active';
                        resolve(`Service ${service} démarré`);
                    } else {
                        resolve(`Service non trouvé: ${service}`);
                    }
                }, 1000);
            });
        },
        stopService: function(service) {
            return new Promise((resolve) => {
                setTimeout(() => {
                    const svc = this.services.find(s => s.name === service);
                    if (svc) {
                        svc.status = 'inactive';
                        resolve(`Service ${service} arrêté`);
                    } else {
                        resolve(`Service non trouvé: ${service}`);
                    }
                }, 1000);
            });
        }
    },

    // Système de fichiers
    fileManager: {
        createFile: function(path, content) {
            const parts = path.split('/').filter(Boolean);
            let current = this.fileSystem['/'];
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current.contents[parts[i]]) {
                    current.contents[parts[i]] = {
                        type: 'directory',
                        contents: {}
                    };
                }
                current = current.contents[parts[i]];
            }
            current.contents[parts[parts.length - 1]] = {
                type: 'file',
                content: content,
                permissions: '644',
                owner: this.state.currentUser,
                group: this.state.currentUser
            };
        },
        createDirectory: function(path) {
            const parts = path.split('/').filter(Boolean);
            let current = this.fileSystem['/'];
            for (let i = 0; i < parts.length; i++) {
                if (!current.contents[parts[i]]) {
                    current.contents[parts[i]] = {
                        type: 'directory',
                        contents: {}
                    };
                }
                current = current.contents[parts[i]];
            }
        },
        remove: function(path) {
            const parts = path.split('/').filter(Boolean);
            let current = this.fileSystem['/'];
            for (let i = 0; i < parts.length - 1; i++) {
                if (!current.contents[parts[i]]) return false;
                current = current.contents[parts[i]];
            }
            delete current.contents[parts[parts.length - 1]];
            return true;
        },
        move: function(source, destination) {
            const sourceParts = source.split('/').filter(Boolean);
            const destParts = destination.split('/').filter(Boolean);
            let sourceCurrent = this.fileSystem['/'];
            let destCurrent = this.fileSystem['/'];

            for (let i = 0; i < sourceParts.length - 1; i++) {
                if (!sourceCurrent.contents[sourceParts[i]]) return false;
                sourceCurrent = sourceCurrent.contents[sourceParts[i]];
            }

            for (let i = 0; i < destParts.length - 1; i++) {
                if (!destCurrent.contents[destParts[i]]) {
                    destCurrent.contents[destParts[i]] = {
                        type: 'directory',
                        contents: {}
                    };
                }
                destCurrent = destCurrent.contents[destParts[i]];
            }

            const sourceFile = sourceCurrent.contents[sourceParts[sourceParts.length - 1]];
            if (!sourceFile) return false;

            destCurrent.contents[destParts[destParts.length - 1]] = sourceFile;
            delete sourceCurrent.contents[sourceParts[sourceParts.length - 1]];
            return true;
        }
    },

    // Système de permissions
    permissionManager: {
        checkPermission: function(path, user, operation) {
            const parts = path.split('/').filter(Boolean);
            let current = this.fileSystem['/'];
            for (const part of parts) {
                if (!current.contents[part]) return false;
                current = current.contents[part];
            }

            const permissions = current.permissions;
            const owner = current.owner;
            const group = current.group;

            if (user === 'root') return true;
            if (user === owner) {
                switch(operation) {
                    case 'read': return permissions[0] === 'r';
                    case 'write': return permissions[1] === 'w';
                    case 'execute': return permissions[2] === 'x';
                }
            }
            if (user === group) {
                switch(operation) {
                    case 'read': return permissions[3] === 'r';
                    case 'write': return permissions[4] === 'w';
                    case 'execute': return permissions[5] === 'x';
                }
            }
            switch(operation) {
                case 'read': return permissions[6] === 'r';
                case 'write': return permissions[7] === 'w';
                case 'execute': return permissions[8] === 'x';
            }
        },
        chmod: function(path, mode) {
            const parts = path.split('/').filter(Boolean);
            let current = this.fileSystem['/'];
            for (const part of parts) {
                if (!current.contents[part]) return false;
                current = current.contents[part];
            }
            current.permissions = mode;
            return true;
        },
        chown: function(path, user, group) {
            const parts = path.split('/').filter(Boolean);
            let current = this.fileSystem['/'];
            for (const part of parts) {
                if (!current.contents[part]) return false;
                current = current.contents[part];
            }
            current.owner = user;
            current.group = group;
            return true;
        }
    },

    // Interface du terminal
    terminal: null,
    glitchEffect: null,

    // Initialisation
    init() {
        document.addEventListener('keydown', (e) => {
            if (e.key.length === 1) {  // Ne prendre en compte que les caractères imprimables
                this.state.sequence += e.key;
                if (this.state.sequence.includes('debian')) {
                    this.activate();
                    this.state.sequence = '';
                }
            }
        });
        this.createTerminal();
        this.startSystemUpdates();
    },

    // Mises à jour système
    startSystemUpdates() {
        setInterval(() => {
            this.state.uptime += 1;
        }, 1000);

        setInterval(() => {
            this.state.cpu.usage = Math.floor(Math.random() * 100);
        }, 2000);

        setInterval(() => {
            this.updateNetworkConnections();
        }, 5000);
    },

    // Création du terminal
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
                    <span class="prompt">${this.state.currentUser}@${this.config.hostname}:${this.state.currentPath}$</span>
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

    // Activation du terminal
    activate() {
        this.state.isActive = true;
        document.body.classList.add('mission-mode');
        this.activateGlitchEffect();
        this.terminal.classList.add('active');
        this.printToTerminal(`
            ╔════════════════════════════════════════════════════════════╗
            ║                    DEBIAN TERMINAL v1.0                     ║
            ║                                                            ║
            ║  Système: ${this.config.distro}                            ║
            ║  Kernel: ${this.config.kernel}                             ║
            ║  Architecture: ${this.config.architecture}                  ║
            ║  Shell: ${this.config.shell}                               ║
            ║                                                            ║
            ║  Tapez 'help' pour voir les commandes disponibles          ║
            ╚════════════════════════════════════════════════════════════╝
        `);
    },

    // Gestion des commandes
    handleCommand(command) {
        this.state.lastCommand = command;
        this.state.commandHistory.push(command);
        const [cmd, ...args] = command.split(' ');

        switch(cmd.toLowerCase()) {
            case 'help':
                this.showHelp();
                break;
            case 'ls':
                this.listFiles(args[0] || this.state.currentPath);
                break;
            case 'cd':
                this.changeDirectory(args[0]);
                break;
            case 'pwd':
                this.printToTerminal(this.state.currentPath);
                break;
            case 'cat':
                this.showFileContent(args[0]);
                break;
            case 'mkdir':
                this.createDirectory(args[0]);
                break;
            case 'touch':
                this.createFile(args[0], '');
                break;
            case 'rm':
                this.removeFile(args[0]);
                break;
            case 'mv':
                this.moveFile(args[0], args[1]);
                break;
            case 'cp':
                this.copyFile(args[0], args[1]);
                break;
            case 'chmod':
                this.changePermissions(args[0], args[1]);
                break;
            case 'chown':
                this.changeOwner(args[0], args[1], args[2]);
                break;
            case 'ps':
                this.showProcesses();
                break;
            case 'top':
                this.showTop();
                break;
            case 'df':
                this.showDiskUsage();
                break;
            case 'free':
                this.showMemoryUsage();
                break;
            case 'uname':
                this.showSystemInfo();
                break;
            case 'ifconfig':
                this.showNetworkInterfaces();
                break;
            case 'netstat':
                this.showNetworkConnections();
                break;
            case 'apt':
                this.handleAptCommand(args);
                break;
            case 'systemctl':
                this.handleSystemctlCommand(args);
                break;
            case 'sudo':
                this.handleSudoCommand(args);
                break;
            case 'clear':
                this.clearTerminal();
                break;
            case 'history':
                this.showHistory();
                break;
            case 'echo':
                this.printToTerminal(args.join(' '));
                break;
            case 'date':
                this.showDate();
                break;
            case 'whoami':
                this.printToTerminal(this.state.currentUser);
                break;
            case 'exit':
                this.handleExitCommand();
                break;
            default:
                this.printToTerminal(`Commande non reconnue: ${cmd}`);
        }
    },

    // Méthodes de base
    printToTerminal(text) {
        const output = this.terminal.querySelector('.terminal-output');
        const line = document.createElement('div');
        line.textContent = text;
        output.appendChild(line);
        output.scrollTop = output.scrollHeight;
    },

    clearTerminal() {
        const output = this.terminal.querySelector('.terminal-output');
        output.innerHTML = '';
    },

    showHelp() {
        this.printToTerminal(`
Commandes disponibles:
  help     - Affiche cette aide
  ls       - Liste les fichiers
  cd       - Change de répertoire
  pwd      - Affiche le répertoire courant
  cat      - Affiche le contenu d'un fichier
  mkdir    - Crée un répertoire
  touch    - Crée un fichier vide
  rm       - Supprime un fichier
  mv       - Déplace un fichier
  cp       - Copie un fichier
  chmod    - Change les permissions
  chown    - Change le propriétaire
  ps       - Liste les processus
  top      - Affiche les processus en temps réel
  df       - Affiche l'espace disque
  free     - Affiche la mémoire
  uname    - Affiche les informations système
  ifconfig - Affiche les interfaces réseau
  netstat  - Affiche les connexions réseau
  apt      - Gestionnaire de paquets
  systemctl- Gestionnaire de services
  sudo     - Exécute une commande en tant que root
  clear    - Efface l'écran
  history  - Affiche l'historique
  echo     - Affiche du texte
  date     - Affiche la date
  whoami   - Affiche l'utilisateur courant
  exit     - Quitte le terminal
        `);
    },

    handleExitCommand() {
        this.state.isActive = false;
        document.body.classList.remove('mission-mode');
        this.terminal.classList.remove('active');
        this.clearTerminal();
    }
};

// Initialiser le terminal Debian
document.addEventListener('DOMContentLoaded', () => {
    debianTerminal.init();
}); 