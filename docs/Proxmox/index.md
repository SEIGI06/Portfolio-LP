# 🖥️ Prxmox VE – Virtualisation Open Source

---

## 🔧 1. PRÉREQUIS

| Élément        | Configuration recommandée       |
|----------------|----------------------------------|
| 💻 Environnement | Machine physique (bare-metal) ou VM pour test |
| 🧱 OS           | Proxmox VE (Debian-based)       |
| 🧠 RAM          | 8 Go minimum (16 Go recommandé) |
| ⚙️ CPU          | 4 vCPU minimum (multicœur conseillé) |
| 💾 Disque       | 100 Go ou plus (SSD recommandé) |
| 🌐 Réseau       | Accès Internet + IP fixe        |

> ℹ️ Proxmox Virtual Environment est une solution de virtualisation de type hyperviseur basée sur KVM et LXC, avec interface web.

---

## 🛠️ 2. INSTALLATION DE PROXMOX

### Étape 1 : Télécharger l’ISO

- 🔗 https://www.proxmox.com/en/downloads

### Étape 2 : Graver l’ISO sur une clé USB

Utiliser **Rufus**, **balenaEtcher**, ou **Ventoy**.

### Étape 3 : Installation

1. Démarrer sur la clé USB
2. Suivre les étapes de l’installateur :
   - Choix du disque
   - Mot de passe administrateur
   - Adresse IP fixe
   - Nom d’hôte (ex: `proxmox.local`)
   - Fuseau horaire

### Étape 4 : Connexion à l’interface web

Ouvrir dans un navigateur :  
`https://[ip]:8006`  
Ex : `https://192.168.1.100:8006`

---

## ⚙️ 3. CONFIGURATION INITIALE

### 3.1 Interface Web

- Se connecter avec `root` et le mot de passe défini
- Accepter le certificat auto-signé
- Ajouter une **licence gratuite** si besoin ou ignorer le message

### 3.2 Ajout d’un stockage

**Datacenter > Stockage > Ajouter :**
- Type : Directory / LVM / ZFS
- Nom et point de montage (ex : `/mnt/disque1`)

### 3.3 Création d’un bridge réseau

**Datacenter > Node > Réseau > Ajouter bridge**

Permet aux VMs d’avoir accès à Internet via le réseau hôte.

---

## ➕ 4. CRÉATION DE VM

### Étape 1 : Télécharger une ISO

- Aller dans **Datacenter > Node > local > Contenu > Télécharger**
- Ajouter une ISO (ex : Debian, Windows)

### Étape 2 : Créer une VM

1. Cliquer sur **Créer VM**
2. Renseigner :
   - Nom
   - ISO
   - Type de système (Linux/Windows)
   - Disque dur (Taille, type, stockage)
   - CPU, RAM
   - Carte réseau (bridge configuré)

3. Lancer la VM et installer l’OS

---

## 📦 5. CONTAINERS LXC

### Étape 1 : Télécharger un template

**Datacenter > Node > local > Contenu > Templates**

Ex : Debian 12, Ubuntu 22.04

### Étape 2 : Créer un conteneur

**Créer CT > Choisir template > Attribuer ressources > Réseau > Terminer**

> ✅ Avantage : rapide, léger, parfait pour serveurs simples (Web, DNS...)

---

## 🔐 6. SÉCURISATION

- 🔒 Changer le mot de passe root
- 👥 Créer un nouvel utilisateur + rôle limité
- 📜 Configurer un pare-feu :
  - Datacenter > Firewall > Options > Activé
  - Ajouter des règles : SSH, HTTPS uniquement

- 🛡️ Utiliser des **ACLs** pour limiter les droits
- 📥 Sauvegardes régulières des VMs (voir section Backup)
- 🔍 Vérifier les mises à jour :
  ```bash
  apt update && apt dist-upgrade
  ```

---

## 💾 7. BACKUP ET RESTAURATION

### 7.1 Configuration

**Datacenter > Backup > Ajouter tâche**

- Sélectionner les VMs
- Planification (ex : tous les jours à 2h)
- Type : snapshot / stop / suspend
- Stockage de destination

### 7.2 Restauration

**Stockage > Backups > Restaurer > Choisir la VM**

---

## 📎 8. RESSOURCES

- 🌐 [Site officiel Proxmox](https://www.proxmox.com/)
- 📘 [Documentation Proxmox VE](https://pve.proxmox.com/wiki/Main_Page)
- 🎥 [Tutoriels YouTube – Proxmox](https://www.youtube.com/results?search_query=proxmox+tutoriel)
- 💬 [Forum communautaire](https://forum.proxmox.com/)
- 🔧 [Scripts utiles – GitHub](https://github.com/freddan88/proxmox-scripts)

---

> ✅ Proxmox est une solution puissante pour virtualiser serveurs, réseaux et services dans un environnement centralisé.