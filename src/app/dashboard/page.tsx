import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { logout } from "../login/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

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

  // Bugünkü çalışma istatistiği
  const todayStart = new Date();
  todayStart.setHours(0, 0, 0, 0);

  const { count: reviewedToday } = await supabase
    .from("user_word_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .gte("last_reviewed_at", todayStart.toISOString());

  // Vadesi gelen kelime sayısı
  const { count: dueCount } = await supabase
    .from("user_word_progress")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id)
    .lte("next_review_at", new Date().toISOString());

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <header className="border-b border-zinc-200 bg-white px-6 py-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <h1 className="text-xl font-semibold">Lexora</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-zinc-600 dark:text-zinc-400">
              {profile?.display_name ?? user.email}
            </span>
            <form action={logout}>
              <Button type="submit" variant="outline" size="sm">
                Çıkış
              </Button>
            </form>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-5xl px-6 py-12">
        <h2 className="mb-2 text-3xl font-bold">
          Hoş geldin{profile?.display_name ? `, ${profile.display_name}` : ""} 👋
        </h2>
        <p className="mb-2 text-zinc-600 dark:text-zinc-400">
          Seviye: <strong>{profile?.level ?? "B2"}</strong> · Günlük hedef:{" "}
          <strong>{profile?.daily_goal ?? 20} kelime</strong>
        </p>
        <p className="mb-8 text-sm text-zinc-500 dark:text-zinc-500">
          Bugün <strong>{reviewedToday ?? 0}</strong> kelime çalıştın ·{" "}
          <strong>{dueCount ?? 0}</strong> tekrar bekliyor
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>📚 Kelime</CardTitle>
              <CardDescription>Aralıklı tekrar ile B2-C1 kelimeleri</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/vocab">
                <Button>Çalışmaya başla →</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>📖 Okuma</CardTitle>
              <CardDescription>AI destekli pasaj alıştırmaları</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled variant="outline">
                Faz 2&apos;de
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✍️ Gramer</CardTitle>
              <CardDescription>CAE müfredatına göre yapısal alıştırmalar</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled variant="outline">
                Faz 3&apos;te
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>✏️ Yazma</CardTitle>
              <CardDescription>AI ile detaylı değerlendirme</CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled variant="outline">
                Faz 4&apos;te
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
