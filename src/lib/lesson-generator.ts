// Lesson question generator
// Bir lesson icindeki kelimelerden farkli soru tipleri uretir.

export type LessonWord = {
  id: string;
  word: string;
  pos: string | null;
  pronunciation: string | null;
  meaning_en: string | null;
  meaning_tr: string | null;
  example_en: string | null;
  example_tr: string | null;
};

export type Question =
  | {
      type: "mcq_meaning"; // Kelime gosteriliyor, Turkce anlami secilecek
      wordId: string;
      word: string;
      pronunciation: string | null;
      pos: string | null;
      options: string[];
      correctIndex: number;
    }
  | {
      type: "mcq_word"; // Turkce anlam gosteriliyor, dogru kelime secilecek
      wordId: string;
      meaning: string;
      options: string[];
      correctIndex: number;
    }
  | {
      type: "fill_blank"; // Cumlede bosluk, dogru kelime secilecek
      wordId: string;
      word: string;
      sentence: string; // Word yerine ___ konmus hali
      sentenceTr: string | null;
      options: string[];
      correctIndex: number;
    }
  | {
      type: "type_translation"; // Kelime gosteriliyor, Turkce yazilacak
      wordId: string;
      word: string;
      pronunciation: string | null;
      correctAnswer: string;
    };

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pickDistractors<T>(pool: T[], exclude: T, count: number, key: (x: T) => string): T[] {
  const filtered = pool.filter((x) => key(x) !== key(exclude));
  return shuffle(filtered).slice(0, count);
}

/**
 * Bir kelimeyi cumledeki uygun yerinde "___" ile degistirir.
 * Eslemeyi sade tutmak icin: tam kelime (kucuk harf) eslemesi + basit suffix toleransi.
 */
function blankoutWord(sentence: string, word: string): string {
  // Kelimenin kendisi veya basit cekim varyantlari (s, ed, ing) — sade match
  const variants = [word, `${word}s`, `${word}es`, `${word}ed`, `${word}ing`, `${word}d`];
  const regex = new RegExp(`\\b(${variants.join("|")})\\b`, "gi");
  return sentence.replace(regex, "___");
}

/**
 * Lesson icin sorular uretir.
 * Her kelime icin 2 farkli tip soru ekler (toplam ~2N).
 * Soru cesidi: MCQ-meaning, MCQ-word, fill_blank, type_translation
 */
export function generateQuestions(words: LessonWord[]): Question[] {
  if (words.length === 0) return [];

  const questions: Question[] = [];

  for (const word of words) {
    // --- 1. MCQ-meaning (kelime gosteriliyor, anlam secilecek)
    if (word.meaning_tr) {
      const distractors = pickDistractors(
        words.filter((w) => w.meaning_tr),
        word,
        3,
        (w) => w.id,
      );
      const options = shuffle([
        word.meaning_tr,
        ...distractors.map((d) => d.meaning_tr!),
      ]);
      questions.push({
        type: "mcq_meaning",
        wordId: word.id,
        word: word.word,
        pronunciation: word.pronunciation,
        pos: word.pos,
        options,
        correctIndex: options.indexOf(word.meaning_tr),
      });
    }

    // --- 2. Ikinci soru: kelimenin ozelliklerine gore tip sec
    // Eger ornek cumle varsa fill_blank, yoksa MCQ-word
    if (word.example_en && word.meaning_tr) {
      const sentence = blankoutWord(word.example_en, word.word);
      // Eger blank yapilamamissa (esleme yok), MCQ-word'e dus
      if (sentence.includes("___")) {
        const distractors = pickDistractors(words, word, 3, (w) => w.id);
        const options = shuffle([word.word, ...distractors.map((d) => d.word)]);
        questions.push({
          type: "fill_blank",
          wordId: word.id,
          word: word.word,
          sentence,
          sentenceTr: word.example_tr,
          options,
          correctIndex: options.indexOf(word.word),
        });
        continue;
      }
    }

    // Fallback: MCQ-word
    if (word.meaning_tr) {
      const distractors = pickDistractors(words, word, 3, (w) => w.id);
      const options = shuffle([word.word, ...distractors.map((d) => d.word)]);
      questions.push({
        type: "mcq_word",
        wordId: word.id,
        meaning: word.meaning_tr,
        options,
        correctIndex: options.indexOf(word.word),
      });
    }
  }

  // Cesitlilik icin biri type_translation olsun (son sorulardan biri)
  if (words.length > 0) {
    const target = words[Math.floor(Math.random() * words.length)];
    if (target.meaning_tr) {
      questions.push({
        type: "type_translation",
        wordId: target.id,
        word: target.word,
        pronunciation: target.pronunciation,
        correctAnswer: target.meaning_tr,
      });
    }
  }

  return shuffle(questions);
}

/**
 * Kullanicinin yazdigi cevabi dogru kabul edilip edilmeyecegini belirler.
 * - Buyuk-kucuk harf duyarsiz
 * - Bosluklar temizlenir
 * - "Ya da" gibi cesitli ceviriler virgulle ayrildiysa herhangi biri kabul
 */
export function checkTypedAnswer(userInput: string, correct: string): boolean {
  const normalize = (s: string) =>
    s
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  const userNorm = normalize(userInput);
  // Cevap virgul/slash ile ayrilmis varyantlar icerebilir
  const variants = correct
    .split(/[,;/]/)
    .map((v) => normalize(v))
    .filter(Boolean);
  return variants.some((v) => v === userNorm);
}

// XP hesaplama
export function calculateXp(correct: number, wrong: number, heartsUsed: number): number {
  const base = 10;
  const correctBonus = correct * 5;
  const wrongPenalty = wrong * 1;
  const heartPenalty = heartsUsed * 2;
  return Math.max(0, base + correctBonus - wrongPenalty - heartPenalty);
}
