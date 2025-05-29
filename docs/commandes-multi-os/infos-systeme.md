# Commandes d'Informations Système 📊

Voici les équivalences des commandes pour obtenir des informations sur le système.

| Fonctionnalité             | Linux Commande(s)         | Windows Commande(s)     |
|----------------------------|---------------------------|-------------------------|
| Afficher l'OS et le noyau  | `uname -a`                | `systeminfo` (partiel)  |
| Afficher l'utilisation CPU | `top` ou `htop`           | Gestionnaire des tâches |
| Afficher l'utilisation RAM | `free -h`                 | Gestionnaire des tâches |
| Afficher l'espace disque   | `df -h`                   | `dir` ou `Get-DiskFreeSpace` (PowerShell) |
| Afficher les processus     | `ps aux` ou `top`         | `tasklist` ou Gestionnaire des tâches |
| Afficher infos CPU         | `lscpu`                   | `wmic cpu get name` ou `Get-ComputerInfo` (PowerShell) |
| Afficher infos mémoire     | `lsmem` ou `free -h`      | `wmic memorychip get capacity` ou `Get-ComputerInfo` (PowerShell) | 