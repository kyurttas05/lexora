"use client";

import { useState, useTransition } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { saveOnboarding, type OnboardingData } from "./actions";

type Step = "welcome" | "level" | "exam" | "goal" | "finishing";

const LEVELS: { value: OnboardingData["level"]; label: string; description: string }[] = [
  { value: "A2", label: "A2", description: "Temel — basit konular, gunluk hayat" },
  { value: "B1", label: "B1", description: "Orta — tan?d?k konularda akici" },
  { value: "B2", label: "B2", description: "Iyi orta — soyut konular, FCE seviyesi" },
  { value: "C1", label: "C1", description: "Ileri — karmasik metinler, CAE seviyesi" },
  { value: "C2", label: "C2", description: "Usta — neredeyse anadili gibi" },
];

const EXAMS: { value: OnboardingData["target_exam"]; label: string; description: string }[] = [
  { value: "CAE", label: "Cambridge CAE", description: "C1 Advanced sinavi" },
  { value: "FCE", label: "Cambridge FCE", description: "B2 First sinavi" },
  { value: "IELTS", label: "IELTS", description: "Akademik / Genel" },
  { value: "TOEFL", label: "TOEFL", description: "ABD odakl?, akademik" },
  { value: "general", label: "Genel ingilizce", description: "Belirli sinav hedefim yok" },
];

const GOALS: { value: number; label: string; description: string }[] = [
  { value: 10, label: "10 kelime", description: "Rahat — ~5 dakika" },
  { value: 20, label: "20 kelime", description: "Normal — ~10 dakika" },
  { value: 30, label: "30 kelime", description: "Hizli — ~15 dakika" },
  { value: 50, label: "50 kelime", description: "Yogun — ~25 dakika" },
];

export default function OnboardingWizard({ displayName }: { displayName: string | null }) {
  const [step, setStep] = useState<Step>("welcome");
  const [level, setLevel] = useState<OnboardingData["level"]>("B2");
  const [exam, setExam] = useState<OnboardingData["target_exam"]>("CAE");
  const [goal, setGoal] = useState<number>(20);
  const [pending, startTransition] = useTransition();

  function finish() {
    setStep("finishing");
    startTransition(async () => {
      await saveOnboarding({ level, target_exam: exam, daily_goal: goal });
    });
  }

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="w-full max-w-xl">
        {/* Progress */}
        <ProgressDots step={step} />

        <AnimatePresence mode="wait">
          {step === "welcome" && (
            <StepWrapper key="welcome">
              <div className="glass rounded-3xl p-10 text-center">
                <div className="mb-6 text-6xl">👋</div>
                <h1 className="aurora-text mb-3 text-4xl font-bold">
                  Hos geldin{displayName ? `, ${displayName}` : ""}!
                </h1>
                <p className="mb-2 text-lg text-foreground/80">
                  Lexora ile B2&apos;den C1&apos;e ingilizce yolculugun basliyor.
                </p>
                <p className="mb-8 text-sm text-muted-foreground">
                  Once seni biraz tan?yal?m — 30 saniye al?r.
                </p>
                <Button
                  size="lg"
                  className="aurora-bg glow-primary text-white"
                  onClick={() => setStep("level")}
                >
                  Hadi baslayalim →
                </Button>
              </div>
            </StepWrapper>
          )}

          {step === "level" && (
            <StepWrapper key="level">
              <div className="glass rounded-3xl p-8">
                <h2 className="mb-2 text-2xl font-bold">Su an hangi seviyedesin?</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  CEFR (A1-C2). Emin degilsen B1 sec, sonra degistirebilirsin.
                </p>
                <div className="space-y-2">
                  {LEVELS.map((l) => (
                    <OptionButton
                      key={l.value}
                      selected={level === l.value}
                      onClick={() => setLevel(l.value)}
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-white/5 font-bold">
                          {l.label}
                        </div>
                        <div className="text-left">
                          <div className="font-medium">{l.label}</div>
                          <div className="text-xs text-muted-foreground">{l.description}</div>
                        </div>
                      </div>
                    </OptionButton>
                  ))}
                </div>
                <NavButtons onBack={() => setStep("welcome")} onNext={() => setStep("exam")} />
              </div>
            </StepWrapper>
          )}

          {step === "exam" && (
            <StepWrapper key="exam">
              <div className="glass rounded-3xl p-8">
                <h2 className="mb-2 text-2xl font-bold">Hedef sinav?</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Hangi sinava haz?rlan?yorsun? Belirli bir sinav yoksa &ldquo;Genel&rdquo; sec.
                </p>
                <div className="space-y-2">
                  {EXAMS.map((e) => (
                    <OptionButton
                      key={e.value}
                      selected={exam === e.value}
                      onClick={() => setExam(e.value)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{e.label}</div>
                        <div className="text-xs text-muted-foreground">{e.description}</div>
                      </div>
                    </OptionButton>
                  ))}
                </div>
                <NavButtons onBack={() => setStep("level")} onNext={() => setStep("goal")} />
              </div>
            </StepWrapper>
          )}

          {step === "goal" && (
            <StepWrapper key="goal">
              <div className="glass rounded-3xl p-8">
                <h2 className="mb-2 text-2xl font-bold">Gunluk hedefin?</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Her gun kac kelime calismak istiyorsun? Tutarli olmak miktar?ndan onemli.
                </p>
                <div className="space-y-2">
                  {GOALS.map((g) => (
                    <OptionButton
                      key={g.value}
                      selected={goal === g.value}
                      onClick={() => setGoal(g.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-left">
                          <div className="font-medium">{g.label}</div>
                          <div className="text-xs text-muted-foreground">{g.description}</div>
                        </div>
                      </div>
                    </OptionButton>
                  ))}
                </div>
                <NavButtons
                  onBack={() => setStep("exam")}
                  onNext={finish}
                  nextLabel="Bitir"
                  disabled={pending}
                />
              </div>
            </StepWrapper>
          )}

          {step === "finishing" && (
            <StepWrapper key="finishing">
              <div className="glass rounded-3xl p-12 text-center">
                <div className="mb-6 animate-pulse text-6xl">🎉</div>
                <h2 className="aurora-text mb-3 text-3xl font-bold">Her sey haz?r!</h2>
                <p className="text-muted-foreground">
                  Profiline kaydediyoruz, dashboard&apos;a yonlendiriyorum...
                </p>
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StepWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function OptionButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-2xl border p-4 transition-all ${
        selected
          ? "border-primary/50 bg-primary/10 glow-primary"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function NavButtons({
  onBack,
  onNext,
  nextLabel = "Devam",
  disabled = false,
}: {
  onBack: () => void;
  onNext: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <Button variant="outline" className="glass" onClick={onBack}>
        ← Geri
      </Button>
      <Button
        className="aurora-bg glow-primary text-white"
        onClick={onNext}
        disabled={disabled}
      >
        {nextLabel}
      </Button>
    </div>
  );
}

function ProgressDots({ step }: { step: Step }) {
  const steps: Step[] = ["welcome", "level", "exam", "goal"];
  const currentIdx = steps.indexOf(step);
  return (
    <div className="mb-8 flex justify-center gap-2">
      {steps.map((s, i) => (
        <div
          key={s}
          className={`h-1.5 rounded-full transition-all ${
            i === currentIdx
              ? "aurora-bg w-12"
              : i < currentIdx
                ? "w-6 bg-primary/40"
                : "w-6 bg-white/10"
          }`}
        />
      ))}
    </div>
  );
}
