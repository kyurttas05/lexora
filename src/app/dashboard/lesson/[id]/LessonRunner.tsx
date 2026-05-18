"use client";

import { useState, useEffect, useTransition, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkTypedAnswer, calculateXp, type Question } from "@/lib/lesson-generator";
import { startLessonAttempt, completeLessonAttempt } from "./actions";

type Lesson = {
  id: string;
  name: string;
  description: string | null;
};

type Props = {
  lesson: Lesson;
  questions: Question[];
  wordIds: string[];
  initialHearts: number;
};

type Phase = "starting" | "question" | "feedback" | "complete" | "no-hearts" | "error";

export default function LessonRunner({ lesson, questions, wordIds, initialHearts }: Props) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("starting");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [attemptId, setAttemptId] = useState<string>("");
  const [hearts, setHearts] = useState(initialHearts);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [stats, setStats] = useState({ correct: 0, wrong: 0, heartsUsed: 0 });
  const [lastCorrect, setLastCorrect] = useState(false);
  const [, startTransition] = useTransition();
  const completedRef = useRef(false);

  // Attempt baslat
  useEffect(() => {
    let cancelled = false;
    (async () => {
      const res = await startLessonAttempt(lesson.id);
      if (cancelled) return;
      if ("error" in res) {
        setErrorMsg(res.error);
        setPhase(res.error.includes("Kalp") ? "no-hearts" : "error");
        return;
      }
      setAttemptId(res.attemptId);
      setHearts(res.hearts);
      setPhase("question");
    })();
    return () => {
      cancelled = true;
    };
  }, [lesson.id]);

  // Tamamlama (yalniz bir kez)
  function finishLesson(finalStats: typeof stats) {
    if (completedRef.current || !attemptId) return;
    completedRef.current = true;
    const xp = calculateXp(finalStats.correct, finalStats.wrong, finalStats.heartsUsed);
    startTransition(async () => {
      await completeLessonAttempt({
        attemptId,
        correctCount: finalStats.correct,
        wrongCount: finalStats.wrong,
        heartsUsed: finalStats.heartsUsed,
        xpEarned: xp,
        wordIds,
      });
      // Confetti
      import("canvas-confetti").then(({ default: confetti }) => {
        const colors = ["#a855f7", "#06b6d4", "#ec4899", "#22d3ee"];
        confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 }, colors });
      });
    });
  }

  function handleAnswer(correct: boolean) {
    setLastCorrect(correct);
    const newStats = {
      correct: stats.correct + (correct ? 1 : 0),
      wrong: stats.wrong + (correct ? 0 : 1),
      heartsUsed: stats.heartsUsed + (correct ? 0 : 1),
    };
    setStats(newStats);

    if (!correct) {
      const newHearts = hearts - 1;
      setHearts(newHearts);
      if (newHearts <= 0) {
        setPhase("feedback");
        // Feedback gosterimi sonrasi no-hearts'e ge?ecek
        return;
      }
    }
    setPhase("feedback");
  }

  function handleContinue() {
    if (hearts <= 0) {
      finishLesson(stats);
      setPhase("no-hearts");
      return;
    }
    const next = currentIndex + 1;
    if (next >= questions.length) {
      finishLesson(stats);
      setPhase("complete");
    } else {
      setCurrentIndex(next);
      setPhase("question");
    }
  }

  // -----------------------------------------------
  // RENDER
  // -----------------------------------------------
  if (phase === "starting") {
    return (
      <div className="mx-auto flex max-w-2xl items-center justify-center px-6 py-24">
        <p className="text-muted-foreground">Yukleniyor...</p>
      </div>
    );
  }

  if (phase === "error") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h2 className="mb-2 text-2xl font-bold">Bir sorun oldu</h2>
        <p className="mb-6 text-muted-foreground">{errorMsg}</p>
        <Link href="/dashboard">
          <Button variant="outline" className="glass">
            Dashboard
          </Button>
        </Link>
      </div>
    );
  }

  if (phase === "no-hearts") {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <div className="mb-6 text-6xl">💔</div>
        <h2 className="mb-3 text-3xl font-bold">Kalp kalmadi</h2>
        <p className="mb-8 text-muted-foreground">
          Kalpler her 24 saatte yenilenir. Bu arada tamamladigin kismi kaydettik.
        </p>
        <Link href="/dashboard">
          <Button className="aurora-bg glow-primary text-white">Dashboard&apos;a don</Button>
        </Link>
      </div>
    );
  }

  if (phase === "complete") {
    const xp = calculateXp(stats.correct, stats.wrong, stats.heartsUsed);
    const accuracy = Math.round((stats.correct / (stats.correct + stats.wrong || 1)) * 100);
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center"
      >
        <div className="mb-4 text-7xl">🎯</div>
        <h2 className="aurora-text mb-2 text-5xl font-bold">Ders tamam!</h2>
        <p className="mb-10 text-muted-foreground">{lesson.name}</p>

        <div className="glass mb-8 grid w-full max-w-md grid-cols-3 gap-2 rounded-2xl p-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">+{xp}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">XP</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{stats.correct}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Dogru
            </div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{accuracy}%</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Basari
            </div>
          </div>
        </div>

        <div className="flex gap-3">
          <Link href="/dashboard">
            <Button variant="outline" className="glass">
              Dashboard
            </Button>
          </Link>
          <Button
            className="aurora-bg glow-primary text-white"
            onClick={() => router.refresh()}
          >
            Tekrar oyna
          </Button>
        </div>
      </motion.div>
    );
  }

  const question = questions[currentIndex];
  const progress = ((currentIndex + (phase === "feedback" ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-6 py-6">
      {/* Top bar: close, progress, hearts */}
      <div className="mb-6 flex items-center gap-3">
        <Link
          href="/dashboard"
          className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-white/5 hover:text-foreground"
          aria-label="Kapat"
        >
          ✕
        </Link>
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="aurora-bg h-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <div className="flex items-center gap-1 text-sm font-medium">
          <span className="text-base">❤️</span>
          <span className={hearts <= 1 ? "text-destructive" : "text-foreground"}>{hearts}</span>
        </div>
      </div>

      {/* Question + Feedback */}
      <AnimatePresence mode="wait">
        {phase === "question" && (
          <motion.div
            key={`q-${currentIndex}`}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
          >
            <QuestionView question={question} onAnswer={handleAnswer} />
          </motion.div>
        )}

        {phase === "feedback" && (
          <motion.div
            key={`f-${currentIndex}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.25 }}
          >
            <FeedbackView
              correct={lastCorrect}
              question={question}
              onContinue={handleContinue}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ===================================================
// QUESTION VIEW — 4 tip
// ===================================================
function QuestionView({
  question,
  onAnswer,
}: {
  question: Question;
  onAnswer: (correct: boolean) => void;
}) {
  if (question.type === "mcq_meaning") {
    return (
      <MCQ
        prompt={
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Bu kelimenin anlami nedir?
            </p>
            <h3 className="aurora-text mt-3 text-5xl font-bold tracking-tight">{question.word}</h3>
            {question.pronunciation && (
              <p className="mt-2 font-mono text-sm text-muted-foreground">
                {question.pronunciation}
              </p>
            )}
            {question.pos && (
              <span className="mt-2 inline-block rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-muted-foreground">
                {question.pos}
              </span>
            )}
          </div>
        }
        options={question.options}
        correctIndex={question.correctIndex}
        onAnswer={onAnswer}
      />
    );
  }

  if (question.type === "mcq_word") {
    return (
      <MCQ
        prompt={
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Hangi kelime bu anlama gelir?
            </p>
            <h3 className="mt-3 text-3xl font-semibold text-foreground">{question.meaning}</h3>
          </div>
        }
        options={question.options}
        correctIndex={question.correctIndex}
        onAnswer={onAnswer}
      />
    );
  }

  if (question.type === "fill_blank") {
    return (
      <MCQ
        prompt={
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">
              Bosluga uygun kelime
            </p>
            <p className="mt-4 text-2xl leading-relaxed text-foreground">
              &ldquo;{question.sentence}&rdquo;
            </p>
            {question.sentenceTr && (
              <p className="mt-2 text-sm italic text-muted-foreground">{question.sentenceTr}</p>
            )}
          </div>
        }
        options={question.options}
        correctIndex={question.correctIndex}
        onAnswer={onAnswer}
      />
    );
  }

  // type_translation
  return <TypeAnswer question={question} onAnswer={onAnswer} />;
}

// ===================================================
// MCQ — 4 secenek, secince dogru/yanlis bildir
// ===================================================
function MCQ({
  prompt,
  options,
  correctIndex,
  onAnswer,
}: {
  prompt: React.ReactNode;
  options: string[];
  correctIndex: number;
  onAnswer: (correct: boolean) => void;
}) {
  const [selected, setSelected] = useState<number | null>(null);

  function pick(i: number) {
    if (selected !== null) return;
    setSelected(i);
    setTimeout(() => onAnswer(i === correctIndex), 250);
  }

  return (
    <div>
      <div className="glass mb-6 rounded-3xl p-8">{prompt}</div>
      <div className="grid gap-2">
        {options.map((opt, i) => {
          const isSelected = selected === i;
          const isCorrect = i === correctIndex;
          const showState = selected !== null;
          let bg = "border-white/10 bg-white/5 hover:bg-white/10";
          if (showState && isSelected) {
            bg = isCorrect
              ? "border-success/50 bg-success/15 text-success"
              : "border-destructive/50 bg-destructive/15 text-destructive";
          }
          return (
            <button
              key={i}
              onClick={() => pick(i)}
              disabled={selected !== null}
              className={`rounded-2xl border px-5 py-4 text-left text-base font-medium transition-all disabled:cursor-default ${bg}`}
            >
              <span className="mr-3 inline-flex size-6 items-center justify-center rounded-md border border-white/10 text-xs">
                {i + 1}
              </span>
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ===================================================
// TYPE ANSWER — kullanici yaziyor
// ===================================================
function TypeAnswer({
  question,
  onAnswer,
}: {
  question: Extract<Question, { type: "type_translation" }>;
  onAnswer: (correct: boolean) => void;
}) {
  const [value, setValue] = useState("");
  const [submitted, setSubmitted] = useState(false);

  function submit() {
    if (submitted || !value.trim()) return;
    const correct = checkTypedAnswer(value, question.correctAnswer);
    setSubmitted(true);
    setTimeout(() => onAnswer(correct), 350);
  }

  return (
    <div>
      <div className="glass mb-6 rounded-3xl p-8 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Turkce karsiligini yaz
        </p>
        <h3 className="aurora-text mt-3 text-5xl font-bold tracking-tight">{question.word}</h3>
        {question.pronunciation && (
          <p className="mt-2 font-mono text-sm text-muted-foreground">{question.pronunciation}</p>
        )}
      </div>
      <Input
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        placeholder="Turkce yaz..."
        disabled={submitted}
        className="h-14 bg-white/5 text-center text-lg"
      />
      <Button
        onClick={submit}
        disabled={submitted || !value.trim()}
        className="aurora-bg glow-primary mt-3 h-12 w-full text-base font-semibold text-white"
      >
        Kontrol et
      </Button>
    </div>
  );
}

// ===================================================
// FEEDBACK VIEW — dogru/yanlis sonrasi
// ===================================================
function FeedbackView({
  correct,
  question,
  onContinue,
}: {
  correct: boolean;
  question: Question;
  onContinue: () => void;
}) {
  const correctText = (() => {
    if (question.type === "mcq_meaning") return question.options[question.correctIndex];
    if (question.type === "mcq_word") return question.options[question.correctIndex];
    if (question.type === "fill_blank") return question.options[question.correctIndex];
    return question.correctAnswer;
  })();

  // Enter ile devam
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onContinue();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onContinue]);

  return (
    <div
      className={`rounded-3xl border p-6 ${
        correct
          ? "border-success/30 bg-success/10"
          : "border-destructive/30 bg-destructive/10"
      }`}
    >
      <div className="flex items-center gap-3">
        <div className="text-3xl">{correct ? "✅" : "❌"}</div>
        <div>
          <p className={`font-semibold ${correct ? "text-success" : "text-destructive"}`}>
            {correct ? "Harika!" : "Yanlis"}
          </p>
          {!correct && (
            <p className="text-sm text-foreground/80">
              Dogru cevap: <strong>{correctText}</strong>
            </p>
          )}
        </div>
      </div>
      <Button
        onClick={onContinue}
        className={`mt-4 h-11 w-full text-base font-semibold text-white ${
          correct ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90"
        }`}
      >
        Devam <span className="ml-2 text-xs opacity-60">(Enter)</span>
      </Button>
    </div>
  );
}
