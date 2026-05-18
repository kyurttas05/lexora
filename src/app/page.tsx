"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";

const skills = [
  {
    name: "Kelime",
    description: "Aralıklı tekrar ile B2-C1 seviyesi kelime ezberleme",
    emoji: "📚",
    status: "Aktif",
    accent: "primary" as const,
  },
  {
    name: "Okuma",
    description: "Cambridge tarzı pasajlar, AI destekli soru üretimi",
    emoji: "📖",
    status: "Yakında",
    accent: "accent" as const,
  },
  {
    name: "Gramer",
    description: "CAE müfredatına göre yapısal alıştırmalar",
    emoji: "✍️",
    status: "Yakında",
    accent: "primary" as const,
  },
  {
    name: "Yazma",
    description: "AI ile detaylı değerlendirme ve geri bildirim",
    emoji: "✏️",
    status: "Yakında",
    accent: "accent" as const,
  },
];

export default function Home() {
  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16 sm:py-24">
      <div className="w-full max-w-5xl">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, duration: 0.6, ease: "easeOut" }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-muted-foreground backdrop-blur"
          >
            <span className="size-1.5 rounded-full bg-accent shadow-[0_0_8px_currentColor]" />
            B2 → C1 yolculuğun başlasın
          </motion.div>

          <h1 className="aurora-text mb-6 text-6xl font-bold tracking-tight sm:text-7xl md:text-8xl">
            Lexora
          </h1>
          <p className="mx-auto max-w-xl text-lg text-foreground/80 sm:text-xl">
            Cambridge müfredatına dayalı, <span className="text-accent">AI destekli</span> İngilizce
            öğrenme platformu.
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row"
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
              <Button
                size="lg"
                variant="outline"
                className="glass h-12 px-8 text-base font-medium"
              >
                Giriş yap
              </Button>
            </Link>
          </motion.div>
        </motion.header>

        <div className="grid gap-4 sm:grid-cols-2">
          {skills.map((skill, i) => (
            <motion.div
              key={skill.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + i * 0.08, duration: 0.5, ease: "easeOut" }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="glass group relative overflow-hidden rounded-2xl p-6 transition-shadow hover:shadow-2xl"
            >
              {/* Decorative gradient blob in corner */}
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
              <h2 className="relative mb-1.5 text-2xl font-semibold tracking-tight">
                {skill.name}
              </h2>
              <p className="relative text-sm leading-relaxed text-muted-foreground">
                {skill.description}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.6 }}
          className="mt-16 text-center text-xs text-muted-foreground/60"
        >
          Lexora · İngilizce öğrenme yolculuğun başlıyor ✨
        </motion.footer>
      </div>
    </div>
  );
}
