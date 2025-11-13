# Portfolio BTS SIO SISR — Lilian Peyr

Portfolio professionnel centré sur mes activités d’administration systèmes, de sécurité et de documentation technique. L’objectif est d’offrir une vitrine claire, accessible et facile à maintenir pour tout contributeur futur.

## Table des matières
1. [Aperçu rapide](#aperçu-rapide)
2. [Architecture du dépôt](#architecture-du-dépôt)
3. [Architecture CSS & JS](#architecture-css--js)
4. [Prérequis & démarrage](#prérequis--démarrage)
5. [Bonnes pratiques de contribution](#bonnes-pratiques-de-contribution)
6. [Qualité, SEO & accessibilité](#qualité-seo--accessibilité)
7. [Ressources & contact](#ressources--contact)

## Aperçu rapide
- **Technologies** : HTML5 sémantique, CSS3 modularisé, JavaScript vanilla léger.
- **Navigation** : en-tête généré dynamiquement, footer commun, cohérence UX entre pages.
- **Principales sections** : Accueil, Parcours, Projets, Certifications, Documentation technique.
- **Modularité** : structure en couches, composants réutilisables, documentation intégrée.

## Architecture du dépôt
```
Portfolio-LP/
├── assets/                 # Images et médias optimisés
├── css/
│   ├── base.css            # Variables, reset, typographie, accessibilité
│   ├── layout.css          # Conteneurs, header/footer, responsive global
│   └── components.css      # Composants (cards, timeline, boutons…)
├── js/
│   ├── header.js           # Construction de l’en-tête & interactions menu
│   └── main.js             # Effets d’apparition & amélioration des liens
├── index.html              # Page d’accueil
├── parcours.html           # Parcours académique et professionnel
├── projets.html            # Réalisations techniques
├── certifications.html     # Certifications & attestations
├── documentation.html      # Documentation technique du dépôt
├── sitemap.xml             # Cartographie SEO
├── robots.txt              # Directives d’indexation
└── README.md               # Présent fichier
```

> La documentation détaillée est disponible dans `documentation.html`. Toute modification structurelle doit être reflétée dans ce README et dans la page de documentation.

## Architecture CSS & JS
- **`base.css`** : définit la palette, les ombres, la typographie, les helpers (`.skip-link`, `.sr-only`) et respecte les préférences utilisateurs (`prefers-reduced-motion`).
- **`layout.css`** : gère la grille, le header sticky avec blur, la navigation mobile (`aria-expanded`) et le footer responsive.
- **`components.css`** : regroupe les composants visuels réutilisables (hero, cartes, boutons, timeline, tableaux, animations d’apparition). Chaque bloc suit une logique BEM simplifiée (`.card`, `.card__media`…).

Le JavaScript est minimaliste :
- `header.js` : insère l’en-tête, active le burger menu et applique un effet d’élévation au défilement.
- `main.js` : observe les éléments `.fade-in-up` pour déclencher l’animation progressive (respect de `prefers-reduced-motion`) et ajoute des indications aria aux liens externes.

## Prérequis & démarrage
1. Cloner le dépôt :
   ```bash
   git clone https://github.com/SEIGI06/Portfolio-LP.git
   cd Portfolio-LP
   ```
2. Ouvrir `index.html` dans un navigateur moderne. Aucun build n’est requis.
3. Pour un serveur local optionnel :
   ```bash
   python -m http.server 8000
   ```
   puis rendez-vous sur <http://localhost:8000>.

## Bonnes pratiques de contribution
- **Branches** : créer une branche dédiée (`feature/nom-fonctionnalité`, `fix/bug-description`).  
- **Commits** : une intention par commit, message clair au format `<type>: <résumé>` (ex. `feat: ajouter section roadmap`).  
- **CSS** : vérifier systématiquement si un composant existant peut être réutilisé. Documenter tout nouveau composant dans la section « Composants » de `documentation.html`.  
- **HTML** : respecter la hiérarchie des titres (`h1` unique), utiliser les balises sémantiques (`section`, `nav`, `main`, `footer`).  
- **Tests manuels** : navigation clavier, affichage mobile (< 640px), compatibilité Firefox/Chromium, validation W3C (optionnel).  
- **Ajout d’assets** : préférer les images compressées (WebP ou JPEG optimisé) et mettre à jour le sitemap en cas de nouvelle page.

## Qualité, SEO & accessibilité
- **Meta & canonical** : chaque page dispose de ses balises meta, d’un titre explicite et d’un lien canonical cohérent.  
- **Sitemap & robots** : `sitemap.xml` et `robots.txt` sont alignés avec les pages actives.  
- **Accessibilité** : focus visibles, contraste suffisant, navigation clavier, prise en compte de `prefers-reduced-motion`.  
- **Performance** : aucun framework, scripts minimes, médias lazy-loaded, pas de dépendances externes bloquantes.

## Ressources & contact
- Documentation technique : `documentation.html`
- Email : [lpeyr.ledantec@gmail.com](mailto:lpeyr.ledantec@gmail.com)
- LinkedIn : [lilian-peyr](https://www.linkedin.com/in/lilian-peyr/)
- GitHub : [SEIGI06](https://github.com/SEIGI06)

---
⭐️ N’hésitez pas à laisser une étoile si ce projet vous inspire ou vous aide à structurer votre propre portfolio !
