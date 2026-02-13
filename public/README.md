# Portfolio Lilian Peyr - BTS SIO SISR

Portfolio professionnel présentant mes projets académiques et personnels dans le cadre de mon BTS SIO option SISR.

## 🌐 Déploiement

**URL de production :** https://portfolio-lp-zeta.vercel.app/

Le site est automatiquement déployé sur Vercel à chaque push sur la branche `main`.

## 🛠️ Technologies

- **Frontend :** HTML5, CSS3, JavaScript (Vanilla)
- **Base de données :** Supabase (PostgreSQL)
- **Hébergement :** Vercel
- **Fonts :** Google Fonts (Outfit)

## 📁 Structure du projet

```
Portfolio-LP/
├── assets/          # Images et ressources
├── css/             # Styles CSS
│   ├── base.css     # Styles de base
│   ├── layout.css   # Mise en page
│   └── components.css # Composants réutilisables
├── js/              # Scripts JavaScript
│   ├── main.js      # Script principal
│   ├── supabase-client.js # Client Supabase
│   └── load-projects.js   # Chargement dynamique des projets
├── supabase/        # Configuration base de données
│   ├── schema.sql   # Schéma de la base de données
│   ├── seed.sql     # Données initiales
│   └── README.md    # Documentation Supabase
├── *.html           # Pages du site
├── sitemap.xml      # Plan du site
├── robots.txt       # Configuration robots
└── vercel.json      # Configuration Vercel
```

## 🗄️ Base de données Supabase

Le portfolio utilise Supabase pour gérer dynamiquement les projets :

### Tables principales :

- `projects` - Projets académiques et personnels
- `competences` - Compétences BTS SIO SISR
- `project_competences` - Relations projets ↔ compétences
- `project_sections` - Sections détaillées (objectifs, machines, etc.)
- `project_technologies` - Technologies utilisées dans chaque projet
- `personal_project_links` - Liens externes (GitHub, démos, etc.)

### Configuration :

1. Créer un projet Supabase
2. Exécuter `supabase/schema.sql` dans le SQL Editor
3. Exécuter `supabase/seed.sql` pour importer les données
4. Vérifier que les credentials dans `js/supabase-client.js` sont corrects

Voir [supabase/README.md](./supabase/README.md) pour plus de détails.

## 🚀 Déploiement local

1. Cloner le repository :

   ```bash
   git clone https://github.com/SEIGI06/Portfolio-LP.git
   cd Portfolio-LP
   ```

2. Ouvrir directement les fichiers HTML dans un navigateur
   ou utiliser un serveur local :

   ```bash
   # Avec Python
   python -m http.server 8000

   # Avec Node.js (http-server)
   npx http-server
   ```

3. Ouvrir http://localhost:8000 dans votre navigateur

## 📊 Fonctionnalités

### ✨ Actuelles :

- Portfolio responsive avec animations
- Gestion dynamique des projets via Supabase
- Matrice de compétences interactive
- SEO optimisé (sitemap, meta tags, etc.)
- Performance optimisée (cache, headers de sécurité)

### 🔮 Évolutions futures :

- Interface d'administration pour gérer les projets
- Système de recherche et filtrage
- Support multilingue (FR/EN)
- Dark/Light mode toggle
- Blog intégré

## 📝 Pages

- `index.html` - Page d'accueil
- `parcours.html` - Mon parcours académique et professionnel
- `projets.html` - Liste des projets (académiques + personnels)
- `projet-1.html`, `projet-2.html`, `projet-3.html` - Détails des projets
- `certifications.html` - Mes certifications
- `documentation.html` - Documentation technique

## 🔒 Sécurité

- Row Level Security (RLS) activé sur Supabase
- Headers de sécurité configurés (CSP, X-Frame-Options, etc.)
- HTTPS forcé sur Vercel
- Pas d'écriture possible depuis le frontend

## 📧 Contact

**Lilian Peyr**

- Email : lpeyr.ledantec@gmail.com
- LinkedIn : [linkedin.com/in/lilian-peyr/](https://www.linkedin.com/in/lilian-peyr/)
- GitHub : [github.com/SEIGI06](https://github.com/SEIGI06)

## 📄 Licence

© 2025 Lilian Peyr - Tous droits réservés

---

**Note :** Ce portfolio est développé dans le cadre de ma formation BTS SIO option SISR au Lycée Félix Le Dantec.
