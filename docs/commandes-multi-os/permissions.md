# Commandes de Permissions 🔐

Voici les équivalences des commandes pour gérer les permissions d'accès aux fichiers et répertoires.

| Fonctionnalité             | Linux Commande(s)         | Windows Commande(s)     |
|----------------------------|---------------------------|-------------------------|
| Modifier permissions (Linux)| `chmod [mode] [fichier]`  | Utiliser l'Explorateur de fichiers ou `icacls` |
| Modifier propriétaire/groupe (Linux)| `chown [utilisateur]:[groupe] [fichier]` | Utiliser l'Explorateur de fichiers ou `icacls` |
| Afficher permissions       | `ls -l`                   | `icacls [fichier]` ou Propriétés du fichier | 