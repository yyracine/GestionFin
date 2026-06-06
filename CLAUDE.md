# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server on http://localhost:5173
npm run build      # Production build (outputs to dist/)
npm run preview    # Preview the production build locally
```

No test runner is configured. There is no lint command in package.json.

## Environment setup

Copy `.env.example` to `.env` and fill in the two Supabase variables before running:

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

The Supabase client (`src/lib/supabase.js`) throws at module load time if these are missing.

## Database setup

Run `supabase_schema.sql` in the Supabase SQL Editor. It creates two tables with RLS enabled:
- `transactions` — user financial records
- `categories` — per-user income/expense category labels (unique constraint on `user_id, name, type`)

After first login, users must visit **Catégories → Charger défauts** to seed their initial categories from the defaults defined in `src/lib/categories.js`.

## Architecture

**Stack:** React 18 + Vite, Supabase (auth + PostgreSQL), Tailwind CSS v3, Recharts v3, Tesseract.js v5, React Router v6.

**No backend.** The React app talks directly to Supabase via its JS client. All data access is gated by Row Level Security (`auth.uid() = user_id`).

### Data flow pattern

All data lives in Supabase. Custom hooks wrap Supabase queries and expose state + mutation functions to pages:

- `useTransactions(filters)` — CRUD for transactions, supports `month` and `type` filters
- `useStats.js` exports three hooks: `useMonthlyStats(month)`, `useCategoryStats(month)`, `useMonthlyTrend()`
- `useCategories(type)` — CRUD for categories, plus `seedDefaults()` to upsert from `src/lib/categories.js`

Each mutation calls `fetch()` after the Supabase write to keep local state in sync (no optimistic updates).

### Auth

`AuthContext.jsx` holds the global session. It calls `supabase.auth.getSession()` on mount and subscribes to `onAuthStateChange`. `ProtectedRoute` and `PublicRoute` wrappers in `App.jsx` redirect unauthenticated or authenticated users respectively.

### Routing

| Path | Page |
|------|------|
| `/auth` | Login / Register |
| `/` | Dashboard (stats + charts) |
| `/transactions` | Transaction list + form |
| `/ocr` | OCR receipt scanner |
| `/categories` | Category management |

### Styling conventions

Tailwind is used throughout. Custom semantic colors are defined in `tailwind.config.js`:
- `primary-{50,100,500,600,700}` — sky blue brand color
- `income` / `income-light` — green
- `expense` / `expense-light` — red

Reusable utility classes (`.btn`, `.btn-primary`, `.btn-secondary`, `.btn-danger`, `.input`, `.label`, `.card`) are defined in `src/index.css`.

### OCR scanner

`OcrScanner.jsx` uses Tesseract.js with `fra` language. `parseOcrResults()` searches the OCR text for total-keyword lines first, then extracts all CFA amounts (`/(\d[\d\s]*(?:[,.]\d+)?)\s*(?:CFA|FCFA|XOF)/gi`) and returns them as clickable chips. The user selects the correct amount before creating a transaction.

### Build chunking

`vite.config.js` splits the bundle into four manual chunks to stay under the 500 KB warning: `vendor`, `charts`, `supabase`, `ocr`.

### Currency

All amounts are formatted with `new Intl.NumberFormat('fr-FR').format(amount)` and displayed with the FCFA suffix.
