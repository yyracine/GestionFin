# GestionFin — Application de Gestion Financière

Application web de gestion financière personnelle : suivi des revenus et dépenses, visualisations graphiques, et scan de reçus par OCR.

## Stack

- **Frontend** : React 18 + Vite
- **Backend/Auth/DB** : Supabase (PostgreSQL)
- **Graphiques** : Recharts v3
- **OCR** : Tesseract.js
- **Style** : Tailwind CSS

## Configuration Supabase (prérequis)

1. Créer un projet sur [supabase.com](https://supabase.com)
2. Dans **Authentication > Providers**, activer **Email**
3. Dans **SQL Editor**, exécuter le contenu de `supabase_schema.sql`
4. Dans **Project Settings > API**, copier :
   - `Project URL`
   - `anon public` key

## Installation et démarrage

```bash
# 1. Cloner ou télécharger le projet
cd GestionFin

# 2. Créer le fichier d'environnement
cp .env.example .env

# 3. Remplir .env avec vos clés Supabase
#    VITE_SUPABASE_URL=https://xxxxxx.supabase.co
#    VITE_SUPABASE_ANON_KEY=your-anon-key

# 4. Installer les dépendances
npm install

# 5. Démarrer en développement
npm run dev
```

Ouvrir [http://localhost:5173](http://localhost:5173)

## Fonctionnalités

- **Authentification** : Inscription / Connexion par email
- **Transactions** : Ajouter, modifier, supprimer des revenus et dépenses
- **Catégories** : Alimentation, Transport, Loyer, Salaire, etc.
- **Dashboard** : Solde mensuel, graphiques camembert et barres
- **OCR** : Scanner un reçu pour pré-remplir une transaction
- **Historique** : Filtrage par mois et par type

## Build de production

```bash
npm run build
npm run preview
```
