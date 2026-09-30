-- Sahyog database schema
-- Run this once in your Supabase project's SQL Editor
-- (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- Safe to re-run: uses IF NOT EXISTS / OR REPLACE / guarded seeds.

create extension if not exists "pgcrypto";

-- ─── PROFILES ───────────────────────────────────────────────────
-- One row per signed-up user (the patient whose account it is).
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

drop policy if exists "Users can view their own profile" on public.profiles;
create policy "Users can view their own profile"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "Users can update their own profile" on public.profiles;
create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id);

drop policy if exists "Users can insert their own profile" on public.profiles;
create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Auto-create a profile row whenever someone signs up, using the
-- full_name passed in supabase.auth.signUp({ options: { data } }).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ─── REMINDERS ──────────────────────────────────────────────────
create table if not exists public.reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null check (type in ('medicine','meal','appointment','activity','call','task')),
  title text not null,
  time text not null,
  description text not null default '',
  done boolean not null default false,
  icon text not null default '',
  created_at timestamptz not null default now()
);

alter table public.reminders enable row level security;

drop policy if exists "Users manage their own reminders" on public.reminders;
create policy "Users manage their own reminders"
  on public.reminders for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── MEMORIES ───────────────────────────────────────────────────
create table if not exists public.memories (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  description text not null default '',
  year text not null default '',
  image text not null default '',
  caption text not null default '',
  detail text not null default '',
  created_at timestamptz not null default now()
);

alter table public.memories enable row level security;

drop policy if exists "Users manage their own memories" on public.memories;
create policy "Users manage their own memories"
  on public.memories for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── PEOPLE ─────────────────────────────────────────────────────
create table if not exists public.people (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  relationship text not null default '',
  image text not null default '',
  info text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);

alter table public.people enable row level security;

drop policy if exists "Users manage their own people" on public.people;
create policy "Users manage their own people"
  on public.people for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ─── GAMES ──────────────────────────────────────────────────────
-- Shared app content (not per-user). Readable by any signed-in user;
-- only editable from the Supabase dashboard, not from the client.
create table if not exists public.games (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  icon text not null default '',
  gradient text not null default '',
  created_at timestamptz not null default now()
);

alter table public.games enable row level security;

drop policy if exists "Signed-in users can view games" on public.games;
create policy "Signed-in users can view games"
  on public.games for select
  using (auth.role() = 'authenticated');

-- Seed the three starter games, only if the table is empty.
insert into public.games (title, description, icon, gradient)
select * from (
  values
    ('Picture Matching', 'Match the pictures together.', 'puzzle', 'from-honey-300 to-honey-500'),
    ('Familiar Faces', 'Can you recognize the people you know?', 'users', 'from-sage-300 to-sage-500'),
    ('Memory Puzzle', 'Complete the picture.', 'palette', 'from-coral-300 to-coral-500')
) as seed(title, description, icon, gradient)
where not exists (select 1 from public.games);