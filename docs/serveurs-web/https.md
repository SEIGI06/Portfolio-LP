# Mise en Place Manuelle du HTTPS 🔒

La mise en place du HTTPS est essentielle pour sécuriser les communications entre le serveur web (Apache) et les clients. Elle utilise des certificats SSL/TLS pour chiffrer les données.

## 1. Obtenir un Certificat SSL/TLS

Vous avez besoin d'un certificat SSL/TLS pour votre domaine. Vous pouvez l'obtenir auprès d'une autorité de certification (commerciale ou gratuite comme Let's Encrypt, mais dans ce cas, la génération et le renouvellement se feront manuellement ou via d'autres scripts).

Vous aurez généralement deux fichiers principaux :

*   Le fichier du certificat (souvent `.crt` ou `.pem`)
*   Le fichier de la clé privée (souvent `.key` ou `.pem`)

Placez ces fichiers sur votre serveur dans un emplacement sécurisé (par exemple, `/etc/ssl/certs/` et `/etc/ssl/private/` sur Debian/Ubuntu).

### Création Manuelle d'un Certificat Auto-signé (pour tests)

Pour les environnements de test ou internes où un certificat publiquement approuvé n'est pas nécessaire, vous pouvez créer un certificat auto-signé avec OpenSSL.

1.  **Générer une clé privée :**

    Cette commande crée une clé privée (sans phrase secrète, `-nodes`) de 2048 bits RSA.

    ```bash
    sudo openssl genrsa -nodes -out /etc/ssl/private/mon-site.key 2048
    ```

2.  **Créer une demande de signature de certificat (CSR) :**

    Cette commande utilise votre clé privée pour créer un fichier CSR. Vous devrez répondre à quelques questions (Pays, Ville, Organisation, Nom Commun/Common Name qui doit être votre nom de domaine).

    ```bash
    sudo openssl req -new -key /etc/ssl/private/mon-site.key -out /etc/ssl/certs/mon-site.csr
    ```

3.  **Générer le certificat auto-signé :**

    Cette commande utilise votre clé privée et le fichier CSR pour créer le certificat auto-signé, valide pour 365 jours (`-days 365`).

    ```bash
    sudo openssl x509 -req -days 365 -in /etc/ssl/certs/mon-site.csr -signkey /etc/ssl/private/mon-site.key -out /etc/ssl/certs/mon-site.crt
    ```

Vous obtiendrez ainsi `mon-site.key` (clé privée) et `mon-site.crt` (certificat). Utilisez les chemins complets vers ces fichiers dans la configuration Apache.

## 2. Configuration d'Apache pour HTTPS

Pour activer le HTTPS sur Apache, vous devez généralement activer le module SSL et configurer un hôte virtuel pour le port 443 (le port standard pour HTTPS).

Assurez-vous que le module SSL est activé :

```bash
sudo a2enmod ssl  # Sur Debian/Ubuntu
sudo systemctl restart apache2
```

Créez ou modifiez le fichier de configuration de votre hôte virtuel pour le HTTPS. Sur Debian/Ubuntu, ces fichiers sont souvent dans `/etc/apache2/sites-available/`. Vous pouvez copier votre fichier de configuration HTTP existant et l'adapter.

Exemple de configuration HTTPS pour un hôte virtuel (fichier `mon-site-ssl.conf` dans `sites-available/`) :

```apache
<VirtualHost *:443>
    ServerName mon-site.local
    DocumentRoot /var/www/mon-site-html
    SSLEngine on
    SSLCertificateFile /chemin/vers/votre/certificat.pem
    SSLCertificateKeyFile /chemin/vers/votre/cle_privee.key

    # Options de sécurité recommandées (peuvent varier)
    SSLProtocol All -SSLv2 -SSLv3 -TLSv1 -TLSv1.1
    SSLCipherSuite "EECDH+AESGCM:EDH+AESGCM:AES256+EECDH:AES256+EDH"
    SSLHonorCipherOrder on
    # Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains"
    # Header always set X-Frame-Options DENY
    # Header always set X-Content-Type-Options nosniff

    ErrorLog ${APACHE_LOG_DIR}/error.log
    CustomLog ${APACHE_LOG_DIR}/access.log combined

    # Inclure d'autres alias, répertoires, etc. si nécessaire
</VirtualHost>
```

*   **`ServerName`** : Votre nom de domaine.
*   **`DocumentRoot`** : Le répertoire contenant les fichiers de votre site.
*   **`SSLEngine on`** : Active le moteur SSL/TLS pour cet hôte virtuel.
*   **`SSLCertificateFile`** : Chemin complet vers votre fichier de certificat.
*   **`SSLCertificateKeyFile`** : Chemin complet vers votre fichier de clé privée.
*   Les directives `SSLProtocol` et `SSLCipherSuite` aident à configurer les chiffrements sécurisés (adaptez selon vos besoins de compatibilité).

Après avoir créé ou modifié le fichier, activez l'hôte virtuel et testez la configuration, puis rechargez Apache :

```bash
sudo a2ensite mon-site-ssl.conf # Sur Debian/Ubuntu
sudo apache2ctl configtest
sudo systemctl reload apache2
```

## 3. Redirection HTTP vers HTTPS

Il est fortement recommandé de rediriger automatiquement les visiteurs qui accèdent à votre site via HTTP (port 80) vers la version HTTPS (port 443). Modifiez le fichier de configuration de votre hôte virtuel HTTP (souvent situé dans `sites-available/`) pour ajouter une règle de redirection :

```apache
<VirtualHost *:80>
    ServerName mon-site.local
    Redirect permanent / https://mon-site.local/
</VirtualHost>
```

Après modification, testez la configuration et rechargez Apache.

## 4. Dépannage Courant

*   **Erreurs de certificat :** Vérifiez les chemins `SSLCertificateFile` et `SSLCertificateKeyFile`. Assurez-vous que les fichiers sont lisibles par l'utilisateur sous lequel Apache s'exécute (`www-data` sur Debian/Ubuntu).
*   **Problèmes de pare-feu :** Assurez-vous que le port 443 est ouvert dans votre pare-feu (`ufw allow https` ou `firewall-cmd --add-service=https`).
*   **Configuration Apache :** Utilisez `sudo apache2ctl configtest` pour vérifier la syntaxe de vos fichiers de configuration après chaque modification.
*   **Contenu Mixte :** Si votre site HTTPS affiche un avertissement de sécurité, cela peut être dû à du contenu (images, scripts, CSS) chargé via HTTP. Assurez-vous que tous les liens dans votre code source utilisent HTTPS ou des chemins relatifs. 