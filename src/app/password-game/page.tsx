import { syncUser } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PasswordGame from "./PasswordGame";

export default async function PasswordGamePage() {
  const user = await currentUser();

  if (user) {
    try {
      await syncUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Tworzenie Silnych Haseł
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Naucz się tworzyć bezpieczne hasła w zabawny sposób! Obserwuj jak
          zmienia się nastrój naszego strażnika w zależności od siły Twojego
          hasła.
        </p>
      </div>

      <PasswordGame userId={user?.id} />
    </div>
  );
}
