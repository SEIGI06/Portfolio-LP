# Apache HTTP Server  APACHE 🐘

Apache est un serveur web très populaire, connu pour sa flexibilité et sa large communauté.

## 1. Installation

Sur les systèmes basés sur Debian (comme Ubuntu) :

```bash
sudo apt update
sudo apt install apache2
```

Sur les systèmes basés sur Red Hat (comme CentOS/AlmaLinux/Rocky Linux) :

```bash
sudo dnf install httpd
```

Une fois installé, le service Apache démarre généralement automatiquement. Vous pouvez vérifier son état :

```bash
sudo systemctl status apache2  # Debian/Ubuntu
sudo systemctl status httpd   # Red Hat
```

## 2. Configuration de Base

Le fichier de configuration principal d'Apache est souvent situé à `/etc/apache2/apache2.conf` (Debian/Ubuntu) ou `/etc/httpd/conf/httpd.conf` (Red Hat).

Les configurations des sites web individuels sont généralement stockées dans des fichiers séparés :

*   **Debian/Ubuntu :**
    - Fichiers de configuration des sites disponibles : `/etc/apache2/sites-available/`
    - Fichiers de configuration des sites activés : `/etc/apache2/sites-enabled/`

*   **Red Hat :**
    - Peut utiliser un fichier de configuration principal ou inclure des fichiers dans un répertoire comme `/etc/httpd/conf.d/`

### Créer un Hôte Virtuel Simple

Un hôte virtuel permet d'héberger plusieurs sites web sur le même serveur.

Exemple de configuration pour un site simple (fichier `mon-site.conf` dans `sites-available/` ou `conf.d/`) :

```apache
<VirtualHost *:80>
    ServerAdmin webmaster@localhost
    DocumentRoot /var/www/mon-site-html
    ServerName mon-site.local
    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Après avoir créé le fichier de configuration, activez le site (sur Debian/Ubuntu) et rechargez Apache :

```bash
sudo a2ensite mon-site.conf
sudo systemctl reload apache2
```

Sur Red Hat, assurez-vous que le fichier est bien inclus dans la configuration principale et rechargez :

```bash
sudo systemctl reload httpd
```

Assurez-vous également que le pare-feu autorise le trafic sur le port 80 (et 443 pour HTTPS).

## 3. Mise en Place du HTTPS

Pour sécuriser votre site avec HTTPS, vous aurez besoin d'un certificat SSL/TLS. Le moyen le plus simple d'en obtenir un gratuitement est d'utiliser Let's Encrypt avec Certbot.

Consultez la section [Mise en Place du HTTPS](https.md) pour les instructions détaillées.

## 4. Modules Utiles

Apache utilise des modules pour étendre ses fonctionnalités (SSL, rewrite, etc.). Vous pouvez les activer/désactiver.

```bash
sudo a2enmod ssl   # Activer le module SSL (Debian/Ubuntu)
sudo a2enmod rewrite # Activer le module de réécriture d'URL
sudo systemctl reload apache2
``` 