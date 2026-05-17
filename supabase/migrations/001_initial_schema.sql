-- Lexora MVP Schema (Phase 1: Vocabulary)
-- Run this in Supabase SQL Editor

-- ============================================
-- 1. user_profiles
-- ============================================
create table public.user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  level text default 'B2' check (level in ('A2', 'B1', 'B2', 'C1', 'C2')),
  target_exam text check (target_exam in ('CAE', 'FCE', 'IELTS', 'TOEFL', 'general')),
  daily_goal int default 20,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Otomatik user_profile oluşturucu: auth.users'a her ekleme bir profile ekler
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================
-- 2. words (vocabulary corpus)
-- ============================================
create table public.words (
  id uuid primary key default gen_random_uuid(),
  word text not null unique,
  pos text,                       -- part of speech: noun, verb, adj, adv, ...
  pronunciation text,             -- IPA, ör: /əˈbændən/
  meaning_en text,
  meaning_tr text,
  example_en text,
  example_tr text,
  level text check (level in ('A2', 'B1', 'B2', 'C1', 'C2')),
  source text,                    -- "CAE Wordlist 2024", "Phrasal Verbs in Use", vb.
  created_at timestamptz default now()
);

create index words_level_idx on public.words(level);
create index words_word_lower_idx on public.words(lower(word));

-- ============================================
-- 3. decks (kelime koleksiyonları)
-- ============================================
create table public.decks (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  level text check (level in ('A2', 'B1', 'B2', 'C1', 'C2')),
  is_public boolean default true,
  created_by uuid references auth.users(id) on delete set null,
  created_at timestamptz default now()
);

create index decks_public_idx on public.decks(is_public) where is_public = true;

-- ============================================
-- 4. deck_words (junction)
-- ============================================
create table public.deck_words (
  deck_id uuid references public.decks(id) on delete cascade,
  word_id uuid references public.words(id) on delete cascade,
  position int,
  primary key (deck_id, word_id)
);

create index deck_words_position_idx on public.deck_words(deck_id, position);

-- ============================================
-- 5. user_word_progress (SM-2 state)
-- ============================================
create table public.user_word_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  word_id uuid references public.words(id) on delete cascade,
  -- SM-2 state
  ease_factor real default 2.5,
  interval_days int default 0,
  repetitions int default 0,
  last_reviewed_at timestamptz,
  next_review_at timestamptz default now(),
  -- Stats
  total_reviews int default 0,
  correct_count int default 0,
  wrong_count int default 0,
  status text default 'new' check (status in ('new', 'learning', 'reviewing', 'mastered')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (user_id, word_id)
);

create index uwp_user_next_review_idx on public.user_word_progress(user_id, next_review_at);
create index uwp_user_status_idx on public.user_word_progress(user_id, status);

-- ============================================
-- updated_at trigger fonksiyonu (genel)
-- ============================================
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger user_profiles_updated_at before update on public.user_profiles
  for each row execute function public.set_updated_at();

create trigger user_word_progress_updated_at before update on public.user_word_progress
  for each row execute function public.set_updated_at();

-- ============================================
-- RLS POLICIES (Row Level Security)
-- ============================================

-- user_profiles
alter table public.user_profiles enable row level security;

create policy "Kullanici kendi profilini gorebilir"
  on public.user_profiles for select
  using (auth.uid() = id);

create policy "Kullanici kendi profilini guncelleyebilir"
  on public.user_profiles for update
  using (auth.uid() = id);

-- words: herkes okuyabilir, kimse yazamaz (sadece service_role seed eder)
alter table public.words enable row level security;

create policy "Kelimeleri herkes okuyabilir"
  on public.words for select
  using (auth.role() = 'authenticated');

-- decks: herkes public deckleri görür, kendi private deckleri yönetir
alter table public.decks enable row level security;

create policy "Public ve kendi deckleri okunabilir"
  on public.decks for select
  using (is_public = true or created_by = auth.uid());

create policy "Kullanici kendi deckini olusturabilir"
  on public.decks for insert
  with check (auth.uid() = created_by);

create policy "Kullanici kendi deckini guncelleyebilir"
  on public.decks for update
  using (auth.uid() = created_by);

create policy "Kullanici kendi deckini silebilir"
  on public.decks for delete
  using (auth.uid() = created_by);

-- deck_words: deck'in görünürlüğüne göre
alter table public.deck_words enable row level security;

create policy "Deck_words deck'in gorunurlugune gore"
  on public.deck_words for select
  using (
    exists (
      select 1 from public.decks d
      where d.id = deck_words.deck_id
        and (d.is_public = true or d.created_by = auth.uid())
    )
  );

create policy "Deck sahibi deck_words ekleyebilir"
  on public.deck_words for insert
  with check (
    exists (
      select 1 from public.decks d
      where d.id = deck_words.deck_id and d.created_by = auth.uid()
    )
  );

create policy "Deck sahibi deck_words silebilir"
  on public.deck_words for delete
  using (
    exists (
      select 1 from public.decks d
      where d.id = deck_words.deck_id and d.created_by = auth.uid()
    )
  );

-- user_word_progress: sadece kendi satırları
alter table public.user_word_progress enable row level security;

create policy "Kullanici kendi ilerleme verisini gorebilir"
  on public.user_word_progress for select
  using (auth.uid() = user_id);

create policy "Kullanici kendi ilerleme verisini ekleyebilir"
  on public.user_word_progress for insert
  with check (auth.uid() = user_id);

create policy "Kullanici kendi ilerleme verisini guncelleyebilir"
  on public.user_word_progress for update
  using (auth.uid() = user_id);

create policy "Kullanici kendi ilerleme verisini silebilir"
  on public.user_word_progress for delete
  using (auth.uid() = user_id);
