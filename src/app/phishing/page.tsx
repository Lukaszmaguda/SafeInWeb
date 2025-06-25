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
  Brain,
  Clock,
  Award,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import {
  Key,
  ReactElement,
  JSXElementConstructor,
  ReactNode,
  ReactPortal,
  AwaitedReactNode,
} from "react";

export default async function PhishingPage() {
  const user = await currentUser();
  type UserResult = {
    percentage: number;
    score: number;
    total: number;
    completedAt: string;
    // add other fields if needed
  };

  let userResults: Record<string, UserResult> = {};

  if (user) {
    try {
      await syncUser();
      userResults = await getUserPhishingResults(user.id);
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const modules = await getPhishingModules();

  const moduleIcons = {
    "email-phishing": <Mail className="h-4 w-4" />,
    "website-phishing": <Shield className="h-4 w-4" />,
    "sms-phishing": <MessageSquare className="h-4 w-4" />,
    "voice-phishing": <Phone className="h-4 w-4" />,
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return "bg-green-500";
    if (percentage >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreText = (percentage: number) => {
    if (percentage >= 80) return "Świetnie!";
    if (percentage >= 60) return "Dobrze";
    return "Spróbuj ponownie";
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Centrum Anty-Phishing
        </h1>
        <p className="max-w-[800px] text-lg text-muted-foreground">
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {modules.map(
          (module: {
            id: Key | null | undefined;
            title:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined;
            description:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined;
            difficulty:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | ReactPortal
              | Promise<AwaitedReactNode>
              | null
              | undefined;
            scenarios:
              | string
              | number
              | bigint
              | boolean
              | ReactElement<any, string | JSXElementConstructor<any>>
              | Iterable<ReactNode>
              | Promise<AwaitedReactNode>
              | null
              | undefined;
          }) => {
            const result = userResults[String(module.id)];
            const isCompleted = !!result;

            return (
              <Card
                key={module.id}
                className={`flex flex-col h-full hover:shadow-lg transition-shadow relative ${
                  isCompleted ? "border-green-200 bg-green-50/30" : ""
                }`}
              >
                {/* Znaczek ukończenia */}
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
                  <CardTitle className="flex items-center gap-2">
                    {module.title}
                    {isCompleted && result.percentage === 100 && (
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    )}
                  </CardTitle>
                  <CardDescription>{module.description}</CardDescription>

                  {/* Informacja o wyniku */}
                  {isCompleted && (
                    <div className="mt-2 p-2 bg-white rounded-lg border">
                      <div className="text-sm font-medium text-green-700">
                        Ukończono: {result.score}/{result.total} scenariuszy
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {getScoreText(result.percentage)} •{" "}
                        {new Date(result.completedAt).toLocaleDateString(
                          "pl-PL"
                        )}
                      </div>
                    </div>
                  )}
                </CardHeader>

                <CardContent className="flex-grow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                    <Award className="h-4 w-4" />
                    <span>Poziom: {module.difficulty}</span>
                  </div>
                </CardContent>

                <CardFooter>
                  <Link href={`/phishing/${module.id}`} className="w-full">
                    <Button
                      className="w-full"
                      variant={isCompleted ? "outline" : "default"}
                    >
                      {isCompleted ? "Spróbuj ponownie" : "Rozpocznij trening"}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            );
          }
        )}
      </div>

      {/* Statystyki użytkownika */}
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

      {/* Sekcja edukacyjna */}
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
