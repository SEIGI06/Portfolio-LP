# Portfolio LP - Supabase Integration

Ce dossier contient les fichiers SQL pour configurer votre base de données Supabase.

## 📁 Fichiers

### `schema.sql`

Schéma complet de la base de données incluant :

- Tables pour les projets, compétences, sections, technologies
- Index pour les performances
- Row Level Security (RLS) pour la sécurité
- Triggers pour la gestion automatique

### `seed.sql`

Données initiales incluant :

- 6 compétences BTS SIO
- 3 projets académiques (Projet 1, 2, 3)
- 1 projet personnel (Lilabs Blog)
- Relations projets ↔ compétences
- Technologies et liens

## 🚀 Installation

1. Ouvrez le [Dashboard Supabase](https://app.supabase.com)
2. SQL Editor → New Query
3. Copiez-collez le contenu de `schema.sql` → Run
4. Nouvelle requête → Copiez-collez `seed.sql` → Run
5. Vérifiez dans Table Editor que les données sont présentes

## 🔐 Sécurité

- RLS activé sur toutes les tables
- Lecture publique uniquement
- Pas d'écriture depuis le frontend

## 📊 Tables créées

- `projects` - Projets académiques et personnels
- `competences` - Compétences BTS SIO
- `project_competences` - Lien projets ↔ compétences
- `project_sections` - Sections détaillées des projets
- `project_technologies` - Technologies utilisées
- `personal_project_links` - Liens externes (GitHub, démos, etc.)
