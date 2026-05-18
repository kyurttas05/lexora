"use client";

import Link from "next/link";
import { useActionState } from "react";
import { motion } from "motion/react";
import { login, type AuthState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(login, null);

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
          <h1 className="mt-6 text-2xl font-bold">Tekrar hoş geldin</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hesabın yok mu?{" "}
            <Link href="/signup" className="font-medium text-accent hover:underline">
              Kayıt ol
            </Link>
          </p>
        </div>

        <form action={formAction} className="space-y-4">
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
              autoComplete="current-password"
              className="bg-white/5"
            />
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
            {pending ? "Giriş yapılıyor..." : "Giriş yap"}
          </Button>
        </form>
      </motion.div>
    </div>
  );
}
