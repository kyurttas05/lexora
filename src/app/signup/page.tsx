"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "motion/react";
import { signup, type AuthState } from "../login/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signup, null);

  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="glass w-full max-w-md rounded-3xl p-8"
      >
        <div className="mb-8 text-center">
          <Link href="/">
            <span className="aurora-text text-3xl font-bold tracking-tight">Lexora</span>
          </Link>
          <h1 className="mt-6 text-2xl font-bold">Yolculuğa başla</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="font-medium text-accent hover:underline">
              Giriş yap
            </Link>
          </p>
        </div>

        <form action={formAction} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="display_name">Görünen ad</Label>
            <Input
              id="display_name"
              name="display_name"
              type="text"
              placeholder="Kaan"
              autoComplete="name"
              className="bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="sen@ornek.com"
              required
              autoComplete="email"
              className="bg-white/5"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Şifre</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              className="bg-white/5"
            />
            <p className="text-xs text-muted-foreground">En az 8 karakter.</p>
          </div>
          {state?.error && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-destructive"
            >
              {state.error}
            </motion.p>
          )}
          <Button
            type="submit"
            className="aurora-bg glow-primary mt-2 h-11 w-full text-base font-semibold text-white transition-transform hover:scale-[1.02]"
            disabled={pending}
          >
            {pending ? "Hesap oluşturuluyor..." : "Hesabımı oluştur"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
