import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OnboardingWizard from "./OnboardingWizard";

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("user_profiles")
    .select("display_name, onboarding_completed")
    .eq("id", user.id)
    .single();

  // Zaten tamamlamissa dashboard'a yonlendir
  if (profile?.onboarding_completed) redirect("/dashboard");

  return <OnboardingWizard displayName={profile?.display_name ?? null} />;
}
