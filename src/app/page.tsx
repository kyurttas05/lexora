"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: "📚",
    title: "Cambridge müfredatı",
    description:
      "Resmi sınav materyallerine göre tasarlanmış kelime listeleri ve ders yapısı.",
  },
  {
    icon: "🧠",
    title: "AI destekli",
    description:
      "Akıllı soru üretimi, yazma değerlendirme. Claude API ile güçlendirilmiş.",
  },
  {
    icon: "🎯",
    title: "Aralıklı tekrar",
    description:
      "SM-2 algoritması — tam unutmak üzereyken karşına çıkar. Bilimsel ezberleme.",
  },
  {
    icon: "🔥",
    title: "Günlük motivasyon",
    description:
      "Streak, XP, kalpler. Tutarlılığı eğlenceli hale getiren oyun mekanikleri.",
  },
];

const steps = [
  {
    n: 1,
    title: "Kayıt ol ve seviyeni belirle",
    description: "30 saniyelik bir wizard ile seviyen, hedefin ve günlük süren belirlenir.",
  },
  {
    n: 2,
    title: "Günde 10-15 dakika çalış",
    description:
      "Kısa, çeşitli dersler. Çoktan seçmeli, boşluk doldur, ceviri yaz, hızlı eşleştir.",
  },
  {
    n: 3,
    title: "B2'den C1'e ilerle",
    description:
      "Aralıklı tekrar ile kalıcı öğrenme. Gerçek Cambridge sınav kelimeleri.",
  },
];

const skills = [
  {
    emoji: "📚",
    name: "Kelime",
    description: "Aralıklı tekrar + 4 farklı soru tipi",
    status: "Aktif",
    accent: "primary" as const,
  },
  {
    emoji: "📖",
    name: "Okuma",
    description: "Cambridge tarzı pasajlar, AI ile soru üretimi",
    status: "Yakında",
    accent: "accent" as const,
  },
  {
    emoji: "✍️",
    name: "Gramer",
    description: "CAE müfredatına göre yapısal alıştırmalar",
    status: "Yakında",
    accent: "primary" as const,
  },
  {
    emoji: "✏️",
    name: "Yazma",
    description: "AI ile detaylı değerlendirme ve geri bildirim",
    status: "Yakında",
    accent: "accent" as const,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 flex-col">
      {/* Top nav */}
      <nav className="border-b border-white/5 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <span className="aurora-text text-2xl font-bold tracking-tight">Lexora</span>
          <div className="flex items-center gap-2">
            <Link href="/login">
              <Button variant="outline" size="sm" className="glass">
                Giriş yap
              </Button>
            </Link>
            <Link href="/signup">
              <Button size="sm" className="aurora-bg text-white">
                Ücretsiz başla
              </Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative overflow-hidden px-6 pb-24 pt-20 sm:pt-32">
        <div className="mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
            Cambridge müfredatına dayalı · AI destekli
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="mb-6 text-5xl font-bold leading-tight tracking-tight sm:text-7xl"
          >
            B2&apos;den <span className="aurora-text">C1&apos;e</span>
            <br />
            ingilizce yolculuğun
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-10 max-w-2xl text-lg text-foreground/80 sm:text-xl"
          >
            Cambridge sınav müfredatı + AI değerlendirme + oyun gibi öğrenme.
            <br className="hidden sm:block" />
            Günde 15 dakika ile gerçek sonuçlar.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link href="/signup">
              <Button
                size="lg"
                className="aurora-bg glow-primary h-12 px-8 text-base font-semibold text-white transition-transform hover:scale-105"
              >
                Ücretsiz başla →
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="glass h-12 px-8 text-base">
                Giriş yap
              </Button>
            </Link>
          </motion.div>

          {/* Decoration: floating word chips */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="pointer-events-none mt-16 flex flex-wrap justify-center gap-3 text-sm"
          >
            {["alleviate", "scrutinize", "compelling", "endure", "viable", "mitigate"].map(
              (w, i) => (
                <motion.span
                  key={w}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 + i * 0.1, duration: 0.4 }}
                  className="glass rounded-full px-4 py-1.5 font-medium text-muted-foreground"
                >
                  {w}
                </motion.span>
              ),
            )}
          </motion.div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-3 text-center text-3xl font-bold sm:text-4xl">
            Niye <span className="aurora-text">Lexora</span>?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Sade flashcard değil. Modern bir öğrenme deneyimi.
          </p>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="glass rounded-2xl p-5"
              >
                <div className="mb-3 text-3xl">{f.icon}</div>
                <h3 className="mb-1.5 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold sm:text-4xl">
            Nasıl çalışır?
          </h2>
          <p className="mx-auto mb-14 max-w-2xl text-center text-muted-foreground">
            3 adımda başla, kalıcı sonuçlara ulaş.
          </p>
          <div className="grid gap-6 md:grid-cols-3">
            {steps.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative"
              >
                <div className="aurora-bg mb-4 flex size-12 items-center justify-center rounded-2xl text-xl font-bold text-white glow-primary">
                  {s.n}
                </div>
                <h3 className="mb-2 text-xl font-semibold">{s.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {s.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SKILLS PREVIEW */}
      <section className="border-y border-white/5 bg-white/[0.02] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <h2 className="mb-3 text-center text-3xl font-bold sm:text-4xl">
            4 beceri, tek platform
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
            Cambridge sınavlarında ayrı puanlanan her beceri için ayrı modül.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {skills.map((skill, i) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="glass group relative overflow-hidden rounded-2xl p-6"
              >
                <div
                  className={`pointer-events-none absolute -right-6 -top-6 size-24 rounded-full opacity-20 blur-2xl transition-opacity group-hover:opacity-40 ${
                    skill.accent === "primary" ? "bg-primary" : "bg-accent"
                  }`}
                />
                <div className="relative mb-4 flex items-center justify-between">
                  <span className="text-4xl">{skill.emoji}</span>
                  <span
                    className={`rounded-full border px-3 py-1 text-xs font-medium ${
                      skill.status === "Aktif"
                        ? "border-success/30 bg-success/10 text-success"
                        : "border-white/10 bg-white/5 text-muted-foreground"
                    }`}
                  >
                    {skill.status}
                  </span>
                </div>
                <h3 className="relative mb-1.5 text-2xl font-semibold tracking-tight">
                  {skill.name}
                </h3>
                <p className="relative text-sm leading-relaxed text-muted-foreground">
                  {skill.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="glass relative mx-auto max-w-3xl overflow-hidden rounded-3xl px-8 py-16 text-center"
        >
          <div className="aurora-bg pointer-events-none absolute -top-20 left-1/2 size-72 -translate-x-1/2 rounded-full opacity-20 blur-3xl" />
          <div className="relative">
            <h2 className="mb-4 text-3xl font-bold sm:text-5xl">
              Yolculuğa <span className="aurora-text">başla</span>
            </h2>
            <p className="mx-auto mb-10 max-w-lg text-lg text-foreground/80">
              Kayıt 30 saniye. Kredi kartı yok. Hemen ilk dersin seni bekliyor.
            </p>
            <Link href="/signup">
              <Button
                size="lg"
                className="aurora-bg glow-primary h-12 px-10 text-base font-semibold text-white transition-transform hover:scale-105"
              >
                Ücretsiz hesap aç →
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/5 px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            <span className="aurora-text font-semibold">Lexora</span> · B2&apos;den C1&apos;e
            ingilizce yolculuğu
          </p>
          <p className="text-xs text-muted-foreground/60">
            Cambridge müfredatı · AI destekli · Açık kaynak
          </p>
        </div>
      </footer>
    </div>
  );
}
