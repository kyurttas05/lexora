"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login, type AuthState } from "./actions";
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

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<AuthState, FormData>(login, null);

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Lexora&apos;ya giriş yap</CardTitle>
          <CardDescription>
            Hesabın yoksa{" "}
            <Link href="/signup" className="font-medium text-foreground underline underline-offset-4">
              kayıt ol
            </Link>
            .
          </CardDescription>
        </CardHeader>
        <form action={formAction}>
          <CardContent className="space-y-4">
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
                autoComplete="current-password"
              />
            </div>
            {state?.error && (
              <p className="text-sm text-red-600 dark:text-red-400">{state.error}</p>
            )}
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Giriş yapılıyor..." : "Giriş yap"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
