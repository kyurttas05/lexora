import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getReviewQueue } from "./actions";
import StudySession from "./StudySession";

export default async function VocabPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const queue = await getReviewQueue();

  return (
    <div className="flex flex-1 flex-col bg-zinc-50 dark:bg-zinc-950">
      <StudySession initialQueue={queue} />
    </div>
  );
}
