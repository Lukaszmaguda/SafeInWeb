import { syncUser } from "@/actions/user.action";
import { getQuizBySlug, getUserQuizResults } from "@/actions/quiz.actions";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft, Trophy, RotateCcw } from "lucide-react";
import Link from "next/link";
import QuizComponent from "./QuizComponent";
import { notFound } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const user = await currentUser();
  type QuizResult = {
    percentage: number;
    score: number;
    total: number;
    // add other fields if needed
  };
  let userResults: { [key: string]: QuizResult } = {};

  if (user) {
    try {
      await syncUser();
      userResults = await getUserQuizResults(user.id);
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const { quizId } = params;
  const quiz = await getQuizBySlug(quizId);

  if (!quiz) {
    notFound();
  }

  const previousResult = userResults[quizId];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/quizy"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do listy quizów
        </Link>
      </div>

      <div className="flex flex-col items-center gap-6 text-center mb-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          {quiz.title}
          {previousResult?.percentage === 100 && (
            <Trophy className="inline-block ml-2 h-8 w-8 text-yellow-500" />
          )}
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {quiz.description}
        </p>

        {/* Poprzedni wynik */}
        {previousResult && (
          <div className="flex items-center gap-4 p-4 bg-muted rounded-lg">
            <RotateCcw className="h-5 w-5 text-muted-foreground" />
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
                  ({previousResult.score}/{previousResult.total} punktów)
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      <QuizComponent
        quiz={{
          ...quiz,
          questions: quiz.questions.map((q: any) => ({
            ...q,
            correctOptionId: q.correctOptionId ?? "",
          })),
        }}
        clerkId={user?.id}
      />
    </div>
  );
}
