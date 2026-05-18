-- Lexora — Lesson system + user stats (XP, streak, hearts)
-- Run after 002_seed_starter_vocabulary.sql

-- ============================================
-- 1. lessons — Curated groups of words for structured learning
-- ============================================
create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  deck_id uuid references public.decks(id) on delete cascade,
  name text not null,
  description text,
  position int default 0,
  created_at timestamptz default now()
);

create index lessons_deck_position_idx on public.lessons(deck_id, position);

alter table public.lessons enable row level security;

create policy "Public dersleri herkes okuyabilir"
  on public.lessons for select
  using (
    exists (
      select 1 from public.decks d
      where d.id = lessons.deck_id
        and (d.is_public = true or d.created_by = auth.uid())
    )
  );

-- ============================================
-- 2. lesson_words — Hangi kelimeler hangi derste
-- ============================================
create table public.lesson_words (
  lesson_id uuid references public.lessons(id) on delete cascade,
  word_id uuid references public.words(id) on delete cascade,
  position int default 0,
  primary key (lesson_id, word_id)
);

create index lesson_words_position_idx on public.lesson_words(lesson_id, position);

alter table public.lesson_words enable row level security;

create policy "Lesson_words ders gorunurlugune gore"
  on public.lesson_words for select
  using (
    exists (
      select 1 from public.lessons l
      join public.decks d on d.id = l.deck_id
      where l.id = lesson_words.lesson_id
        and (d.is_public = true or d.created_by = auth.uid())
    )
  );

-- ============================================
-- 3. lesson_attempts — Her ders denemesinin kaydi
-- ============================================
create table public.lesson_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id uuid references public.lessons(id) on delete cascade not null,
  started_at timestamptz default now(),
  completed_at timestamptz,
  xp_earned int default 0,
  correct_count int default 0,
  wrong_count int default 0,
  hearts_used int default 0
);

create index lesson_attempts_user_idx on public.lesson_attempts(user_id, started_at desc);
create index lesson_attempts_lesson_idx on public.lesson_attempts(user_id, lesson_id);

alter table public.lesson_attempts enable row level security;

create policy "Kullanici kendi denemelerini gorebilir"
  on public.lesson_attempts for select
  using (auth.uid() = user_id);

create policy "Kullanici kendi denemesini ekleyebilir"
  on public.lesson_attempts for insert
  with check (auth.uid() = user_id);

create policy "Kullanici kendi denemesini guncelleyebilir"
  on public.lesson_attempts for update
  using (auth.uid() = user_id);

-- ============================================
-- 4. user_profiles — XP, streak, hearts alanlari ekle
-- ============================================
alter table public.user_profiles add column if not exists total_xp int default 0;
alter table public.user_profiles add column if not exists current_streak int default 0;
alter table public.user_profiles add column if not exists longest_streak int default 0;
alter table public.user_profiles add column if not exists last_active_date date;
alter table public.user_profiles add column if not exists hearts int default 5;
alter table public.user_profiles add column if not exists hearts_reset_at timestamptz default now();

-- ============================================
-- 5. Seed: 6 lesson olusturup 30 starter kelimeyi gruplaya
-- ============================================

-- B2 Lesson 1: ilk 5 B2 kelimesi
do $$
declare
  lesson_id_1 uuid;
  lesson_id_2 uuid;
  lesson_id_3 uuid;
  lesson_id_4 uuid;
  lesson_id_5 uuid;
  lesson_id_6 uuid;
  starter_deck_id uuid := '00000000-0000-0000-0000-000000000001';
begin
  -- Lesson 1: B2 - 1
  insert into public.lessons (deck_id, name, description, position)
  values (starter_deck_id, 'B2 Temel 1', 'Achieve, Acknowledge, Acquire, Beneficial, Capable', 1)
  returning id into lesson_id_1;

  insert into public.lesson_words (lesson_id, word_id, position)
  select lesson_id_1, w.id, row_number() over (order by w.word)
  from public.words w
  where w.word in ('achieve', 'acknowledge', 'acquire', 'beneficial', 'capable');

  -- Lesson 2: B2 - 2
  insert into public.lessons (deck_id, name, description, position)
  values (starter_deck_id, 'B2 Temel 2', 'Consequence, Demonstrate, Emphasize, Enhance, Ensure', 2)
  returning id into lesson_id_2;

  insert into public.lesson_words (lesson_id, word_id, position)
  select lesson_id_2, w.id, row_number() over (order by w.word)
  from public.words w
  where w.word in ('consequence', 'demonstrate', 'emphasize', 'enhance', 'ensure');

  -- Lesson 3: B2 - 3
  insert into public.lessons (deck_id, name, description, position)
  values (starter_deck_id, 'B2 Temel 3', 'Estimate, Evident, Genuine, Reluctant, Reveal', 3)
  returning id into lesson_id_3;

  insert into public.lesson_words (lesson_id, word_id, position)
  select lesson_id_3, w.id, row_number() over (order by w.word)
  from public.words w
  where w.word in ('estimate', 'evident', 'genuine', 'reluctant', 'reveal');

  -- Lesson 4: C1 - 1
  insert into public.lessons (deck_id, name, description, position)
  values (starter_deck_id, 'C1 Ileri 1', 'Alleviate, Ambiguous, Coherent, Compelling, Contemplate', 4)
  returning id into lesson_id_4;

  insert into public.lesson_words (lesson_id, word_id, position)
  select lesson_id_4, w.id, row_number() over (order by w.word)
  from public.words w
  where w.word in ('alleviate', 'ambiguous', 'coherent', 'compelling', 'contemplate');

  -- Lesson 5: C1 - 2
  insert into public.lessons (deck_id, name, description, position)
  values (starter_deck_id, 'C1 Ileri 2', 'Discern, Elaborate, Endure, Inherent, Mitigate', 5)
  returning id into lesson_id_5;

  insert into public.lesson_words (lesson_id, word_id, position)
  select lesson_id_5, w.id, row_number() over (order by w.word)
  from public.words w
  where w.word in ('discern', 'elaborate', 'endure', 'inherent', 'mitigate');

  -- Lesson 6: C1 - 3
  insert into public.lessons (deck_id, name, description, position)
  values (starter_deck_id, 'C1 Ileri 3', 'Plausible, Profound, Scrutinize, Substantial, Viable', 6)
  returning id into lesson_id_6;

  insert into public.lesson_words (lesson_id, word_id, position)
  select lesson_id_6, w.id, row_number() over (order by w.word)
  from public.words w
  where w.word in ('plausible', 'profound', 'scrutinize', 'substantial', 'viable');
end $$;
