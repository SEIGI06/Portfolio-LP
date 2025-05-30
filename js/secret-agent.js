// Mode Agent Secret - Terminal Debian Style
const secretAgent = {
    isActive: false,
    sequence: '',
    currentPath: '/home/agent',
    processes: [],
    systemInfo: {
        hostname: 'debian-agent',
        kernel: '5.10.0-21-amd64',
        uptime: 0,
        memory: {
            total: '8G',
            used: '2.1G',
            free: '5.9G'
        },
        cpu: {
            model: 'Intel(R) Core(TM) i7-10700K',
            cores: 8,
            usage: 0
        }
    },
    network: {
        interfaces: {
            'eth0': {
                ip: '192.168.1.100',
                mac: '00:1a:2b:3c:4d:5e',
                status: 'up'
            },
            'wlan0': {
                ip: '192.168.1.101',
                mac: '00:1a:2b:3c:4d:5f',
                status: 'up'
            }
        },
        connections: []
    },
    packages: {
        installed: [
            { name: 'nmap', version: '7.92', description: 'Network exploration tool' },
            { name: 'wireshark', version: '3.6.2', description: 'Network protocol analyzer' },
            { name: 'metasploit-framework', version: '6.1.27', description: 'Penetration testing framework' },
            { name: 'python3', version: '3.9.2', description: 'Python programming language' },
            { name: 'git', version: '2.30.2', description: 'Version control system' }
        ],
        available: [
            { name: 'john', version: '1.9.0', description: 'Password cracker' },
            { name: 'hydra', version: '9.3', description: 'Password brute force tool' },
            { name: 'aircrack-ng', version: '1.6', description: 'Wireless network security tool' }
        ]
    },
    fileSystem: {
        '/home/agent': {
            type: 'directory',
            contents: {
                'documents': {
                    type: 'directory',
                    contents: {
                        'mission.txt': {
                            type: 'file',
                            content: 'MISSION: Sécuriser le portfolio contre les attaques\nNiveau: 1\nStatut: En cours',
                            permissions: '644',
                            owner: 'agent',
                            group: 'agent',
                            size: '256',
                            modified: '2024-03-15 10:30:00'
                        },
                        'notes.txt': {
                            type: 'file',
                            content: 'Notes importantes:\n- Vérifier les vulnérabilités\n- Mettre à jour les systèmes\n- Renforcer la sécurité',
                            permissions: '644',
                            owner: 'agent',
                            group: 'agent',
                            size: '512',
                            modified: '2024-03-15 10:31:00'
                        }
                    }
                },
                'tools': {
                    type: 'directory',
                    contents: {
                        'scanner.sh': {
                            type: 'file',
                            content: '#!/bin/bash\necho "Scanner de vulnérabilités v1.0"',
                            permissions: '755',
                            owner: 'agent',
                            group: 'agent',
                            size: '128',
                            modified: '2024-03-15 10:32:00'
                        },
                        'decrypt.py': {
                            type: 'file',
                            content: '#!/usr/bin/python3\nprint("Module de décryptage")',
                            permissions: '755',
                            owner: 'agent',
                            group: 'agent',
                            size: '256',
                            modified: '2024-03-15 10:33:00'
                        }
                    }
                },
                'logs': {
                    type: 'directory',
                    contents: {
                        'access.log': {
                            type: 'file',
                            content: '2024-03-15 10:30:15 - Tentative de connexion\n2024-03-15 10:31:20 - Accès autorisé',
                            permissions: '644',
                            owner: 'agent',
                            group: 'agent',
                            size: '1024',
                            modified: '2024-03-15 10:34:00'
                        }
                    }
                },
                '.bashrc': {
                    type: 'file',
                    content: '# Configuration du shell\nPS1="\\u@\\h:\\w\\$ "\nexport PATH=$PATH:/home/agent/tools',
                    permissions: '644',
                    owner: 'agent',
                    group: 'agent',
                    size: '512',
                    modified: '2024-03-15 10:35:00'
                }
            }
        },
        '/etc': {
            type: 'directory',
            contents: {
                'hostname': {
                    type: 'file',
                    content: 'debian-agent',
                    permissions: '644',
                    owner: 'root',
                    group: 'root',
                    size: '32',
                    modified: '2024-03-15 10:36:00'
                },
                'network': {
                    type: 'directory',
                    contents: {
                        'interfaces': {
                            type: 'file',
                            content: 'auto eth0\niface eth0 inet dhcp',
                            permissions: '644',
                            owner: 'root',
                            group: 'root',
                            size: '256',
                            modified: '2024-03-15 10:37:00'
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
        this.startSystemUpdates();
    },

    startSystemUpdates() {
        // Mise à jour de l'uptime
        setInterval(() => {
            this.systemInfo.uptime += 1;
        }, 1000);

        // Mise à jour de l'utilisation CPU
        setInterval(() => {
            this.systemInfo.cpu.usage = Math.floor(Math.random() * 100);
        }, 2000);

        // Mise à jour des connexions réseau
        setInterval(() => {
            this.updateNetworkConnections();
        }, 5000);
    },

    updateNetworkConnections() {
        const ports = [22, 80, 443, 3306, 5432];
        this.network.connections = ports.map(port => ({
            local: `0.0.0.0:${port}`,
            remote: `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}:${Math.floor(Math.random() * 65535)}`,
            state: 'ESTABLISHED',
            program: ['sshd', 'nginx', 'apache2', 'mysql', 'postgres'][ports.indexOf(port)]
        }));
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
            ║  Kernel: ${this.systemInfo.kernel}                         ║
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
                    Commandes système:
                    - ls [chemin]: Lister les fichiers
                    - cd [chemin]: Changer de répertoire
                    - cat [fichier]: Afficher le contenu d'un fichier
                    - pwd: Afficher le répertoire courant
                    - clear: Effacer le terminal
                    - ps: Afficher les processus
                    - top: Afficher les processus en temps réel
                    - df: Afficher l'espace disque
                    - free: Afficher la mémoire
                    - uname: Afficher les informations système
                    - ifconfig: Afficher les interfaces réseau
                    - netstat: Afficher les connexions réseau
                    
                    Commandes de paquets:
                    - apt list: Lister les paquets installés
                    - apt search [terme]: Rechercher des paquets
                    - apt install [paquet]: Installer un paquet
                    
                    Commandes de mission:
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

    showProcesses() {
        const processes = [
            { pid: 1, user: 'root', cpu: '0.0', mem: '0.1', command: 'systemd' },
            { pid: 2, user: 'root', cpu: '0.0', mem: '0.0', command: 'kthreadd' },
            { pid: 3, user: 'root', cpu: '0.0', mem: '0.0', command: 'ksoftirqd/0' },
            { pid: 4, user: 'root', cpu: '0.0', mem: '0.0', command: 'kworker/0:0' },
            { pid: 5, user: 'root', cpu: '0.0', mem: '0.0', command: 'kworker/0:0H' }
        ];

        let output = '  PID USER     %CPU %MEM COMMAND\n';
        processes.forEach(p => {
            output += `${p.pid.toString().padStart(5)} ${p.user.padEnd(8)} ${p.cpu.padStart(4)} ${p.mem.padStart(4)} ${p.command}\n`;
        });
        this.printToTerminal(output);
    },

    showTop() {
        this.printToTerminal(`
            top - ${this.formatUptime(this.systemInfo.uptime)} up ${this.formatUptime(this.systemInfo.uptime)}, 1 user, load average: 0.52, 0.58, 0.59
            Tasks: 100 total, 1 running, 99 sleeping, 0 stopped, 0 zombie
            %Cpu(s): ${this.systemInfo.cpu.usage}.0 us, 0.0 sy, 0.0 ni, ${100 - this.systemInfo.cpu.usage}.0 id, 0.0 wa, 0.0 hi, 0.0 si, 0.0 st
            MiB Mem : ${this.systemInfo.memory.total} total, ${this.systemInfo.memory.free} free, ${this.systemInfo.memory.used} used, 0.0 buff/cache
            MiB Swap: 0.0 total, 0.0 free, 0.0 used. ${this.systemInfo.memory.free} avail Mem
        `);
    },

    showDiskUsage() {
        this.printToTerminal(`
            Filesystem      Size  Used Avail Use% Mounted on
            /dev/sda1       100G   30G   70G  30% /
            tmpfs           3.2G     0  3.2G   0% /dev/shm
            tmpfs           1.6G  1.1M  1.6G   1% /run
            tmpfs           5.0M     0  5.0M   0% /run/lock
        `);
    },

    showMemoryUsage() {
        this.printToTerminal(`
                      total        used        free      shared  buff/cache   available
            Mem:        ${this.systemInfo.memory.total}     ${this.systemInfo.memory.used}     ${this.systemInfo.memory.free}       1.0G        0.0G        ${this.systemInfo.memory.free}
            Swap:       0.0G        0.0G        0.0G
        `);
    },

    showSystemInfo() {
        this.printToTerminal(`
            Linux ${this.systemInfo.hostname} ${this.systemInfo.kernel} #1 SMP Debian 5.10.0-21-amd64 x86_64 GNU/Linux
        `);
    },

    showNetworkInterfaces() {
        let output = '';
        for (const [name, iface] of Object.entries(this.network.interfaces)) {
            output += `
            ${name}: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500
                    inet ${iface.ip}  netmask 255.255.255.0  broadcast 192.168.1.255
                    inet6 fe80::21a:2bff:fe3c:4d5e  prefixlen 64  scopeid 0x20<link>
                    ether ${iface.mac}  txqueuelen 1000  (Ethernet)
                    RX packets 123456  bytes 98765432 (94.2 MiB)
                    RX errors 0  dropped 0  overruns 0  frame 0
                    TX packets 123456  bytes 98765432 (94.2 MiB)
                    TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0
            `;
        }
        this.printToTerminal(output);
    },

    showNetworkConnections() {
        let output = 'Proto Recv-Q Send-Q Local Address           Foreign Address         State       PID/Program name\n';
        this.network.connections.forEach(conn => {
            output += `tcp        0      0 ${conn.local.padEnd(21)} ${conn.remote.padEnd(21)} ${conn.state.padEnd(12)} ${conn.program}\n`;
        });
        this.printToTerminal(output);
    },

    handleAptCommand(args) {
        if (!args.length) {
            this.printToTerminal('apt: commande requise');
            return;
        }

        switch(args[0]) {
            case 'list':
                this.listPackages();
                break;
            case 'search':
                this.searchPackages(args[1]);
                break;
            case 'install':
                this.installPackage(args[1]);
                break;
            default:
                this.printToTerminal(`apt: commande non reconnue: ${args[0]}`);
        }
    },

    listPackages() {
        let output = 'Paquets installés:\n';
        this.packages.installed.forEach(pkg => {
            output += `${pkg.name}/${stable} ${pkg.version} [${pkg.description}]\n`;
        });
        this.printToTerminal(output);
    },

    searchPackages(term) {
        if (!term) {
            this.printToTerminal('apt search: terme de recherche requis');
            return;
        }

        const results = this.packages.available.filter(pkg => 
            pkg.name.includes(term) || pkg.description.includes(term)
        );

        let output = 'Paquets correspondants:\n';
        results.forEach(pkg => {
            output += `${pkg.name} - ${pkg.description}\n`;
        });
        this.printToTerminal(output);
    },

    installPackage(pkg) {
        if (!pkg) {
            this.printToTerminal('apt install: nom du paquet requis');
            return;
        }

        const available = this.packages.available.find(p => p.name === pkg);
        if (!available) {
            this.printToTerminal(`Paquet non trouvé: ${pkg}`);
            return;
        }

        this.printToTerminal(`Installation de ${pkg}...`);
        setTimeout(() => {
            this.packages.installed.push(available);
            this.packages.available = this.packages.available.filter(p => p.name !== pkg);
            this.printToTerminal(`${pkg} installé avec succès`);
        }, 2000);
    },

    formatUptime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        return `${hours}:${minutes.toString().padStart(2, '0')}`;
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