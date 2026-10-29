-- =============================================
-- Debattnett Database Schema
-- Run this in your Supabase SQL Editor
-- =============================================

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- =============================================
-- Profiles (pseudonymous users)
-- =============================================
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  avatar_seed text default gen_random_uuid()::text,
  is_admin boolean default false,
  created_at timestamptz default now()
);

-- =============================================
-- Posts
-- =============================================
create table if not exists public.posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  title text not null,
  slug text unique not null,
  content text not null,
  category text check (category in ('school', 'politics', 'mental_health', 'society')),
  status text default 'published' check (status in ('published', 'under_review', 'removed')),
  flag_count int default 0,
  view_count int default 0,
  is_featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- =============================================
-- Comments
-- =============================================
create table if not exists public.comments (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references public.posts(id) on delete cascade,
  user_id uuid references public.profiles(id) on delete set null,
  content text not null,
  flag_count int default 0,
  created_at timestamptz default now()
);

-- =============================================
-- Reports (flags)
-- =============================================
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references public.profiles(id) on delete set null,
  target_type text check (target_type in ('post', 'comment')),
  target_id uuid not null,
  reason text,
  created_at timestamptz default now()
);

-- =============================================
-- Row Level Security
-- =============================================

alter table public.profiles enable row level security;
alter table public.posts enable row level security;
alter table public.comments enable row level security;
alter table public.reports enable row level security;

-- Profiles: public read, self-write
create policy "Profiles are publicly readable" on public.profiles for select using (true);
create policy "Users can insert their own profile" on public.profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on public.profiles for update using (auth.uid() = id);

-- Posts: published posts are public; auth users can insert; self can update/delete
create policy "Published posts are public" on public.posts
  for select using (status = 'published' or auth.uid() = user_id);

create policy "Auth users can create posts" on public.posts
  for insert with check (auth.uid() = user_id);

create policy "Authors can update own posts" on public.posts
  for update using (auth.uid() = user_id);

create policy "Authors can delete own posts" on public.posts
  for delete using (auth.uid() = user_id);

-- Comments: public read on published post comments; auth insert
create policy "Comments on published posts are public" on public.comments
  for select using (true);

create policy "Auth users can comment" on public.comments
  for insert with check (auth.uid() = user_id);

create policy "Authors can delete own comments" on public.comments
  for delete using (auth.uid() = user_id);

-- Reports: auth users can insert reports
create policy "Auth users can report" on public.reports
  for insert with check (auth.uid() = reporter_id);

-- =============================================
-- Auto-flag threshold function & trigger
-- =============================================
create or replace function public.check_flag_threshold()
returns trigger as $$
begin
  -- If post hits 5 flags, move to under_review
  if NEW.flag_count >= 5 and OLD.flag_count < 5 then
    new.status = 'under_review';
  end if;
  return new;
end;
$$ language plpgsql security definer;

create trigger post_flag_threshold
  before update of flag_count on public.posts
  for each row execute function public.check_flag_threshold();

-- =============================================
-- Seed: sample data for demo
-- =============================================
-- (Uncomment to add sample posts without auth)
-- insert into public.posts (title, slug, content, category, status, is_featured) values
-- ('Er karakterer egentlig rettferdige?', 'er-karakterer-rettferdige',
--  'Karaktersystemet vårt er designet for å måle kunnskap, men gjør det egentlig det?...', 'school', 'published', true),
-- ('Ungdommens psykiske helse i sosiale medier', 'psykisk-helse-sosiale-medier',
--  'Vi bruker i snitt over 4 timer daglig på sosiale medier. Hva gjør det med oss?...', 'mental_health', 'published', true);
