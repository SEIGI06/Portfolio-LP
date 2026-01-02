# 🔐 Sécurité Supabase - FAQ

## ❓ Est-ce que ma clé ANON est sécurisée dans le code ?

### ✅ OUI, c'est normal et sécurisé !

Votre `SUPABASE_ANON_KEY` est **conçue pour être publique**. C'est une clé anonyme qui :

1. **Doit être exposée** côté client (dans le JavaScript)
2. **Est protégée** par Row Level Security (RLS) dans Supabase
3. **Permet uniquement** ce que vos policies autorisent (lecture seule)

### 🔒 Votre sécurité actuelle

Dans votre configuration :

- ✅ RLS activé sur toutes les tables
- ✅ Policies de lecture publique uniquement
- ✅ Aucune écriture possible avec l'ANON key
- ✅ Les données sensibles nécessitent une authentification

---

## 🤔 Variables d'environnement Vercel

### ❌ Ne fonctionnent PAS avec HTML statique

Les variables d'environnement Vercel sont injectées au **build time** et fonctionnent avec :

- ✅ Next.js / React / Vue (frameworks avec build)
- ✅ API Routes / Serverless Functions
- ❌ **HTML/JS statique** (votre cas actuel)

### Pourquoi ?

Votre site est du **HTML pur** sans étape de build. Vercel sert directement vos fichiers HTML/JS sans transformation.

---

## 💡 Solutions si vous voulez cacher les clés

### Option 1 : Garder la config actuelle ✅ RECOMMANDÉ

**C'est OK !** Votre clé ANON peut être publique.

**Avantages** :

- Simple, pas de complexité
- Performant (pas d'API intermédiaire)
- Sécurisé grâce à RLS

### Option 2 : Créer une API Vercel Serverless

Si vous voulez vraiment cacher les clés :

1. Créer un dossier `api/` avec des fonctions serverless
2. Les fonctions utilisent les variables d'environnement Vercel
3. Votre frontend appelle ces API au lieu de Supabase directement

**Inconvénients** :

- Plus complexe
- Latence supplémentaire
- Coûts potentiels (fonctions serverless)

### Option 3 : Migrer vers Next.js

Next.js permet d'utiliser des variables d'environnement proprement.

**Inconvénients** :

- Refonte complète du projet
- Plus de complexité
- Overkill pour un portfolio

---

## 🎯 Ma recommandation

### ✅ Gardez la configuration actuelle

Votre setup est **parfait** pour un portfolio :

1. Les clés ANON Supabase sont faites pour être publiques
2. RLS protège vos données
3. Simple et performant
4. C'est la pratique standard pour Supabase

### 📚 Documentation officielle

Supabase recommande officiellement d'exposer l'ANON key :
https://supabase.com/docs/guides/api/api-keys#the-anon-key

> "The anon key is safe to use in a browser if you have enabled Row Level Security for your tables"

---

## 🚀 Pour déployer maintenant

Vos clés sont déjà dans le code, c'est parfait. Déployez simplement :

```bash
git add .
git commit -m "feat: Supabase integration with RLS security"
git push origin main
```

Vercel déploiera automatiquement et tout fonctionnera ! ✨

---

## 🔐 Si vraiment vous voulez masquer les clés

Je peux vous montrer comment créer une simple API Vercel, mais **ce n'est pas nécessaire** pour votre cas.

Dites-moi si vous voulez explorer cette option avancée.
