-- =====================================================
-- GestionFin — Schéma Supabase (PostgreSQL)
-- Exécuter dans : Supabase Dashboard > SQL Editor
-- =====================================================

-- Table des catégories personnalisées
create table if not exists categories (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users(id) on delete cascade not null,
  name       text not null,
  type       text check (type in ('income', 'expense')) not null,
  created_at timestamptz default now() not null,
  unique(user_id, name, type)
);

alter table categories enable row level security;

create policy "Les utilisateurs gèrent leurs propres catégories"
  on categories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Table principale des transactions
create table if not exists transactions (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete cascade not null,
  type        text check (type in ('income', 'expense')) not null,
  amount      numeric(12,2) not null check (amount > 0),
  label       text not null,
  category    text not null,
  date        date not null,
  receipt_url text,
  created_at  timestamptz default now() not null
);

-- Index pour les requêtes fréquentes
create index if not exists idx_transactions_user_date
  on transactions(user_id, date desc);

-- Row Level Security : chaque utilisateur ne voit que ses propres données
alter table transactions enable row level security;

create policy "Les utilisateurs voient leurs propres transactions"
  on transactions for select
  using (auth.uid() = user_id);

create policy "Les utilisateurs créent leurs propres transactions"
  on transactions for insert
  with check (auth.uid() = user_id);

create policy "Les utilisateurs modifient leurs propres transactions"
  on transactions for update
  using (auth.uid() = user_id);

create policy "Les utilisateurs suppriment leurs propres transactions"
  on transactions for delete
  using (auth.uid() = user_id);
