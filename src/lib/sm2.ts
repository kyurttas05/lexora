// SM-2 (SuperMemo 2) aralıklı tekrar algoritması
// Anki'nin de temelinde olan klasik algoritma.
//
// Kullanıcı kelime gördükten sonra 4 buton seçiyor:
//   - "again" (Tekrar): hatırlayamadı, sıfırla
//   - "hard"  (Zor):   güçlükle hatırladı
//   - "good"  (İyi):   normal hatırladı
//   - "easy"  (Kolay): kolayca hatırladı
//
// Algoritma bu cevaba göre:
//   - ease (zorluk katsayısı) güncellenir
//   - interval (sonraki tekrara kaç gün) hesaplanır
//   - repetitions (üst üste başarı) sayılır

export type ReviewRating = "again" | "hard" | "good" | "easy";

export type Sm2State = {
  ease: number; // 1.3 minimum, 2.5 başlangıç
  intervalDays: number; // 0 = yeni kart
  repetitions: number; // üst üste başarılı tekrar sayısı
};

export type Sm2Result = Sm2State & {
  nextReviewAt: Date;
};

const RATING_QUALITY: Record<ReviewRating, number> = {
  again: 0,
  hard: 3,
  good: 4,
  easy: 5,
};

export const INITIAL_SM2: Sm2State = {
  ease: 2.5,
  intervalDays: 0,
  repetitions: 0,
};

export function computeNextReview(
  prev: Sm2State,
  rating: ReviewRating,
  now: Date = new Date(),
): Sm2Result {
  const quality = RATING_QUALITY[rating];

  // SM-2 ease formülü
  let ease = prev.ease + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ease < 1.3) ease = 1.3;

  let intervalDays: number;
  let repetitions: number;

  if (quality < 3) {
    // Başarısız → reset (yarın tekrar göster)
    intervalDays = 1;
    repetitions = 0;
  } else {
    repetitions = prev.repetitions + 1;
    if (repetitions === 1) intervalDays = 1;
    else if (repetitions === 2) intervalDays = 6;
    else intervalDays = Math.round(prev.intervalDays * ease);
  }

  const nextReviewAt = new Date(now);
  nextReviewAt.setDate(nextReviewAt.getDate() + intervalDays);

  return { ease, intervalDays, repetitions, nextReviewAt };
}

export function deriveStatus(
  rating: ReviewRating,
  repetitions: number,
): "new" | "learning" | "reviewing" | "mastered" {
  if (rating === "again") return "learning";
  if (repetitions >= 5) return "mastered";
  if (repetitions >= 2) return "reviewing";
  return "learning";
}
