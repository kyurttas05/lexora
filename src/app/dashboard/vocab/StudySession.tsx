"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { submitReview, type ReviewWord } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { ReviewRating } from "@/lib/sm2";

type Props = {
  initialQueue: ReviewWord[];
};

export default function StudySession({ initialQueue }: Props) {
  const [queue] = useState(initialQueue);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [stats, setStats] = useState({ correct: 0, wrong: 0 });
  const [pending, startTransition] = useTransition();

  if (queue.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="mb-2 text-2xl font-bold">Bugün için her şey tamam 🎉</h2>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Yarın yeni kelimeler ve tekrarlar seni bekliyor.
        </p>
        <Link href="/dashboard">
          <Button>Dashboard&apos;a dön</Button>
        </Link>
      </div>
    );
  }

  if (index >= queue.length) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h2 className="mb-2 text-3xl font-bold">Seans tamam! 🎯</h2>
        <p className="mb-2 text-lg text-zinc-700 dark:text-zinc-300">
          {queue.length} kelime çalıştın.
        </p>
        <p className="mb-6 text-zinc-600 dark:text-zinc-400">
          Doğru: <strong className="text-green-600 dark:text-green-400">{stats.correct}</strong> ·
          Tekrar gereken: <strong className="text-red-600 dark:text-red-400">{stats.wrong}</strong>
        </p>
        <Link href="/dashboard">
          <Button>Dashboard&apos;a dön</Button>
        </Link>
      </div>
    );
  }

  const current = queue[index];

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
      <div className="mb-6">
        <div className="mb-2 flex justify-between text-xs text-zinc-500">
          <span>{index + 1} / {queue.length}</span>
          <span>
            {current.status === "new" ? "🌱 Yeni" : "🔁 Tekrar"} · {current.level}
          </span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-200 dark:bg-zinc-800">
          <div
            className="h-full bg-zinc-900 transition-all dark:bg-zinc-100"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Flashcard */}
      <Card className="min-h-[300px]">
        <CardContent className="flex flex-col items-center justify-center gap-4 p-8 text-center">
          <h2 className="text-4xl font-bold tracking-tight">{current.word}</h2>
          {current.pronunciation && (
            <p className="text-lg text-zinc-500">{current.pronunciation}</p>
          )}
          {current.pos && (
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
              {current.pos}
            </span>
          )}

          {revealed ? (
            <div className="mt-4 space-y-3 border-t border-zinc-200 pt-4 dark:border-zinc-800">
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-50">
                {current.meaning_tr}
              </p>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                <em>{current.meaning_en}</em>
              </p>
              {current.example_en && (
                <div className="mt-4 rounded-md bg-zinc-50 p-3 text-left dark:bg-zinc-900">
                  <p className="text-sm italic text-zinc-700 dark:text-zinc-300">
                    &ldquo;{current.example_en}&rdquo;
                  </p>
                  {current.example_tr && (
                    <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-500">
                      {current.example_tr}
                    </p>
                  )}
                </div>
              )}
            </div>
          ) : (
            <Button
              size="lg"
              variant="outline"
              onClick={() => setRevealed(true)}
              className="mt-4"
            >
              Cevabı göster
            </Button>
          )}
        </CardContent>
      </Card>

      {/* Rating buttons */}
      {revealed && (
        <div className="mt-4 grid grid-cols-4 gap-2">
          <Button
            variant="destructive"
            onClick={() => handleRate("again")}
            disabled={pending}
          >
            Tekrar
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRate("hard")}
            disabled={pending}
          >
            Zor
          </Button>
          <Button
            variant="outline"
            onClick={() => handleRate("good")}
            disabled={pending}
          >
            İyi
          </Button>
          <Button
            variant="default"
            onClick={() => handleRate("easy")}
            disabled={pending}
          >
            Kolay
          </Button>
        </div>
      )}
    </div>
  );
}
