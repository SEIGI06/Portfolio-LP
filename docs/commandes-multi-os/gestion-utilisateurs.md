# Commandes de Gestion des Utilisateurs 🧑‍💻

Voici les équivalences des commandes pour gérer les comptes utilisateurs et les groupes.

| Fonctionnalité             | Linux Commande(s)         | Windows Commande(s)     |
|----------------------------|---------------------------|-------------------------|
| Ajouter un utilisateur     | `adduser [nom]`           | `net user [nom] [mdp] /add` |
| Supprimer un utilisateur   | `deluser [nom]`           | `net user [nom] /delete` |
| Modifier un utilisateur    | `usermod [options] [nom]` | `net user [nom] [options]` |
| Ajouter un groupe          | `addgroup [nom]`          | `net localgroup [nom] /add` |
| Supprimer un groupe        | `delgroup [nom]`          | `net localgroup [nom] /delete` |
| Ajouter utilisateur à groupe | `adduser [utilisateur] [groupe]` ou `usermod -aG [groupe] [utilisateur]` | `net localgroup [groupe] [utilisateur] /add` |
| Supprimer utilisateur de groupe | `deluser [utilisateur] [groupe]` ou `gpasswd -d [utilisateur] [groupe]` | `net localgroup [groupe] [utilisateur] /delete` |
| Lister utilisateurs        | `getent passwd` ou `cat /etc/passwd` | `net user`              |
| Lister groupes             | `getent group` ou `cat /etc/group` | `net localgroup`        | 