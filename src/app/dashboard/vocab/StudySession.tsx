"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { submitReview, type ReviewWord } from "./actions";
import { Button } from "@/components/ui/button";
import type { ReviewRating } from "@/lib/sm2";

type Props = {
  initialQueue: ReviewWord[];
};

const ratingButtons: {
  rating: ReviewRating;
  label: string;
  className: string;
  shortcut: string;
}[] = [
  {
    rating: "again",
    label: "Tekrar",
    className:
      "bg-gradient-to-br from-red-500/80 to-rose-600/80 text-white hover:from-red-500 hover:to-rose-600 border-red-400/30",
    shortcut: "1",
  },
  {
    rating: "hard",
    label: "Zor",
    className:
      "bg-gradient-to-br from-amber-500/80 to-orange-600/80 text-white hover:from-amber-500 hover:to-orange-600 border-amber-400/30",
    shortcut: "2",
  },
  {
    rating: "good",
    label: "İyi",
    className:
      "bg-gradient-to-br from-teal-500/80 to-cyan-600/80 text-white hover:from-teal-500 hover:to-cyan-600 border-teal-400/30",
    shortcut: "3",
  },
  {
    rating: "easy",
    label: "Kolay",
    className:
      "bg-gradient-to-br from-violet-500/80 to-purple-600/80 text-white hover:from-violet-500 hover:to-purple-600 border-violet-400/30",
    shortcut: "4",
  },
];

export default function StudySession({ initialQueue }: Props) {
  const [queue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [pending, startTransition] = useTransition();

  const isComplete = index >= queue.length;
  const current = queue[index];

  // Klavye kısayolları: Space (reveal), 1-4 (rating)
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (isComplete || !current) return;
      if (e.key === " " && !revealed) {
        e.preventDefault();
        setRevealed(true);
        return;
      }
      if (revealed && !pending) {
        const button = ratingButtons.find((b) => b.shortcut === e.key);
        if (button) handleRate(button.rating);
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [revealed, pending, isComplete, current]);

  // Confetti seans bitince
  useEffect(() => {
    if (isComplete && queue.length > 0) {
      import("canvas-confetti").then(({ default: confetti }) => {
        const colors = ["#a855f7", "#06b6d4", "#ec4899", "#22d3ee"];
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.5 },
          colors,
        });
        setTimeout(() => {
          confetti({
            particleCount: 60,
            angle: 60,
            spread: 60,
            origin: { x: 0, y: 0.6 },
            colors,
          });
          confetti({
            particleCount: 60,
            angle: 120,
            spread: 60,
            origin: { x: 1, y: 0.6 },
            colors,
          });
        }, 300);
      });
    }
  }, [isComplete, queue.length]);

  if (queue.length === 0) {
    return (
      <div className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 text-6xl">🎉</div>
        <h2 className="aurora-text mb-3 text-4xl font-bold">Bugün için hepsi tamam</h2>
        <p className="mb-8 text-lg text-muted-foreground">
          Yarın yeni kelimeler ve tekrarlar seni bekliyor.
        </p>
        <Link href="/dashboard">
          <Button size="lg" className="aurora-bg glow-primary text-white">
            Dashboard&apos;a dön
          </Button>
        </Link>
      </div>
    );
  }

  if (isComplete) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center"
      >
        <div className="mb-6 text-7xl">🎯</div>
        <h2 className="aurora-text mb-3 text-5xl font-bold">Seans tamam!</h2>
        <p className="mb-8 text-lg text-foreground/80">
          <strong className="text-2xl">{queue.length}</strong> kelime çalıştın
        </p>

        <div className="glass mb-10 flex gap-8 rounded-2xl px-8 py-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-success">{stats.correct}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Doğru
            </div>
          </div>
          <div className="h-12 w-px self-center bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-destructive">{stats.wrong}</div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Tekrar
            </div>
          </div>
          <div className="h-12 w-px self-center bg-border" />
          <div className="text-center">
            <div className="text-3xl font-bold text-accent">
              {queue.length > 0 ? Math.round((stats.correct / queue.length) * 100) : 0}%
            </div>
            <div className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
              Başarı
            </div>
          </div>
        </div>

        <Link href="/dashboard">
          <Button size="lg" className="aurora-bg glow-primary text-white">
            Dashboard&apos;a dön
          </Button>
        </Link>
      </motion.div>
    );
  }

  function handleRate(rating: ReviewRating) {
    startTransition(async () => {
      await submitReview(current.id, rating);
      setStats((s) => ({
        correct: s.correct + (rating !== "again" ? 1 : 0),
        wrong: s.wrong + (rating === "again" ? 1 : 0),
      }));
      setRevealed(false);
      setIndex((i) => i + 1);
    });
  }

  const progress = ((index + 1) / queue.length) * 100;

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-xs text-muted-foreground">
          <span className="font-medium">
            {index + 1} / {queue.length}
          </span>
          <span className="flex items-center gap-2">
            <span
              className={`size-1.5 rounded-full ${
                current.status === "new"
                  ? "bg-accent shadow-[0_0_8px_currentColor]"
                  : "bg-primary"
              }`}
            />
            {current.status === "new" ? "Yeni kelime" : "Tekrar"} · {current.level}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <motion.div
            className="aurora-bg h-full"
            initial={{ width: `${(index / queue.length) * 100}%` }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={current.id}
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="glass min-h-[340px] rounded-3xl p-10"
        >
          <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <motion.h2
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.4 }}
              className="aurora-text text-5xl font-bold tracking-tight sm:text-6xl"
            >
              {current.word}
            </motion.h2>

            <div className="flex items-center gap-3 text-sm text-muted-foreground">
              {current.pronunciation && (
                <span className="font-mono">{current.pronunciation}</span>
              )}
              {current.pos && (
                <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs">
                  {current.pos}
                </span>
              )}
            </div>

            <AnimatePresence mode="wait">
              {revealed ? (
                <motion.div
                  key="revealed"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-6 w-full space-y-4 border-t border-white/10 pt-6"
                >
                  <p className="text-2xl font-semibold text-foreground">
                    {current.meaning_tr}
                  </p>
                  <p className="text-sm italic text-muted-foreground">
                    {current.meaning_en}
                  </p>
                  {current.example_en && (
                    <div className="mt-4 rounded-xl border border-white/5 bg-white/5 p-4 text-left">
                      <p className="text-sm leading-relaxed text-foreground/90">
                        &ldquo;{current.example_en}&rdquo;
                      </p>
                      {current.example_tr && (
                        <p className="mt-2 text-xs italic text-muted-foreground">
                          {current.example_tr}
                        </p>
                      )}
                    </div>
                  )}
                </motion.div>
              ) : (
                <motion.button
                  key="reveal"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setRevealed(true)}
                  className="glass mt-8 rounded-xl border border-white/10 px-6 py-3 text-sm font-medium text-foreground/80 transition-colors hover:text-foreground"
                >
                  Cevabı göster <span className="ml-2 text-xs text-muted-foreground">(Space)</span>
                </motion.button>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Rating buttons */}
      <AnimatePresence>
        {revealed && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            className="mt-6 grid grid-cols-4 gap-2"
          >
            {ratingButtons.map((b) => (
              <motion.button
                key={b.rating}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.96 }}
                onClick={() => handleRate(b.rating)}
                disabled={pending}
                className={`flex flex-col items-center justify-center rounded-xl border px-4 py-4 font-semibold transition-all disabled:opacity-50 ${b.className}`}
              >
                <span>{b.label}</span>
                <span className="mt-1 text-[10px] opacity-60">[{b.shortcut}]</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
