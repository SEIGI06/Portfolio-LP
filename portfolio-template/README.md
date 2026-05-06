# 🎨 Portfolio Template — Guide de Personnalisation

> Template de portfolio personnel **premium** avec design moderne sombre/clair, animations fluides et structure responsive.

---

## 📁 Structure du Projet

```
portfolio-template/
├── index.html          ← Page principale (tout le contenu est ici)
├── README.md           ← Ce fichier
└── assets/
    ├── style.css       ← Styles + section de personnalisation
    └── main.js         ← Interactions (scroll, thème, formulaire)
```

---

## 🚀 Démarrage Rapide

1. **Ouvrez** `index.html` dans votre navigateur (double-clic dessus)
2. C'est tout ! Aucune installation requise. 🎉

> **Pas besoin de** `npm`, `node`, ou de serveur. Le template fonctionne directement.

---

## ✏️ Comment Personnaliser

### 1. Changer les Couleurs

Ouvrez `assets/style.css` et modifiez la section **🎨 PERSONNALISATION** tout en haut :

```css
:root {
  /* 🎨 COULEUR PRINCIPALE — Votre couleur de marque */
  --color-primary: #3b82f6;           /* ← Changez cette couleur */

  /* 🎨 COULEUR SECONDAIRE — Pour les dégradés */
  --color-secondary: #8b5cf6;         /* ← Et celle-ci */
}
```

**Exemples de palettes :**

| Style | Primary | Secondary |
|-------|---------|-----------|
| 🔵 Bleu (défaut) | `#3b82f6` | `#8b5cf6` |
| 🟢 Émeraude | `#10b981` | `#059669` |
| 🔴 Rouge vif | `#ef4444` | `#f97316` |
| 🟡 Or/Luxe | `#f59e0b` | `#d97706` |
| 🩷 Rose | `#ec4899` | `#8b5cf6` |

> 💡 Utilisez [coolors.co](https://coolors.co) pour créer votre propre palette.

### 2. Changer les Textes

Dans `index.html`, cherchez les commentaires `<!-- EDIT -->` pour localiser chaque zone modifiable :

- **Nom** → Remplacez "Alex Martin" par votre nom
- **Titre/Métier** → "Développeur Web Full-Stack" → votre titre
- **Description** → Adaptez la bio dans la section "À propos"
- **Projets** → Modifiez les 3 cartes de projets
- **Parcours** → Mettez à jour la timeline avec vos expériences
- **Contact** → Personnalisez les placeholders du formulaire
- **Footer** → Liens GitHub, LinkedIn, Email

### 3. Changer la Photo

Dans la section "À propos", remplacez l'URL de l'image :

```html
<img src="VOTRE_IMAGE.jpg" alt="Photo de profil" ... />
```

> 📸 Ratio recommandé : **4:5** (portrait). Placez votre image dans le dossier `assets/`.

### 4. Changer la Police

1. Choisissez une police sur [Google Fonts](https://fonts.google.com/)
2. Remplacez le `<link>` dans `index.html` :

```html
<link href="https://fonts.googleapis.com/css2?family=VOTRE_POLICE:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
```

3. Mettez à jour dans `assets/style.css` :

```css
--font-main: 'VOTRE_POLICE', sans-serif;
```

### 5. Configurer le Formulaire de Contact

Par défaut, le formulaire simule un envoi. Pour un **vrai envoi d'emails** :

1. Créez un compte gratuit sur [Formspree](https://formspree.io)
2. Créez un nouveau formulaire et copiez l'ID
3. Dans `index.html`, remplacez :

```html
<!-- Avant (simulé) -->
<form id="contact-form" class="form">

<!-- Après (réel) -->
<form action="https://formspree.io/f/VOTRE_ID" method="POST" class="form">
```

---

## 🌗 Mode Clair / Sombre

Le template inclut un **toggle de thème** automatique :

- 🌙 Clic pour passer en mode clair
- ☀️ Clic pour revenir en mode sombre
- Le choix est **sauvegardé** dans le navigateur (localStorage)
- Par défaut, le thème s'adapte aux **préférences système** de l'utilisateur

---

## 📱 Responsive Design

Le template est conçu en **mobile-first** et s'adapte à tous les écrans :

| Appareil | Largeur |
|----------|---------|
| 📱 Mobile | 375px → 767px |
| 📟 Tablette | 768px → 1023px |
| 💻 Desktop | 1024px → 1280px+ |

---

## ✨ Fonctionnalités Incluses

- ✅ **Animations au scroll** (fade-in, parallax hero)
- ✅ **Navigation sticky** avec effet de flou au scroll
- ✅ **Mode sombre/clair** avec toggle et sauvegarde
- ✅ **Menu mobile** hamburger avec overlay
- ✅ **Formulaire de contact** avec validation côté client
- ✅ **Timeline interactive** avec hover effects
- ✅ **Cartes de projets** avec glassmorphism et tags
- ✅ **Loading screen** au chargement
- ✅ **Navigation active** (highlight de la section en cours)
- ✅ **Smooth scroll** entre les sections
- ✅ **SEO** basique (meta tags, Open Graph)
- ✅ **Accessibilité** (skip link, ARIA labels, focus states)

---

## 🚀 Déploiement

### Option 1 : Netlify (Recommandé — Gratuit)

1. Allez sur [netlify.com](https://www.netlify.com/)
2. Glissez-déposez tout le dossier `portfolio-template/` sur la page
3. Votre site est en ligne en quelques secondes !

### Option 2 : GitHub Pages (Gratuit)

1. Créez un repository GitHub
2. Uploadez le contenu du dossier `portfolio-template/`
3. Allez dans **Settings > Pages > Source > Deploy from branch**
4. Sélectionnez la branche `main` et le dossier `/ (root)`

### Option 3 : Vercel (Gratuit)

1. Allez sur [vercel.com](https://vercel.com/)
2. Importez votre repository GitHub
3. Déployez en un clic

### Option 4 : Hébergement classique

Uploadez simplement les fichiers via FTP sur votre hébergeur habituel.

---

## 🛠️ Personnalisation Avancée

### Ajouter un projet supplémentaire

Copiez un bloc `<article class="card ...">` dans la section projets et modifiez le contenu.

### Ajouter une étape au parcours

Copiez un bloc `<li class="timeline__item">` dans la section timeline et modifiez les dates et descriptions.

### Modifier les arrondis globaux

Dans `assets/style.css`, section personnalisation :

```css
--radius-sm: 8px;   /* Petits éléments */
--radius-md: 16px;  /* Éléments moyens */
--radius-lg: 24px;  /* Grandes cartes */
```

---

## 📝 Checklist Avant Mise en Ligne

- [ ] Remplacer **tous** les textes placeholder ("Alex Martin", etc.)
- [ ] Ajouter votre **vraie photo** de profil
- [ ] Mettre à jour les **liens sociaux** (GitHub, LinkedIn, Email)
- [ ] Configurer le **formulaire de contact** (Formspree ou autre)
- [ ] Ajouter un **favicon** (générez-le sur [favicon.io](https://favicon.io/))
- [ ] Mettre à jour les **meta tags SEO** et Open Graph
- [ ] Tester sur **mobile** (375px)
- [ ] Tester le **mode clair ET sombre**
- [ ] Vérifier tous les **liens** fonctionnent

---

## 💬 Support

Pour toute question ou demande de modification : **contact@alexmartin.dev**

*(Remplacez par votre email)*

---

Fait avec ❤️ et du code propre.
