# Mise en Place du HTTPS 🔒

La mise en place du HTTPS est essentielle pour sécuriser les communications entre le serveur web et les clients. Elle utilise des certificats SSL/TLS pour chiffrer les données.

## Obtenir un Certificat SSL/TLS Gratuit avec Let's Encrypt et Certbot

Let's Encrypt est une autorité de certification gratuite, et Certbot est un outil recommandé pour obtenir et installer facilement des certificats.

### 1. Installation de Certbot

La méthode d'installation de Certbot dépend de votre serveur web et de votre système d'exploitation. Consultez le [site officiel de Certbot](https://certbot.eff.org/instructions) pour les instructions spécifiques à votre configuration.

Par exemple, pour Apache sur Ubuntu :

```bash
sudo apt update
sudo apt install certbot python3-certbot-apache
```

Pour Nginx sur Ubuntu :

```bash
sudo apt update
sudo apt install certbot python3-certbot-nginx
```

### 2. Obtenir et Installer le Certificat

Une fois Certbot installé, vous pouvez obtenir et installer automatiquement un certificat pour votre domaine. Certbot modifiera la configuration de votre serveur web pour activer le HTTPS.

Pour Apache :

```bash
sudo certbot --apache
```

Pour Nginx :

```bash
sudo certbot --nginx
```

Certbot vous posera quelques questions (adresse email, nom de domaine, redirection HTTP vers HTTPS). Suivez les instructions.

### 3. Vérification du Renouvellement Automatique

Les certificats Let's Encrypt ne sont valides que 90 jours. Certbot configure généralement un renouvellement automatique. Vous pouvez tester le processus de renouvellement :

```bash
sudo certbot renew --dry-run
```

Si cette commande s'exécute sans erreur, le renouvellement automatique devrait fonctionner.

## Configuration Manuelle (Avancé)

Si vous ne pouvez pas utiliser Certbot ou si vous avez besoin d'une configuration personnalisée, vous pouvez obtenir un certificat manuellement et configurer votre serveur web en éditant les fichiers de configuration pour spécifier les chemins de votre certificat et de votre clé privée.

Exemple de configuration HTTPS de base (peut varier selon votre serveur et votre distribution) :

```apache
# Exemple pour Apache
<VirtualHost *:443>
    ServerName mon-site.local
    DocumentRoot /var/www/mon-site-html
    SSLEngine on
    SSLCertificateFile /etc/letsencrypt/live/mon-site.local/fullchain.pem
    SSLCertificateKeyFile /etc/letsencrypt/live/mon-site.local/privkey.pem
</VirtualHost>
```

```nginx
# Exemple pour Nginx
server {
    listen 443 ssl;
    server_name mon-site.local;

    ssl_certificate /etc/letsencrypt/live/mon-site.local/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/mon-site.local/privkey.pem;

    # ... autres configurations ...
}
```

Après avoir modifié la configuration, testez-la et rechargez votre serveur web.

## 4. Redirection HTTP vers HTTPS

Il est recommandé de rediriger automatiquement les visiteurs de la version HTTP de votre site vers la version HTTPS. Certbot le propose généralement pendant l'installation, mais vous pouvez le configurer manuellement.

Exemple avec Apache :

```apache
<VirtualHost *:80>
    ServerName mon-site.local
    Redirect permanent / https://mon-site.local/
</VirtualHost>
```

Exemple avec Nginx :

```nginx
server {
    listen 80;
    server_name mon-site.local;
    return 301 https://$host$request_uri;
}
``` 