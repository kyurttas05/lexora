import Link from "next/link";
import { Button } from "@/components/ui/button";

const skills = [
  {
    name: "Kelime",
    description: "Aralıklı tekrar ile B2-C1 seviyesi kelime ezberleme",
    emoji: "📚",
    status: "Geliştiriliyor",
  },
  {
    name: "Okuma",
    description: "Cambridge tarzı pasajlar, AI destekli soru üretimi",
    emoji: "📖",
    status: "Yakında",
  },
  {
    name: "Gramer",
    description: "CAE müfredatına göre yapısal alıştırmalar",
    emoji: "✍️",
    status: "Yakında",
  },
  {
    name: "Yazma",
    description: "AI ile detaylı değerlendirme ve geri bildirim",
    emoji: "✏️",
    status: "Yakında",
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 dark:bg-zinc-950">
      <main className="w-full max-w-5xl px-6 py-16 sm:py-24">
        <header className="mb-12 text-center">
          <h1 className="mb-4 text-5xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50 sm:text-6xl">
            Lexora
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 sm:text-xl">
            B2 → C1 İngilizce öğrenme platformu
          </p>
          <p className="mt-2 text-sm text-zinc-500 dark:text-zinc-500">
            Cambridge ve IELTS müfredatına dayalı, AI destekli
          </p>

          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link href="/signup">
              <Button size="lg">Ücretsiz başla</Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline">Giriş yap</Button>
            </Link>
          </div>
        </header>

        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <div
              key={skill.name}
              className="rounded-xl border border-zinc-200 bg-white p-6 transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-3xl">{skill.emoji}</span>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                  {skill.status}
                </span>
              </div>
              <h2 className="mb-1 text-xl font-semibold text-zinc-900 dark:text-zinc-50">
                {skill.name}
              </h2>
              <p className="text-sm text-zinc-600 dark:text-zinc-400">
                {skill.description}
              </p>
            </div>
          ))}
        </div>

        <footer className="mt-16 text-center text-xs text-zinc-500 dark:text-zinc-500">
          Lexora · İngilizce öğrenme yolculuğu
        </footer>
      </main>
    </div>
  );
}
