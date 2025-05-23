# Nmap

## Introduction
Nmap (Network Mapper) est un outil open source d'exploration réseau et d'audit de sécurité. Il permet de découvrir des hôtes et des services sur un réseau informatique.

## Contenu à venir
- Installation de Nmap
- Commandes de base
- Types de scans
- Détection des systèmes d'exploitation
- Scripts NSE (Nmap Scripting Engine)
- Bonnes pratiques et éthique

## Exemples de commandes courantes
```bash
# Scan de base
nmap localhost

# Scan de ports spécifiques
nmap -p 80,443,8080 target

# Scan agressif
nmap -A target

# Détection du système d'exploitation
nmap -O target
```

## Ressources utiles
- Documentation officielle Nmap
- Guide de référence des commandes
- Exemples de scripts NSE
- Bonnes pratiques de sécurité 