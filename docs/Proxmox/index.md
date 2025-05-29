# Proxmox VE – Virtualisation et Conteneurs 🐧

Cette section détaille l'installation et la configuration de Proxmox Virtual Environment.

## 1. Prérequis ⚙️

| Élément        | Configuration recommandée       |
|----------------|----------------------------------|
| 💻 Environnement | Machine physique (bare-metal) ou VM pour test |
| 🧱 OS           | Proxmox VE (Debian-based)       |
| 🧠 RAM          | 8 Go minimum (16 Go recommandé) |
| ⚙️ CPU          | 4 vCPU minimum (multicœur conseillé) |
| 💾 Disque       | 100 Go ou plus (SSD recommandé) |
| 🌐 Réseau       | Accès Internet + IP fixe        |

## 2. Installation 🛠️

L'installation de Proxmox VE s'effectue généralement à partir d'une image ISO.

1. Téléchargez l'image ISO depuis le site officiel de Proxmox.
2. Créez une clé USB bootable ou montez l'ISO sur votre machine.
3. Démarrez la machine à partir de l'ISO.
4. Suivez les étapes de l'installateur graphique.
   - Sélectionnez votre disque d'installation.
   - Configurez les paramètres réseau (IP, passerelle, DNS).
   - Définissez un mot de passe root et une adresse email.
   - L'installation va formater le disque et copier les fichiers.
5. Redémarrez la machine une fois l'installation terminée.

!!! note "Accès à l'interface web"
    Après l'installation, accédez à l'interface web de Proxmox via un navigateur à l'adresse `https://[IP_de_votre_serveur]:8006`.
    Utilisez `root` comme nom d'utilisateur et le mot de passe défini pendant l'installation.

---

## 3. Configurations initiales ➕

### 3.1 Mises à jour 🔄

Il est recommandé de mettre à jour Proxmox après l'installation.

1. Connectez-vous à l'interface web.
2. Sélectionnez votre nœud (serveur).
3. Allez dans l'onglet **>_ Shell**.
4. Exécutez les commandes suivantes :
   ```bash
   apt update
   apt full-upgrade -y
   ```

---

### 3.2 Ajout de stockage 💾

Par défaut, Proxmox utilise le stockage local. Vous pouvez ajouter d'autres types de stockage (NFS, Ceph, iSCSI, etc.).

1. Dans l'interface web, sélectionnez **Datacenter**.
2. Allez dans l'onglet **Storage**.
3. Cliquez sur **Add** et choisissez le type de stockage.
4. Remplissez les informations requises (ID, serveur, export, etc.).

---

## 4. Création de machines virtuelles (VM) et conteneurs (LXC) 📦

### 4.1 Machines virtuelles (VM) 🖥️

1. Téléchargez une image ISO de système d'exploitation (ex: Ubuntu Server) et uploadez-la sur un stockage Proxmox.
2. Cliquez sur **Create VM** en haut à droite.
3. Suivez l'assistant : choisissez le nœud, donnez un nom, sélectionnez l'ISO, configurez le disque dur, le CPU, la mémoire et le réseau.
4. Démarrez la VM et installez le système d'exploitation.

---

### 4.2 Conteneurs (LXC) 🐳

Les conteneurs LXC sont plus légers que les VMs.

1. Téléchargez un template de conteneur (ex: ubuntu-22.04-standard) : sélectionnez un stockage > **>_ Shell** > `pveam update` puis `pveam available` pour voir les templates, et enfin `pveam download [stockage] [template_id]`.
2. Cliquez sur **Create CT** en haut à droite.
3. Suivez l'assistant : choisissez le nœud, donnez un nom et un mot de passe, sélectionnez le template, configurez le disque dur, le CPU, la mémoire et le réseau.
4. Démarrez le conteneur.

---

## 5. Sécurité 🔐

Quelques bonnes pratiques de sécurité pour Proxmox :

- Changez le port par défaut de l'interface web (8006).
- Utilisez des pare-feux pour restreindre l'accès à l'interface d'administration.
- Mettez à jour régulièrement Proxmox et les systèmes d'exploitation invités.
- Configurez l'authentification à deux facteurs.
- Utilisez des utilisateurs avec des permissions limitées plutôt que l'utilisateur root pour les tâches courantes.

---

## 6. Ressources utiles 📎

- [Site officiel de Proxmox VE](https://www.proxmox.com/en/proxmox-ve)
- [Documentation officielle de Proxmox VE](https://pve.proxmox.com/pve-docs/)
- [Forum de la communauté Proxmox](https://forum.proxmox.com/)