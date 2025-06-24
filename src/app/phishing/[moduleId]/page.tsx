import { syncUser } from "@/actions/user.action";
import {
  getPhishingScenarios,
  getUserPhishingResults,
} from "@/actions/phishing.actions";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PhishingSimulator from "./PhishingSimulator";
import { notFound } from "next/navigation";
import { Badge } from "@/components/ui/badge";

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
  let userResults: { [key: string]: any } = {};

  if (user) {
    try {
      await syncUser();
      userResults = await getUserPhishingResults(user.id);
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const { moduleId } = params;
  const module = moduleData[moduleId as keyof typeof moduleData];

  if (!module) {
    notFound();
  }

  const previousResult = userResults[moduleId];

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

        {previousResult && (
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <div>
              <div className="font-medium">Poprzedni wynik:</div>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${
                    previousResult.percentage >= 80
                      ? "bg-green-500"
                      : previousResult.percentage >= 60
                      ? "bg-yellow-500"
                      : "bg-red-500"
                  } text-white`}
                >
                  {previousResult.percentage}%
                </Badge>
                <span className="text-sm text-muted-foreground">
                  ({previousResult.score}/{previousResult.total} scenariuszy)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <PhishingSimulator moduleId={moduleId} clerkId={user?.id} />
    </div>
  );
}
