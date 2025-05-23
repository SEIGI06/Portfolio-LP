# pfSense – Pare-feu et Routeur Open Source 🔒📡

## 1. Prérequis ⚙️
- **Type d'environnement** : Machine virtuelle (VM) ou installation physique  
- **RAM** : 1 Go minimum (2 Go recommandé)  
- **CPU** : 1 core minimum (2 cores recommandé pour interface web fluide)  
- **Disque** : 10 Go (SSD recommandé pour la réactivité)  
- **ISO à utiliser** : [Télécharger depuis le site officiel](https://www.pfsense.org/download/)  
- **Carte réseau** : 2 interfaces (WAN & LAN) minimum  
- **Connexion internet** : pour télécharger les paquets et mises à jour  

> 🔸 Astuce : Dans une VM, il faut assigner deux cartes réseau (par exemple une en NAT pour le WAN et une en Réseau interne ou bridge pour le LAN).

---

## 2. Installation et mise en service 🛠️

1. Monter l’ISO de pfSense dans la VM.  
2. Démarrer la VM et lancer l’installation (option `Install pfSense`).  
3. Choisir le clavier (`French`) et valider les options par défaut.  
4. Sélectionner le disque cible pour l’installation.  
5. Une fois l’installation terminée, retirer l’ISO et redémarrer.  

### Configuration initiale via l’interface console (écran noir) 🖥️
1. Attribuer les interfaces réseau :  
   - Il va détecter automatiquement les interfaces.  
   - Exemple : `em0 = WAN`, `em1 = LAN`.  
2. Valider les interfaces (taper `y`).  
3. Une adresse IP sera attribuée automatiquement sur le LAN (ex : 192.168.1.1/24).  
4. Connecter un navigateur sur une machine du même réseau et ouvrir :  
   👉 `https://192.168.1.1`  
5. Se connecter avec :  
   - **Identifiant** : `admin`  
   - **Mot de passe** : `pfsense`  

---

## 3. Configuration initiale via l’interface Web 🌐

1. Suivre l’assistant de configuration initiale :  
   - Définir le nom d’hôte, domaine local, DNS.  
   - Choisir les interfaces WAN et LAN.  
   - Configurer le mot de passe administrateur.  
2. Appliquer les modifications et redémarrer l’interface.  
3. Une fois reconnecté, vous êtes prêt à utiliser pfSense !

---

## 4. Ajouts / Configs courantes ➕

### 4.1 Créer un réseau LAN personnalisé 🌍

1. Aller dans **Interfaces > LAN**.  
2. Modifier l’IP LAN si besoin (ex : 192.168.10.1/24).  
3. Appliquer les modifications (⚠️ cela peut vous déconnecter, reconnectez-vous à la nouvelle IP).  

---

### 4.2 Créer des règles de pare-feu 🔥

1. Aller dans **Firewall > Rules > LAN**.  
2. Ajouter une règle pour autoriser le trafic sortant :  
   - **Action** : Pass  
   - **Interface** : LAN  
   - **Protocol** : Any  
   - **Source** : LAN subnet  
   - **Destination** : any  
3. Appliquer les règles 🔁.  

---

### 4.3 Créer des VLAN (si besoin) 🧱

1. Aller dans **Interfaces > Assignments > VLANs**.  
2. Ajouter un VLAN sur une interface physique (ex : VLAN 10 sur em1).  
3. Ensuite, aller dans **Interfaces > Assignments**, ajouter le VLAN comme une interface logique.  
4. Configurer son IP, DHCP si besoin, règles de pare-feu associées.  

---

### 4.4 Activer le DHCP sur le LAN 📡

1. Aller dans **Services > DHCP Server > LAN**.  
2. Activer le serveur DHCP.  
3. Définir une plage IP (ex : 192.168.10.100 à 192.168.10.200).  
4. Configurer les options :  
   - Passerelle par défaut (l’IP de pfSense)  
   - Serveurs DNS  
   - Domaine local  
5. Sauvegarder ✅.

---

### 4.5 Redirections de ports (NAT) 📤

1. Aller dans **Firewall > NAT > Port Forward**.  
2. Cliquer sur **+ Add**.  
3. Exemple : rediriger le port 80 vers un serveur web en LAN.  
   - Interface : WAN  
   - Protocole : TCP  
   - Destination Port : 80  
   - IP cible : IP du serveur web (ex : 192.168.10.10)  
   - Port cible : 80  
4. Sauvegarder et appliquer.  

---

## 5. Sécurisation 🔐

- Changer le mot de passe par défaut **immédiatement**.  
- Créer un utilisateur administrateur dédié et désactiver le compte `admin`.  
- Restreindre l’accès à l’interface web (ex : accessible uniquement depuis un VLAN admin).  
- Activer la double authentification (2FA) dans **System > User Manager**.  
- Sauvegarder la configuration régulièrement (**Diagnostics > Backup & Restore**).  
- Activer des alertes mails (via SMTP) pour les logs critiques.  
- Garder pfSense à jour (**System > Update**).  
- Configurer un blocage automatique sur les connexions suspectes via **pfBlockerNG**.  

---

## 6. Ressources utiles 📎

- 🌐 [Site officiel pfSense](https://www.pfsense.org)  
- 📘 [Documentation complète (Netgate)](https://docs.netgate.com/pfsense/en/latest/)  
- 🎥 [Tutoriel installation pfSense (YouTube)](https://www.youtube.com/watch?v=5GzLS9Xf9qE)  
- 🧰 [Forum pfSense FR (entraide)](https://forum.netgate.com/category/22/francais)  
- 🧪 [pfBlockerNG (filtrage IP et DNS)](https://docs.netgate.com/pfsense/en/latest/packages/pfblocker.html)  

---

> ✅ pfSense est un outil très puissant pour sécuriser et gérer un réseau : idéal pour les projets BTS SIO ou une infrastructure en entreprise.

