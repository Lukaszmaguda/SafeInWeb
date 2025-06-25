import { syncUser } from "@/actions/user.action";
import { getQuizzes, getUserQuizResults } from "@/actions/quiz.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import {
  Brain,
  Clock,
  Award,
  ArrowRight,
  CheckCircle,
  Trophy,
} from "lucide-react";
import Link from "next/link";

export default async function QuizyPage() {
  const user = await currentUser();
  type UserQuizResult = {
    score: number;
    total: number;
    percentage: number;
    completedAt: string;
  };

  let userResults: Record<string, UserQuizResult> = {};

  if (user) {
    try {
      await syncUser();
      userResults = await getUserQuizResults(user.id);
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const quizy = await getQuizzes();

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
          Quizy o bezpieczeństwie w sieci
        </h1>
        <p className="max-w-[800px] text-lg text-muted-foreground">
          Sprawdź swoją wiedzę i naucz się nowych rzeczy poprzez interaktywne
          quizy. Każdy quiz zawiera pytania z różnych obszarów bezpieczeństwa w
          internecie.
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
        {quizy.map((quiz) => {
          const result = userResults[quiz.id];
          const isCompleted = !!result;

          return (
            <Card
              key={quiz.id}
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
                  {quiz.title}
                  {isCompleted && result.percentage === 100 && (
                    <Trophy className="h-5 w-5 text-yellow-500" />
                  )}
                </CardTitle>
                <CardDescription>{quiz.description}</CardDescription>

                {/* Informacja o wyniku */}
                {isCompleted && (
                  <div className="mt-2 p-2 bg-white rounded-lg border">
                    <div className="text-sm font-medium text-green-700">
                      Ukończono: {result.score}/{result.total} punktów
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getScoreText(result.percentage)} •{" "}
                      {new Date(result.completedAt).toLocaleDateString("pl-PL")}
                    </div>
                  </div>
                )}
              </CardHeader>

              <CardContent className="flex-grow">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                  <Award className="h-4 w-4" />
                  <span>Poziom: {quiz.difficulty}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Brain className="h-4 w-4" />
                  <span>Pytań: {quiz.questionsCount}</span>
                </div>
              </CardContent>

              <CardFooter>
                <Link href={`/quizy/${quiz.id}`} className="w-full">
                  <Button
                    className="w-full"
                    variant={isCompleted ? "outline" : "default"}
                  >
                    {isCompleted ? "Spróbuj ponownie" : "Rozpocznij quiz"}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {/* Statystyki użytkownika */}
      <SignedIn>
        {Object.keys(userResults).length > 0 && (
          <div className="mt-12 p-6 bg-muted rounded-lg">
            <h2 className="text-2xl font-bold mb-4">Twoje statystyki</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  {Object.keys(userResults).length}
                </div>
                <div className="text-sm text-muted-foreground">
                  Ukończone quizy
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
    </div>
  );
}
