"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signup, type AuthState } from "../login/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SignupPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(signup, null);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Lexora&apos;ya kayıt ol</CardTitle>
          <CardDescription>
            Zaten hesabın var mı?{" "}
            <Link href="/login" className="font-medium text-foreground underline underline-offset-4">
              Giriş yap
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="display_name">Görünen ad (opsiyonel)</Label>
              <Input
                id="display_name"
                name="display_name"
                type="text"
                placeholder="Kaan"
                autoComplete="name"
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
              />
              <p className="text-xs text-zinc-500">En az 8 karakter.</p>
            </div>
            {state?.error && (
              <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Kayıt olunuyor..." : "Hesap oluştur"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
