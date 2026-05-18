import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { generateQuestions, type LessonWord } from "@/lib/lesson-generator";
import LessonRunner from "./LessonRunner";

type LessonWordRow = {
  word: LessonWord;
};

export default async function LessonPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Lesson'i ve kelimelerini cek
  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, name, description")
    .eq("id", id)
    .single();

  if (!lesson) notFound();

  const { data: wordRows } = await supabase
    .from("lesson_words")
    .select(
      "word:words!inner(id, word, pos, pronunciation, meaning_en, meaning_tr, example_en, example_tr)",
    )
    .eq("lesson_id", id)
    .order("position", { ascending: true })
    .returns<LessonWordRow[]>();

  const words = (wordRows ?? []).map((r) => r.word);

  if (words.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-24 text-center">
        <p className="text-muted-foreground">Bu derste henuz kelime yok.</p>
      </div>
    );
  }

  const questions = generateQuestions(words);

  // Profilden mevcut hearts'i al
  const { data: profile } = await supabase
    .from("user_profiles")
    .select("hearts")
    .eq("id", user.id)
    .single();

  return (
    <LessonRunner
      lesson={lesson}
      questions={questions}
      wordIds={words.map((w) => w.id)}
      initialHearts={profile?.hearts ?? 5}
    />
  );
}
