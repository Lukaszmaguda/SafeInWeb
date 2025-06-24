import { syncUser } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PhishingSimulator from "./PhishingSimulator";
import { notFound } from "next/navigation";

const moduleData = {
  "email-phishing": {
    title: "Symulacja Phishingu Emailowego",
    description:
      "Przeanalizuj prawdziwe przykłady phishingowych emaili i naucz się je rozpoznawać",
  },
  "website-phishing": {
    title: "Symulacja Fałszywych Stron",
    description:
      "Sprawdź czy potrafisz rozpoznać podrobione strony internetowe",
  },
  "sms-phishing": {
    title: "Symulacja SMiShing",
    description: "Naucz się rozpoznawać oszustwa przez SMS",
  },
  "voice-phishing": {
    title: "Symulacja Vishing",
    description: "Trenuj rozpoznawanie oszustw telefonicznych",
  },
};

export default async function PhishingModulePage({
  params,
}: {
  params: { moduleId: string };
}) {
  const user = await currentUser();

  if (user) {
    try {
      await syncUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const { moduleId } = params;
  const module = moduleData[moduleId as keyof typeof moduleData];

  if (!module) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/phishing"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do centrum anty-phishing
        </Link>
      </div>

      <div className="flex flex-col items-center gap-6 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {module.title}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {module.description}
        </p>
      </div>

      <PhishingSimulator moduleId={moduleId} userId={user?.id} />
    </div>
  );
}
