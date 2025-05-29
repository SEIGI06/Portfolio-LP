# 🐧 Introduction à Linux

---

## 📌 Qu'est-ce que Linux ?

**Linux** est un système d'exploitation libre et open source de type Unix. Il est composé principalement du **noyau Linux** (le "kernel") développé initialement par **Linus Torvalds** en 1991, et d'une multitude d'outils et logiciels provenant du projet **GNU**.

---

## 🧱 Composants principaux de Linux

1. **🔧 Le noyau (kernel)**  
   Le cœur du système. Il gère le matériel, la mémoire, les processus, les fichiers, etc.

2. **💻 Shell**  
   Interface en ligne de commande permettant d'interagir avec le système (bash, zsh…).

3. **📦 Les distributions**  
   Linux n'est pas un système unique. Il existe de nombreuses "distributions", comme :
   - **Debian** (stable, communautaire)
   - **Ubuntu** (basée sur Debian, populaire)
   - **CentOS / AlmaLinux / Rocky Linux** (basées sur Red Hat)
   - **Arch Linux** (minimaliste et personnalisable)
   - **Kali Linux** (orientée sécurité)
   - **Linux Mint** (conviviale pour débutants)

---

## 🆚 Linux vs Windows

| Fonctionnalité         | Linux                            | Windows                      |
|------------------------|----------------------------------|------------------------------|
| Licence                | Libre (GPL)                      | Propriétaire (Microsoft)     |
| Sécurité               | Très robuste, peu de virus       | Plus vulnérable              |
| Personnalisation       | Très élevée                      | Limitée                      |
| Utilisation serveur    | Majoritaire                      | Minoritaire                  |
| Interface graphique    | Optionnelle                      | Obligatoire                  |

---

## 🧠 Pourquoi utiliser Linux ?

- 🔓 **Open source** : transparence du code
- 💸 **Gratuit**
- 💪 **Stable et performant**
- 🔐 **Sécurisé**
- ⚙️ **Personnalisable**
- 🌍 **Communauté active**

---

## 📁 Systèmes de fichiers Linux

- `/` : racine
- `/home` : dossiers utilisateurs
- `/etc` : fichiers de configuration
- `/var` : logs et fichiers variables
- `/bin` et `/usr/bin` : exécutables système

> 📦 Linux utilise généralement les systèmes de fichiers ext4, XFS, Btrfs…

---

## 🔄 Mises à jour et logiciels

- 📦 Utilisation de **gestionnaires de paquets** :
  - `apt` (Debian/Ubuntu)
  - `dnf` (Fedora/RedHat)
  - `pacman` (Arch)
  - `zypper` (OpenSUSE)

- 🎯 Commandes courantes :
  ```bash
  sudo apt update && sudo apt upgrade
  sudo dnf install httpd
  pacman -S firefox
  ```

---

## 🔐 Linux et la sécurité

- 👤 Moins souvent utilisé en tant qu'administrateur (`root`)
- 🔒 Moins exposé aux virus
- 🔥 Pare-feu intégré (iptables, ufw)
- 📁 Droits d'accès puissants et précis

---

## 🧑‍💻 Cas d'utilisation de Linux

- 🖥️ Serveurs web (Apache, Nginx)
- ☁️ Cloud computing (AWS, GCP, Azure)
- 📡 Réseaux et pare-feu (pfSense, OPNsense)
- 🔐 Sécurité informatique (Kali Linux, Tails)
- 💻 Développement logiciel
- 🎓 Apprentissage des systèmes

---

## 📚 Ressources pour apprendre

- 📘 [Le site du zéro / OpenClassrooms – Linux](https://openclassrooms.com/fr/courses/43538-reprenez-le-controle-a-laide-de-linux)
- 📗 [Linux Journey](https://linuxjourney.com/)
- 🎓 [Linux Foundation Training](https://training.linuxfoundation.org/)
- 💬 [Forum Ubuntu-fr](https://forum.ubuntu-fr.org/)
- 📺 [Chris Titus Tech (YouTube)](https://www.youtube.com/c/ChrisTitusTech)

---

> 🧠 Linux est plus qu'un simple système d'exploitation : c'est une philosophie fondée sur la liberté, la collaboration et la maîtrise de son outil informatique.