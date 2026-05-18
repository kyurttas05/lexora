"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type OnboardingData = {
  level: "A2" | "B1" | "B2" | "C1" | "C2";
  target_exam: "CAE" | "FCE" | "IELTS" | "TOEFL" | "general";
  daily_goal: number; // kelime sayisi
};

export async function saveOnboarding(data: OnboardingData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Oturum yok");

  await supabase
    .from("user_profiles")
    .update({
      level: data.level,
      target_exam: data.target_exam,
      daily_goal: data.daily_goal,
      onboarding_completed: true,
    })
    .eq("id", user.id);

  revalidatePath("/dashboard");
  redirect("/dashboard");
}
