import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function CheckEmailPage() {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-12 dark:bg-zinc-950">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <CardTitle className="text-2xl">Email&apos;ini kontrol et</CardTitle>
          <CardDescription>
            Onay linkini içeren bir email gönderdik. Linke tıklayınca hesabın aktifleşir.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Spam klasörünü de kontrol etmeyi unutma.
          </p>
        </CardContent>
        <CardFooter className="justify-center">
          <Link href="/login">
            <Button variant="outline">Giriş sayfasına dön</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
