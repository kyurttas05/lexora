import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { Button } from "@/components/ui/button";

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
    .select("display_name, level, target_exam, daily_goal")
    .eq("id", user.id)
    .single();

  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: reviewedToday } = await supabase
    .from("user_word_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("last_reviewed_at", todayStart.toISOString());

  const { count: dueCount } = await supabase
    .from("user_word_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString());

  const { count: masteredCount } = await supabase
    .from("user_word_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "mastered");

  const skills = [
    {
      key: "vocab",
      emoji: "📚",
      name: "Kelime",
      description: "Aralıklı tekrar ile B2-C1 seviyesi kelimeler",
      href: "/dashboard/vocab",
      active: true,
      accent: "primary" as const,
    },
    {
      key: "reading",
      emoji: "📖",
      name: "Okuma",
      description: "AI destekli pasaj soruları",
      href: null,
      active: false,
      accent: "accent" as const,
    },
    {
      key: "grammar",
      emoji: "✍️",
      name: "Gramer",
      description: "CAE müfredatına göre yapısal alıştırmalar",
      href: null,
      active: false,
      accent: "primary" as const,
    },
    {
      key: "writing",
      emoji: "✏️",
      name: "Yazma",
      description: "AI ile detaylı değerlendirme",
      href: null,
      active: false,
      accent: "accent" as const,
    },
  ];

  return (
    <div className="flex flex-1 flex-col">
      <header className="border-b border-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <Link href="/dashboard">
            <span className="aurora-text text-2xl font-bold tracking-tight">Lexora</span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">
              {profile?.display_name ?? user.email}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm" className="glass">
                Çıkış
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <div className="mb-10">
          <h2 className="mb-2 text-4xl font-bold tracking-tight sm:text-5xl">
            Hoş geldin
            {profile?.display_name && (
              <>
                , <span className="aurora-text">{profile.display_name}</span>
              </>
            )}{" "}
            <span className="inline-block animate-[wave_1.5s_ease-in-out_infinite] origin-[70%_70%]">
              👋
            </span>
          </h2>
          <p className="text-muted-foreground">
            Seviye{" "}
            <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-xs font-medium text-foreground">
              {profile?.level ?? "B2"}
            </span>
            {" · "}
            Günlük hedef <strong className="text-foreground">{profile?.daily_goal ?? 20}</strong>{" "}
            kelime
          </p>
        </div>

        {/* Stats grid */}
        <div className="mb-10 grid gap-3 sm:grid-cols-3">
          <StatTile
            label="Bugün çalışılan"
            value={reviewedToday ?? 0}
            suffix="kelime"
            accent="primary"
          />
          <StatTile
            label="Tekrar bekleyen"
            value={dueCount ?? 0}
            suffix="kelime"
            accent="accent"
          />
          <StatTile
            label="Ustalaşılan"
            value={masteredCount ?? 0}
            suffix="kelime"
            accent="success"
          />
        </div>

        {/* Skill cards */}
        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <SkillCard key={skill.key} skill={skill} />
          ))}
        </div>
      </main>
    </div>
  );
}

function StatTile({
  label,
  value,
  suffix,
  accent,
}: {
  label: string;
  value: number;
  suffix: string;
  accent: "primary" | "accent" | "success";
}) {
  const accentClass =
    accent === "primary"
      ? "text-primary"
      : accent === "accent"
        ? "text-accent"
        : "text-success";
  return (
    <div className="glass rounded-2xl p-5">
      <div className="text-xs uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1.5 flex items-baseline gap-1.5">
        <span className={`text-3xl font-bold ${accentClass}`}>{value}</span>
        <span className="text-sm text-muted-foreground">{suffix}</span>
      </div>
    </div>
  );
}

function SkillCard({
  skill,
}: {
  skill: {
    emoji: string;
    name: string;
    description: string;
    href: string | null;
    active: boolean;
    accent: "primary" | "accent";
  };
}) {
  const card = (
    <div
      className={`glass group relative overflow-hidden rounded-2xl p-6 transition-all ${
        skill.active
          ? "cursor-pointer hover:-translate-y-1 hover:shadow-2xl"
          : "opacity-60"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-8 -top-8 size-28 rounded-full opacity-15 blur-2xl transition-opacity group-hover:opacity-30 ${
          skill.accent === "primary" ? "bg-primary" : "bg-accent"
        }`}
      />
      <div className="relative mb-4 flex items-center justify-between">
        <span className="text-4xl">{skill.emoji}</span>
        {skill.active ? (
          <span className="rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            Aktif
          </span>
        ) : (
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-muted-foreground">
            Yakında
          </span>
        )}
      </div>
      <h3 className="relative mb-1 text-2xl font-semibold tracking-tight">{skill.name}</h3>
      <p className="relative mb-4 text-sm leading-relaxed text-muted-foreground">
        {skill.description}
      </p>
      {skill.active && (
        <div className="relative flex items-center gap-1.5 text-sm font-medium text-primary">
          Çalışmaya başla
          <span className="transition-transform group-hover:translate-x-1">→</span>
        </div>
      )}
    </div>
  );

  if (skill.href) {
    return <Link href={skill.href}>{card}</Link>;
  }
  return card;
}
