# Portfolio Étudiant BTS SIO SISR

Ce portfolio a été créé pour présenter les compétences et réalisations d'un étudiant en BTS SIO option SISR, dans le cadre de l'épreuve E5 et pour une utilisation professionnelle.

## Structure du Site

Le site est composé des sections suivantes :

- **Accueil** : Présentation rapide et coordonnées
- **Parcours** : Timeline des études et expériences
- **Certifications** : Grille des certifications obtenues (RGPD, ANSSI, etc.)
- **Veille informatique** : Présentation des sujets suivis
- **Projets** : Présentation des projets réalisés
- **Documentation** : Arborescence des projets et documentations techniques
- **Épreuve E5** : Présentation de l'épreuve avec accès à la documentation

## Fonctionnalités

- Design responsive (mobile, tablette, desktop)
- Arrière-plan flouté avec effet de profondeur
- Animations au défilement
- Navigation fluide
- Liens vers les réseaux professionnels

## Structure des Dossiers

```
portfolio/
├── assets/
│   ├── backgrounds/    # Images d'arrière-plan
│   ├── certifications/ # Badges et images des certifications
│   └── images/        # Images générales du site
├── css/
│   ├── style.css      # Styles principaux
│   └── documentation.css # Styles spécifiques à la documentation
├── js/
│   ├── header.js      # Gestion du header
│   └── main.js        # Fonctionnalités principales
└── *.html             # Pages du site
```

## Comment Modifier le Contenu

### Images
1. Placez vos images dans les dossiers appropriés :
   - `assets/backgrounds/` pour les images d'arrière-plan
   - `assets/certifications/` pour les badges de certification
   - `assets/images/` pour les autres images
2. Mettez à jour les chemins dans les fichiers HTML correspondants

### Textes
1. Ouvrez le fichier HTML correspondant à la section à modifier
2. Modifiez le contenu entre les balises appropriées

### Projets
1. Pour ajouter un projet, copiez le template de projet dans `projets.html`
2. Mettez à jour les informations (titre, description, technologies, liens)

## Déploiement sur GitHub Pages

1. Créez un nouveau repository sur GitHub
2. Clonez le repository en local
3. Copiez tous les fichiers du portfolio dans le repository
4. Committez et poussez les changements :
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```
5. Dans les paramètres du repository GitHub :
   - Allez dans "Settings" > "Pages"
   - Dans "Source", sélectionnez "main" comme branche
   - Cliquez sur "Save"
6. Votre site sera accessible à l'adresse : `https://votre-username.github.io/nom-du-repo`

## Technologies Utilisées

- HTML5
- CSS3
- JavaScript (Vanilla)
- GitHub Pages pour l'hébergement 