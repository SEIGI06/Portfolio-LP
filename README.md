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
- Accessibilité améliorée (ARIA labels, rôles sémantiques)
- Chargement optimisé des images (lazy loading)
- SEO optimisé (meta tags, descriptions)
- Mode sombre (en développement)

## Structure des Dossiers

```
portfolio/
├── assets/
│   ├── backgrounds/    # Images d'arrière-plan
│   ├── certifications/ # Badges et images des certifications
│   └── images/        # Images générales du site
├── css/
│   ├── style.css      # Styles principaux
│   ├── e5.css         # Styles spécifiques à l'épreuve E5
│   └── documentation.css # Styles spécifiques à la documentation
├── js/
│   ├── header.js      # Gestion du header
│   └── main.js        # Fonctionnalités principales
├── docs_épreuveE5/    # Documentation de l'épreuve E5
└── *.html            # Pages du site
```

## Comment Modifier le Contenu

### Images
1. Placez vos images dans les dossiers appropriés :
   - `assets/backgrounds/` pour les images d'arrière-plan
   - `assets/certifications/` pour les badges de certification
   - `assets/images/` pour les autres images
2. Mettez à jour les chemins dans les fichiers HTML correspondants
3. Utilisez le format WebP pour une meilleure optimisation

### Textes
1. Ouvrez le fichier HTML correspondant à la section à modifier
2. Modifiez le contenu entre les balises appropriées
3. Assurez-vous de maintenir la structure sémantique (h1, h2, h3, etc.)

### Projets
1. Pour ajouter un projet, copiez le template de projet dans `projets.html`
2. Mettez à jour les informations (titre, description, technologies, liens)
3. Ajoutez les attributs ARIA appropriés pour l'accessibilité

## Bonnes Pratiques

- Utilisez des balises sémantiques HTML5 (`<article>`, `<section>`, etc.)
- Ajoutez des attributs ARIA pour l'accessibilité
- Optimisez les images avant de les ajouter
- Maintenez une structure de titres cohérente
- Utilisez des descriptions alt pertinentes pour les images
- Ajoutez des meta tags pour le SEO

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

- HTML5 (avec focus sur l'accessibilité)
- CSS3 (variables, flexbox, grid)
- JavaScript (Vanilla)
- GitHub Pages pour l'hébergement
- WebP pour l'optimisation des images

## Améliorations Futures

- [ ] Implémentation complète du mode sombre
- [ ] Ajout d'animations plus fluides
- [ ] Optimisation des performances
- [ ] Ajout de tests d'accessibilité
- [ ] Intégration d'un système de blog 