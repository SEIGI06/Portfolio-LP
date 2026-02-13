# 🚀 Guide de Démarrage Rapide - 5 Minutes

## Étape 1️⃣ : Configuration Supabase (2 minutes)

1. Ouvrez [app.supabase.com](https://app.supabase.com)
2. Sélectionnez votre projet
3. Cliquez sur **SQL Editor** dans le menu de gauche
4. Cliquez sur **New Query**
5. Ouvrez le fichier `supabase/schema.sql` de votre projet
6. Copiez tout le contenu et collez-le dans l'éditeur Supabase
7. Cliquez sur **▶ Run** en bas à droite
8. ✅ Vous devriez voir "Success. No rows returned"

9. Créez une **New Query** (bouton ➕)
10. Ouvrez le fichier `supabase/seed.sql`
11. Copiez tout le contenu et collez-le
12. Cliquez sur **▶ Run**
13. ✅ Vous devriez voir les insertions réussir

14. Vérifiez : **Table Editor** → Vous devriez voir :
    - `projects` : 4 entrées
    - `competences` : 6 entrées
    - `project_competences` : plusieurs entrées

---

## Étape 2️⃣ : Déployer sur Vercel (2 minutes)

Ouvrez PowerShell dans le dossier de votre projet :

```powershell
# 1. Voir les fichiers modifiés/créés
git status

# 2. Ajouter tous les changements
git add .

# 3. Créer un commit
git commit -m "feat: migrate to Vercel with Supabase integration"

# 4. Pousser vers GitHub
git push origin main
```

✅ Vercel déploiera automatiquement !

---

## Étape 3️⃣ : Activer le chargement dynamique (Optionnel - 1 minute)

Si vous voulez que vos projets se chargent depuis Supabase :

1. Ouvrez `projets.html`
2. Juste avant `</body>`, ajoutez :

```html
<!-- Supabase Dynamic Loading -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
<script src="js/supabase-client.js"></script>
<script src="js/load-projects.js"></script>
```

3. Sauvegardez et recommittez :

```powershell
git add projets.html
git commit -m "feat: enable dynamic project loading from Supabase"
git push
```

---

## ✅ Vérification

Une fois déployé, testez :

1. **Site principal** : https://portfolio-lp-zeta.vercel.app/
2. **Interface admin** : https://portfolio-lp-zeta.vercel.app/admin.html
3. **Vérifiez le sitemap** : https://portfolio-lp-zeta.vercel.app/sitemap.xml

---

## 🎯 Ajouter un nouveau projet dans le futur

Via SQL Editor dans Supabase :

```sql
-- Insérer le projet
INSERT INTO projects (title, slug, description, semester, image_url, project_type, order_index)
VALUES (
    'Nouveau Projet',
    'nouveau-projet',
    'Description du projet...',
    'Semestre 4',
    'assets/images/nouveau.png',
    'academic',
    4
);

-- Lier à des compétences (récupérez d'abord les IDs)
INSERT INTO project_competences (project_id, competence_id)
SELECT p.id, c.id
FROM projects p, competences c
WHERE p.slug = 'nouveau-projet'
AND c.name IN ('Mettre à disposition des services');
```

Le projet apparaîtra automatiquement sur votre site ! 🎉

---

## 💡 Commandes utiles

```powershell
# Voir les changements non commités
git status

# Voir l'historique
git log --oneline

# Annuler les changements non commités
git restore .

# Créer une nouvelle branche
git checkout -b nouvelle-fonctionnalite

# Revenir à main
git checkout main
```

---

## 🆘 Problèmes courants

### ❌ "Error: relation does not exist"

→ Vous n'avez pas exécuté `schema.sql` dans Supabase

### ❌ "No data returned" sur le site

→ Vérifiez que `seed.sql` a bien été exécuté

### ❌ Les projets ne se chargent pas dynamiquement

→ Vérifiez que vous avez ajouté les scripts dans `projets.html`

### ❌ Git push rejected

→ Faites d'abord `git pull origin main` puis re-push

---

## 📚 Ressources

- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)
- [Votre README.md](./README.md) - Documentation complète du projet

---

**C'est tout ! Votre portfolio est prêt 🚀**
