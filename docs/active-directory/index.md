# Active Directory (AD) – Contrôleur de Domaine 📚

## 1. Prérequis ⚙️
- **Type d'environnement** : Machine Virtuelle (VM) recommandée  
- **RAM** : Minimum 4 Go (8 Go conseillé pour de meilleures performances)  
- **CPU** : 2 cores minimum  
- **Disque** : 60 Go minimum (suffisant pour Windows Server + AD)  
- **Système d'exploitation** : Windows Server 2019 ou 2022 (version Standard ou Datacenter)  
- **Réseau** : Adresse IP statique configurée sur la VM  
- **Nom de la machine** : Doit être configuré avant l'installation, éviter les noms génériques  

## 2. Installation / Mise en place 🛠️
1. Installer Windows Server sur la VM avec les dernières mises à jour.  
2. Configurer une adresse IP statique dans les paramètres réseau.  
3. Renommer la machine si nécessaire, puis redémarrer.  
4. Ouvrir le **Gestionnaire de serveur** (Server Manager).  
5. Cliquer sur **Ajouter des rôles et fonctionnalités**.  
6. Sélectionner **Installation basée sur un rôle ou une fonctionnalité**, puis choisir la VM.  
7. Cocher la case **Services de domaine Active Directory (AD DS)**, puis cliquer sur **Suivant**.  
8. Confirmer les fonctionnalités requises et lancer l'installation du rôle.  
9. Une fois installé, dans le Gestionnaire de serveur, cliquer sur la notification pour **Promouvoir ce serveur en contrôleur de domaine**.  
10. Choisir **Ajouter une nouvelle forêt** si c'est le premier contrôleur, et saisir le nom du domaine (exemple : monentreprise.local).  
11. Configurer les options du contrôleur :  
    - Niveau fonctionnel de la forêt et du domaine (choisir la version la plus récente compatible).  
    - Mot de passe du mode restauration des services d'annuaire (DSRM).  
12. Valider les options DNS (installer le service DNS si demandé).  
13. Vérifier le chemin des dossiers de la base de données, des journaux et SYSVOL (laisser par défaut généralement).  
14. Lancer l'installation, la machine redémarrera automatiquement.  

## 3. Ajouts / Configurations complémentaires fréquentes ➕

### 3.1 Installation et configuration du rôle DNS 🌐
Le rôle DNS est souvent installé automatiquement avec Active Directory, mais voici comment vérifier et configurer :  
1. Ouvrir le **Gestionnaire de serveur** > **Outils** > **DNS**.  
2. Dans la console DNS, vérifier que le serveur DNS local apparaît bien.  
3. Développer l'arborescence pour voir les zones directes et inverses.  
4. Vérifier que la zone correspondant à votre domaine (ex : monentreprise.local) existe.  
5. Si elle n'existe pas, faire un clic droit sur **Zones de recherche directe** > **Nouvelle zone** > suivre l'assistant pour créer une zone principale et intégrée à Active Directory.  
6. Vérifier que les enregistrements nécessaires (_A_ pour contrôleur, _SRV_ pour services AD) sont bien présents.  

---

### 3.2 Installation et configuration du rôle DHCP 📡

1. Dans le **Gestionnaire de serveur**, cliquer sur **Ajouter des rôles et fonctionnalités**.  
2. Sélectionner **Installation basée sur un rôle ou une fonctionnalité**, puis choisir votre serveur.  
3. Cocher **Serveur DHCP**, valider les dépendances et installer.  
4. Une fois l'installation terminée, ouvrir la console DHCP : **Gestionnaire de serveur** > **Outils** > **DHCP**.  
5. Dans la console, faire un clic droit sur le serveur DHCP > **Autoriser** (nécessaire pour que le serveur délivre des adresses dans un environnement AD).  
6. Configurer une nouvelle plage d'adresses (scope) :  
   - Clic droit sur **IPv4** > **Nouvelle plage**.  
   - Nommer la plage (exemple : Plage principale).  
   - Définir l'adresse de début (ex : 192.168.1.100) et l'adresse de fin (ex : 192.168.1.200).  
   - Définir le masque de sous-réseau (ex : 255.255.255.0).  
   - Configurer les exclusions si besoin (adresses IP à ne pas attribuer).  
   - Définir la durée du bail (temps pendant lequel une adresse est attribuée).  
   - Configurer les options DHCP :  
     - Passerelle par défaut (ex : 192.168.1.1).  
     - Serveurs DNS (mettre l'IP du serveur DNS local ou autre).  
   - Valider la création de la plage.  
7. Vérifier que le service DHCP est démarré et fonctionne correctement.  
8. Tester en connectant un client en DHCP et vérifier qu'il obtient une adresse dans la plage.  

---

### 3.3 Création des Unités d'Organisation (OU) 📁

1. Ouvrir la console **Utilisateurs et ordinateurs Active Directory** :  
   - Dans le Gestionnaire de serveur > **Outils** > **Utilisateurs et ordinateurs Active Directory**.  
2. Développer votre domaine.  
3. Clic droit sur le domaine > **Nouveau** > **Unité d'organisation**.  
4. Nommer l'OU (ex : "Utilisateurs", "Postes de travail", "Serveurs").  
5. Créer autant d'OU que nécessaire pour organiser les objets (utilisateurs, ordinateurs).  
6. Les OU permettent de mieux gérer les permissions et appliquer des stratégies de groupe spécifiques.  

---

### 3.4 Ajout de comptes utilisateurs et groupes 👥

1. Dans la console **Utilisateurs et ordinateurs Active Directory**, sélectionner l'OU où ajouter un utilisateur.  
2. Clic droit sur l'OU > **Nouveau** > **Utilisateur**.  
3. Remplir les informations (nom, prénom, login, mot de passe).  
4. Configurer les options de mot de passe (expiration, changement à la première connexion, etc.).  
5. Pour créer un groupe : clic droit sur l'OU > **Nouveau** > **Groupe**.  
6. Nommer le groupe, choisir le type (sécurité ou distribution) et la portée (global, local, universel).  
7. Ajouter les utilisateurs dans les groupes selon les besoins.  
8. Les groupes facilitent la gestion des permissions sur les ressources réseau.  

## 4. Sécurisation 🔐
- Restreindre les droits administrateurs du domaine aux utilisateurs nécessaires uniquement.  
- Configurer des stratégies de groupe (GPO) pour appliquer des règles de sécurité :  
  - Mot de passe complexe et expiration régulière.  
  - Verrouillage de session après plusieurs tentatives infructueuses.  
  - Restrictions sur les accès aux ressources partagées.  
- Sauvegarder régulièrement l'état du système et la base Active Directory (ex : via Windows Server Backup).  
- Mettre à jour régulièrement le serveur pour appliquer les correctifs de sécurité.  
- Surveiller les journaux d'événements de sécurité et détecter toute activité anormale ou suspecte.  
- Restreindre l'accès physique et réseau au serveur AD.  

## 5. Ressources utiles 📎
- [Documentation Microsoft sur Active Directory](https://learn.microsoft.com/fr-fr/windows-server/identity/active-directory-domain-services)  
- [Tutoriel vidéo AD DS sur Windows Server 2019](https://www.youtube.com/watch?v=U1ywR2nFt4k)  
- [Guide installation DHCP Server sur Windows](https://learn.microsoft.com/fr-fr/windows-server/networking/technologies/dhcp/dhcp-deploy-server)  
- [Gestion des utilisateurs et groupes AD](https://learn.microsoft.com/fr-fr/windows-server/identity/ad-ds/manage/understand-user-accounts)  
