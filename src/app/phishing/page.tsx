import { syncUser } from "@/actions/user.action";
import {
  getPhishingModules,
  getUserPhishingResults,
} from "@/actions/phishing.actions";
import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Shield,
  Mail,
  Phone,
  MessageSquare,
  CheckCircle,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

type PhishingResult = {
  percentage: number;
  score: number;
  total: number;
  completedAt: string;
};

type UserResults = {
  [moduleId: string]: PhishingResult;
};

export default async function PhishingPage() {
  const user = await currentUser();
  let userResults: UserResults = {};

  if (user) {
    try {
      await syncUser();
      userResults = (await getUserPhishingResults(user.id)) as UserResults;
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  type ModuleId =
    | "email-phishing"
    | "website-phishing"
    | "sms-phishing"
    | "voice-phishing";

  type Module = {
    id: ModuleId;
    title: string;
    description: string;
    difficulty: string;
    scenarios: number;
  };

  const modules: Module[] = await getPhishingModules();

  const moduleIcons: Record<ModuleId, JSX.Element> = {
    "email-phishing": <Mail className="h-8 w-8" />,
    "website-phishing": <Shield className="h-8 w-8" />,
    "sms-phishing": <MessageSquare className="h-8 w-8" />,
    "voice-phishing": <Phone className="h-8 w-8" />,
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Centrum Anty-Phishing
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Naucz się rozpoznawać i unikać ataków phishingowych przez praktyczne
          symulacje. Każdy moduł zawiera realistyczne scenariusze z
          natychmiastowym feedbackiem.
        </p>

        <SignedOut>
          <div className="mt-4 p-6 bg-muted rounded-lg">
            <p className="mb-4 font-medium">
              Zaloguj się, aby zapisywać swoje wyniki i śledzić postępy.
            </p>
            <SignInButton mode="modal">
              <Button>Zaloguj się</Button>
            </SignInButton>
          </div>
        </SignedOut>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {modules.map((module) => {
          const result = userResults[module.id];
          const isCompleted = !!result;

          return (
            <Card
              key={module.id}
              className={`hover:shadow-lg transition-shadow relative ${
                isCompleted ? "border-green-200 bg-green-50/30" : ""
              }`}
            >
              {isCompleted && (
                <div className="absolute top-4 right-4 z-10">
                  <div className="flex items-center gap-2">
                    <Badge
                      className={`${getScoreColor(
                        result.percentage
                      )} text-white`}
                    >
                      {result.percentage}%
                    </Badge>
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                </div>
              )}

              <CardHeader className={isCompleted ? "pr-20" : ""}>
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg text-primary">
                    {moduleIcons[module.id]}
                  </div>
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      {module.title}
                      {isCompleted && result.percentage === 100 && (
                        <Trophy className="h-5 w-5 text-yellow-500" />
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {module.description}
                    </CardDescription>
                  </div>
                </div>

                {isCompleted && (
                  <div className="mt-4 p-2 bg-white rounded-lg border">
                    <div className="text-sm font-medium text-green-700">
                      Ukończono: {result.score}/{result.total} scenariuszy
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {new Date(result.completedAt).toLocaleDateString("pl-PL")}
                    </div>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm text-muted-foreground">
                    Poziom: {module.difficulty}
                  </span>
                </div>
                <Link href={`/phishing/${module.id}`}>
                  <Button
                    className="w-full"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Spróbuj ponownie" : "Rozpocznij trening"}
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <SignedIn>
        {Object.keys(userResults).length > 0 && (
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold mb-4">
              Twoje statystyki anty-phishing
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Object.keys(userResults).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ukończone moduły
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Math.round(
                    Object.values(userResults).reduce(
                      (sum, result) => sum + result.percentage,
                      0
                    ) / Object.values(userResults).length
                  )}
                  %
                </div>
                <div className="text-sm text-muted-foreground">
                  Średni wynik
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {
                    Object.values(userResults).filter(
                      (result) => result.percentage === 100
                    ).length
                  }
                </div>
                <div className="text-sm text-muted-foreground">
                  Perfekcyjne wyniki
                </div>
              </div>
            </div>
          </div>
        )}
      </SignedIn>

      <Card className="mt-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Co to jest phishing?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Phishing to technika oszustwa, w której cyberprzestępcy podszywają
            się pod zaufane organizacje, aby wyłudzić poufne informacje jak
            hasła, numery kart kredytowych czy dane osobowe.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-red-600 mb-2">
                ⚠️ Czerwone flagi:
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Pilne prośby o dane osobowe</li>
                <li>• Błędy językowe i literówki</li>
                <li>• Podejrzane adresy nadawców</li>
                <li>• Linki prowadzące do innych domen</li>
                <li>• Groźby zablokowania konta</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-green-600 mb-2">
                ✅ Jak się chronić:
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Sprawdzaj adresy nadawców</li>
                <li>• Nie klikaj podejrzanych linków</li>
                <li>• Weryfikuj przez oficjalne kanały</li>
                <li>• Używaj uwierzytelniania dwuskładnikowego</li>
                <li>• Aktualizuj oprogramowanie</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
