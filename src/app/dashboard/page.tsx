import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { Button } from "@/components/ui/button";

type LessonRow = {
  id: string;
  name: string;
  description: string | null;
  position: number;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("user_profiles")
    .select(
      "display_name, level, target_exam, daily_goal, total_xp, current_streak, longest_streak, hearts, hearts_reset_at",
    )
    .eq("id", user.id)
    .single();

  // Tum public lesson'lari cek (starter deck'ten)
  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, name, description, position")
    .order("position", { ascending: true })
    .returns<LessonRow[]>();

  // Tamamlanmis lesson_id'lerini cek (progress gostermek icin)
  const { data: completedAttempts } = await supabase
    .from("lesson_attempts")
    .select("lesson_id, xp_earned, completed_at")
    .eq("user_id", user.id)
    .not("completed_at", "is", null);

  const completedLessonIds = new Set(
    (completedAttempts ?? []).map((a) => a.lesson_id),
  );

  // Hearts: 24 saatten fazla gectiyse 5 goster (DB'de henuz yenilenmedi ama UI'da goster)
  let displayHearts = profile?.hearts ?? 5;
  if (profile?.hearts_reset_at) {
    const hoursSinceReset =
      (Date.now() - new Date(profile.hearts_reset_at).getTime()) / 1000 / 60 / 60;
    if (hoursSinceReset >= 24) displayHearts = 5;
  }

  const xp = profile?.total_xp ?? 0;
  const xpToNextLevel = 100;
  const level = Math.floor(xp / xpToNextLevel) + 1;
  const xpInLevel = xp % xpToNextLevel;
  const xpProgress = (xpInLevel / xpToNextLevel) * 100;

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <span className="aurora-text text-2xl font-bold tracking-tight">Lexora</span>
          </Link>

          {/* Stats bar */}
          <div className="flex items-center gap-4">
            <StatBadge icon="🔥" value={profile?.current_streak ?? 0} label="streak" />
            <StatBadge icon="⭐" value={xp} label="XP" />
            <StatBadge icon="❤️" value={displayHearts} label="hearts" />
            <div className="ml-2 flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {profile?.display_name ?? user.email}
              </span>
              <form action={logout}>
                <Button type="submit" variant="outline" size="sm" className="glass">
                  Cikis
                </Button>
              </form>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        {/* Greeting + Level */}
        <div className="mb-10">
          <h2 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Hos geldin
            {profile?.display_name && (
              <>
                , <span className="aurora-text">{profile.display_name}</span>
              </>
            )}{" "}
            <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite] origin-[70%_70%]">
              👋
            </span>
          </h2>

          {/* Level + XP progress */}
          <div className="mt-6 glass max-w-md rounded-2xl p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-semibold">
                Seviye <span className="aurora-text">{level}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {xpInLevel} / {xpToNextLevel} XP
              </span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-white/5">
              <div className="aurora-bg h-full transition-all" style={{ width: `${xpProgress}%` }} />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              CEFR: <strong className="text-foreground">{profile?.level ?? "B2"}</strong>
              {" · "}
              {xpToNextLevel - xpInLevel} XP sonra seviye atlarsin
            </p>
          </div>
        </div>

        {/* Lessons path */}
        <div className="mb-8">
          <div className="mb-4 flex items-baseline justify-between">
            <h3 className="text-2xl font-semibold">Bugunun dersleri</h3>
            <span className="text-sm text-muted-foreground">
              {completedLessonIds.size} / {lessons?.length ?? 0} tamamlandi
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(lessons ?? []).map((lesson, i) => {
              const done = completedLessonIds.has(lesson.id);
              const isNext = !done && i === completedLessonIds.size;
              return (
                <LessonCard
                  key={lesson.id}
                  lesson={lesson}
                  done={done}
                  isNext={isNext}
                  disabled={displayHearts <= 0}
                />
              );
            })}
            {(!lessons || lessons.length === 0) && (
              <p className="col-span-2 text-sm text-muted-foreground">
                Henuz ders yok. Supabase&apos;de migration 003 calistirildi mi?
              </p>
            )}
          </div>
        </div>

        {/* Eski flashcard linki — alt secenek olarak */}
        <div className="glass rounded-2xl p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="font-semibold">Serbest pratik (eski flashcard)</p>
              <p className="text-sm text-muted-foreground">
                Klasik SM-2 ile aralikli tekrar — ilave calisma icin
              </p>
            </div>
            <Link href="/dashboard/vocab">
              <Button variant="outline" className="glass">
                Ac
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

function StatBadge({ icon, value, label }: { icon: string; value: number; label: string }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
      <span className="text-sm">{icon}</span>
      <span className="text-sm font-semibold">{value}</span>
      <span className="hidden text-xs text-muted-foreground sm:inline">{label}</span>
    </div>
  );
}

function LessonCard({
  lesson,
  done,
  isNext,
  disabled,
}: {
  lesson: { id: string; name: string; description: string | null; position: number };
  done: boolean;
  isNext: boolean;
  disabled: boolean;
}) {
  const card = (
    <div
      className={`glass group relative overflow-hidden rounded-2xl p-5 transition-all ${
        done
          ? "opacity-70"
          : disabled
            ? "opacity-50 cursor-not-allowed"
            : "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
      } ${isNext ? "ring-2 ring-primary/40 glow-primary" : ""}`}
    >
      {isNext && (
        <span className="absolute -right-1 -top-1 rounded-bl-xl rounded-tr-2xl bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Sirada
        </span>
      )}
      <div className="mb-3 flex items-center gap-3">
        <div
          className={`flex size-10 items-center justify-center rounded-xl text-lg font-bold ${
            done
              ? "bg-success/20 text-success"
              : isNext
                ? "aurora-bg text-white"
                : "bg-white/5 text-muted-foreground"
          }`}
        >
          {done ? "✓" : lesson.position}
        </div>
        <div className="flex-1">
          <h4 className="font-semibold leading-tight">{lesson.name}</h4>
        </div>
      </div>
      <p className="text-xs leading-relaxed text-muted-foreground">{lesson.description}</p>
      {!done && !disabled && (
        <div className="mt-3 flex items-center gap-1.5 text-xs font-medium text-primary">
          {isNext ? "Hadi basla" : "Ac"}
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      )}
      {done && <div className="mt-3 text-xs text-success">Tamamlandi</div>}
    </div>
  );

  if (disabled && !done) return card;
  return <Link href={`/dashboard/lesson/${lesson.id}`}>{card}</Link>;
}
