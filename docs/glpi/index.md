# 📦 GLPI – Gestionnaire Libre de Parc Informatique

---

## 🔧 1. PRÉREQUIS

| Élément        | Configuration recommandée       |
|----------------|----------------------------------|
| 💻 Environnement | Machine virtuelle (VM)         |
| 🧱 OS           | Debian 11 ou 12                 |
| 🧠 RAM          | 2 Go minimum (4 Go conseillé)  |
| ⚙️ CPU          | 2 vCPU                         |
| 💾 Disque       | 20 Go (ou plus selon parc)     |
| 🌐 Réseau       | Accès Internet requis          |

> ℹ️ GLPI repose sur une stack **LAMP** (Linux + Apache + MariaDB + PHP)

---

## 🛠️ 2. INSTALLATION DE GLPI

### Étape 1 : Installation des dépendances système

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install apache2 mariadb-server php php-mysql php-xml php-curl php-mbstring php-imap php-gd php-intl php-zip php-bz2 php-ldap unzip wget -y
```

### Étape 2 : Configuration de MariaDB

```bash
sudo mysql_secure_installation
```

Créer la base et l’utilisateur :

```sql
CREATE DATABASE glpi;
CREATE USER 'glpiuser'@'localhost' IDENTIFIED BY 'MotDePasseFort';
GRANT ALL PRIVILEGES ON glpi.* TO 'glpiuser'@'localhost';
FLUSH PRIVILEGES;
```

### Étape 3 : Installation de GLPI

```bash
cd /tmp
wget https://github.com/glpi-project/glpi/releases/download/10.0.15/glpi-10.0.15.tgz
tar -xvzf glpi-10.0.15.tgz
sudo mv glpi /var/www/html/
sudo chown -R www-data:www-data /var/www/html/glpi
sudo chmod -R 755 /var/www/html/glpi
```

### Étape 4 : Création d’un hôte virtuel Apache

```bash
sudo nano /etc/apache2/sites-available/glpi.conf
```

Contenu :

```apache
<VirtualHost *:80>
    DocumentRoot /var/www/html/glpi
    ServerName glpi.local
    <Directory /var/www/html/glpi>
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

Puis :

```bash
sudo a2ensite glpi
sudo a2enmod rewrite
sudo systemctl reload apache2
```

Ajouter `glpi.local` dans `/etc/hosts`.

---

### Étape 5 : Accès au navigateur

Accéder à : `http://glpi.local`  
Suivre l’installation graphique :

- Langue : Français
- Licence : Acceptée
- BDD : localhost, glpiuser, MotDePasseFort
- Création automatique des tables

---

## ⚙️ 3. CONFIGURATION INITIALE

### 3.1 Connexion initiale

| Utilisateur | Mot de passe |
|-------------|--------------|
| glpi        | glpi         |

Changer tous les mots de passe initiaux dans **Administration > Utilisateurs**.

### 3.2 Configuration de l’entité

**Configuration > Entité > Racine**  
Définir les infos de l’organisation : nom, logo, etc.

### 3.3 Création des catégories

**Configuration > Dropdowns**  
Ajouter :
- Types de matériel
- Systèmes d’exploitation
- Logiciels

---

## ➕ 4. AJOUTS UTILES

### 4.1 Plugin FusionInventory 🤖

Permet l’inventaire automatique du parc.

#### Étapes :

1. Télécharger depuis : https://plugins.glpi-project.org/#/plugin/fusioninventory  
2. Décompresser dans `/var/www/html/glpi/plugins/`
3. Activer dans **Plugins**
4. Installer l’agent sur les postes clients :  
   https://fusioninventory.org/documentation/agent/

> 🟢 L’agent remonte l’IP, la RAM, le stockage, les logiciels, etc.

---

### 4.2 Module de tickets 🎫

1. Aller dans **Assistance**
2. Activer l’option "Créer un ticket"
3. Ajouter des techniciens et groupes d'intervention

> Permet de centraliser les demandes des utilisateurs.

---

### 4.3 Configuration des notifications mails 📬

**Configuration > Notifications > Mail** :

- Ajouter un serveur SMTP (ex : Gmail, Exchange)
- Créer des modèles de notifications (création de ticket, assignation, résolution)

---

## 🔐 5. SÉCURISATION

- 🔒 Changer les mots de passe par défaut
- 🧑‍💼 Définir des **profils utilisateurs** (admin, technicien, utilisateur simple)
- 🔐 Activer HTTPS (avec Certbot + Let’s Encrypt)
- 🗃️ Sauvegarde régulière de la base :

```bash
mysqldump -u root -p glpi > /home/user/sauvegarde_glpi.sql
```

- 📜 Activer les logs internes de GLPI
- 🔍 Vérifier les droits sur `/var/www/html/glpi`

---

## 📎 6. RESSOURCES

- 🌐 [Site officiel GLPI](https://glpi-project.org)
- 📘 [Documentation utilisateur](https://glpi-user-documentation.readthedocs.io/fr/latest/)
- 🎥 [Tutoriels YouTube – GLPI](https://www.youtube.com/results?search_query=installer+GLPI)
- 🤖 [Plugin FusionInventory](https://fusioninventory.org/)
- 💬 [Forum communautaire](https://forum.glpi-project.org/)

---

> ✅ GLPI est idéal pour gérer un parc informatique, les demandes de support, et centraliser les informations matérielles et logicielles d'une entreprise.