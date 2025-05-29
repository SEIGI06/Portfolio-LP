# Commandes Processus et Services ⚙️

Voici les équivalences des commandes pour gérer les processus en cours et les services système.

| Fonctionnalité             | Linux Commande(s)         | Windows Commande(s)     |
|----------------------------|---------------------------|-------------------------|
| Afficher processus en cours | `ps aux` ou `top`         | `tasklist`              |
| Terminer un processus      | `kill [PID]` ou `killall [nom]` | `taskkill /PID [PID]` ou `taskkill /IM [nom]` |
| Démarrer un service        | `systemctl start [nom]` (systemd) ou `/etc/init.d/[nom] start` (SysVinit) | `net start [nom]` ou `Start-Service [nom]` (PowerShell) |
| Arrêter un service         | `systemctl stop [nom]` (systemd) ou `/etc/init.d/[nom] stop` (SysVinit) | `net stop [nom]` ou `Stop-Service [nom]` (PowerShell) |
| Redémarrer un service      | `systemctl restart [nom]` (systemd) | `Restart-Service [nom]` (PowerShell) |
| État d'un service          | `systemctl status [nom]` (systemd) | `Get-Service [nom]` (PowerShell) | 