"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { computeNextReview, deriveStatus, INITIAL_SM2, type ReviewRating } from "@/lib/sm2";

const STARTER_DECK_ID = "00000000-0000-0000-0000-000000000001";

export type ReviewWord = {
  id: string;
  word: string;
  pos: string | null;
  pronunciation: string | null;
  meaning_en: string | null;
  meaning_tr: string | null;
  example_en: string | null;
  example_tr: string | null;
  level: string | null;
  progress_id: string | null;
  ease: number;
  interval_days: number;
  repetitions: number;
  status: "new" | "learning" | "reviewing" | "mastered";
};

// Inner-join sonuçları için açık tip (Supabase JS'in tip inferansı zayıf burada)
type WordRow = {
  id: string;
  word: string;
  pos: string | null;
  pronunciation: string | null;
  meaning_en: string | null;
  meaning_tr: string | null;
  example_en: string | null;
  example_tr: string | null;
  level: string | null;
};

type ProgressRow = {
  id: string;
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  status: "new" | "learning" | "reviewing" | "mastered";
  word: WordRow;
};

type DeckWordRow = {
  word: WordRow;
};

/**
 * Bugün için kelime kuyruğunu döndürür:
 * 1. Vadesi gelen tekrarlar (next_review_at <= now)
 * 2. Yeni kelimeler (kullanıcının henüz görmediği)
 * Toplam: daily_goal kadar
 */
export async function getReviewQueue(): Promise<ReviewWord[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("daily_goal")
    .eq("id", user.id)
    .single();
  const dailyGoal = profile?.daily_goal ?? 20;

  const nowIso = new Date().toISOString();

  // 1) Vadesi gelen tekrarlar
  const { data: dueRows } = await supabase
    .from("user_word_progress")
    .select(
      "id, ease_factor, interval_days, repetitions, status, " +
        "word:words!inner(id, word, pos, pronunciation, meaning_en, meaning_tr, example_en, example_tr, level)",
    )
    .eq("user_id", user.id)
    .lte("next_review_at", nowIso)
    .order("next_review_at", { ascending: true })
    .limit(dailyGoal)
    .returns<ProgressRow[]>();

  const dueWords: ReviewWord[] = (dueRows ?? []).map((row) => ({
    id: row.word.id,
    word: row.word.word,
    pos: row.word.pos,
    pronunciation: row.word.pronunciation,
    meaning_en: row.word.meaning_en,
    meaning_tr: row.word.meaning_tr,
    example_en: row.word.example_en,
    example_tr: row.word.example_tr,
    level: row.word.level,
    progress_id: row.id,
    ease: row.ease_factor,
    interval_days: row.interval_days,
    repetitions: row.repetitions,
    status: row.status,
  }));

  // 2) Eksik kalan slotları yeni kelimelerle doldur
  const remaining = dailyGoal - dueWords.length;
  let newWords: ReviewWord[] = [];

  if (remaining > 0) {
    const { data: deckRows } = await supabase
      .from("deck_words")
      .select(
        "word:words!inner(id, word, pos, pronunciation, meaning_en, meaning_tr, example_en, example_tr, level)",
      )
      .eq("deck_id", STARTER_DECK_ID)
      .order("position", { ascending: true })
      .limit(remaining * 3)
      .returns<DeckWordRow[]>();

    const { data: existingProgress } = await supabase
      .from("user_word_progress")
      .select("word_id")
      .eq("user_id", user.id);

    const existingIds = new Set((existingProgress ?? []).map((r) => r.word_id));

    newWords = (deckRows ?? [])
      .map((row) => row.word)
      .filter((w) => !existingIds.has(w.id))
      .slice(0, remaining)
      .map((w) => ({
        id: w.id,
        word: w.word,
        pos: w.pos,
        pronunciation: w.pronunciation,
        meaning_en: w.meaning_en,
        meaning_tr: w.meaning_tr,
        example_en: w.example_en,
        example_tr: w.example_tr,
        level: w.level,
        progress_id: null,
        ease: INITIAL_SM2.ease,
        interval_days: INITIAL_SM2.intervalDays,
        repetitions: INITIAL_SM2.repetitions,
        status: "new" as const,
      }));
  }

  return [...dueWords, ...newWords];
}

/**
 * Bir kelime için cevap kaydet. SM-2 hesabını yapar, DB'yi günceller.
 */
export async function submitReview(wordId: string, rating: ReviewRating) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");

  const { data: existing } = await supabase
    .from("user_word_progress")
    .select("id, ease_factor, interval_days, repetitions, total_reviews, correct_count, wrong_count")
    .eq("user_id", user.id)
    .eq("word_id", wordId)
    .maybeSingle();

  const prevState = existing
    ? {
        ease: existing.ease_factor,
        intervalDays: existing.interval_days,
        repetitions: existing.repetitions,
      }
    : INITIAL_SM2;

  const result = computeNextReview(prevState, rating);
  const status = deriveStatus(rating, result.repetitions);
  const isCorrect = rating !== "again";

  const updates = {
    user_id: user.id,
    word_id: wordId,
    ease_factor: result.ease,
    interval_days: result.intervalDays,
    repetitions: result.repetitions,
    last_reviewed_at: new Date().toISOString(),
    next_review_at: result.nextReviewAt.toISOString(),
    total_reviews: (existing?.total_reviews ?? 0) + 1,
    correct_count: (existing?.correct_count ?? 0) + (isCorrect ? 1 : 0),
    wrong_count: (existing?.wrong_count ?? 0) + (isCorrect ? 0 : 1),
    status,
  };

  if (existing) {
    await supabase
      .from("user_word_progress")
      .update(updates)
      .eq("id", existing.id);
  } else {
    await supabase.from("user_word_progress").insert(updates);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/vocab");
}
