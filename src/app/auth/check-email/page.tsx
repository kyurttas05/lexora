import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function CheckEmailPage() {
  return (
    <div className="flex flex-1 items-center justify-center px-4 py-12">
      <div className="glass w-full max-w-md rounded-3xl p-8 text-center">
        <div className="mb-6 text-6xl">📬</div>
        <h1 className="aurora-text mb-3 text-3xl font-bold">Email&apos;ini kontrol et</h1>
        <p className="mb-2 text-muted-foreground">
          Onay linki içeren bir email gönderdik.
        </p>
        <p className="mb-8 text-sm text-muted-foreground/70">
          Spam klasörünü de kontrol etmeyi unutma.
        </p>
        <Link href="/login">
          <Button variant="outline" className="glass">
            Giriş sayfasına dön
          </Button>
        </Link>
      </div>
    </div>
  );
}
