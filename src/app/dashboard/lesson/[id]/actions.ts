"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

/**
 * Bir lesson basladiginda kayit acar, attempt_id dondurur.
 * Hearts'i kontrol eder — 0 ise hata.
 */
export async function startLessonAttempt(lessonId: string): Promise<{ attemptId: string; hearts: number } | { error: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: "Oturum yok" };

  // Hearts kontrol et + gunluk resetleme
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("hearts, hearts_reset_at")
    .eq("id", user.id)
    .single();

  if (!profile) return { error: "Profil bulunamadi" };

  let hearts = profile.hearts;
  const resetAt = profile.hearts_reset_at ? new Date(profile.hearts_reset_at) : new Date(0);
  const now = new Date();
  const hoursSinceReset = (now.getTime() - resetAt.getTime()) / 1000 / 60 / 60;

  // 24 saatten fazla gectiyse hearts'i 5'e doldur
  if (hoursSinceReset >= 24) {
    hearts = 5;
    await supabase
      .from("user_profiles")
      .update({ hearts: 5, hearts_reset_at: now.toISOString() })
      .eq("id", user.id);
  }

  if (hearts <= 0) {
    return { error: "Kalp kalmadi. Yarin tekrar dene." };
  }

  const { data: attempt, error } = await supabase
    .from("lesson_attempts")
    .insert({ user_id: user.id, lesson_id: lessonId })
    .select("id")
    .single();

  if (error || !attempt) return { error: error?.message ?? "Deneme baslatilamadi" };

  return { attemptId: attempt.id, hearts };
}

/**
 * Lesson tamamlandiginda cagrilir.
 * - attempt'i guncellesin
 * - hearts'i azaltsin (heartsUsed kadar)
 * - XP ekler, streak gunceller
 */
export async function completeLessonAttempt(args: {
  attemptId: string;
  correctCount: number;
  wrongCount: number;
  heartsUsed: number;
  xpEarned: number;
  wordIds: string[]; // Bu derste calisilan kelimeler — progress kaydina ekle
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");

  const now = new Date();

  // 1) Attempt'i guncelle
  await supabase
    .from("lesson_attempts")
    .update({
      completed_at: now.toISOString(),
      correct_count: args.correctCount,
      wrong_count: args.wrongCount,
      hearts_used: args.heartsUsed,
      xp_earned: args.xpEarned,
    })
    .eq("id", args.attemptId)
    .eq("user_id", user.id);

  // 2) User profile guncelle: XP, hearts, streak
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("total_xp, current_streak, longest_streak, last_active_date, hearts")
    .eq("id", user.id)
    .single();

  if (profile) {
    const today = now.toISOString().slice(0, 10); // YYYY-MM-DD
    let newStreak = profile.current_streak;

    if (profile.last_active_date !== today) {
      // Streak: dunse +1, daha eskiyse 1'den basla
      const lastDate = profile.last_active_date ? new Date(profile.last_active_date) : null;
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);

      if (lastDate && profile.last_active_date === yesterdayStr) {
        newStreak = profile.current_streak + 1;
      } else {
        newStreak = 1;
      }
    }

    const newLongest = Math.max(profile.longest_streak ?? 0, newStreak);

    await supabase
      .from("user_profiles")
      .update({
        total_xp: (profile.total_xp ?? 0) + args.xpEarned,
        hearts: Math.max(0, profile.hearts - args.heartsUsed),
        current_streak: newStreak,
        longest_streak: newLongest,
        last_active_date: today,
      })
      .eq("id", user.id);
  }

  // 3) Word progress'lerini de hafifce guncelle (kelime gorulmus)
  // Mevcut SM-2 mantigi flashcard icindi; burada lesson icinde gorulen kelimeleri
  // basit "gordum" olarak isaretliyoruz — daha sonra detayli entegre edilebilir.
  for (const wordId of args.wordIds) {
    const { data: existing } = await supabase
      .from("user_word_progress")
      .select("id, total_reviews")
      .eq("user_id", user.id)
      .eq("word_id", wordId)
      .maybeSingle();

    if (existing) {
      await supabase
        .from("user_word_progress")
        .update({
          last_reviewed_at: now.toISOString(),
          total_reviews: (existing.total_reviews ?? 0) + 1,
        })
        .eq("id", existing.id);
    } else {
      // Yeni kelime — temel kayit ekle
      await supabase.from("user_word_progress").insert({
        user_id: user.id,
        word_id: wordId,
        last_reviewed_at: now.toISOString(),
        next_review_at: new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString(),
        total_reviews: 1,
        status: "learning",
      });
    }
  }

  revalidatePath("/dashboard");
  revalidatePath(`/dashboard/lesson`);
}
