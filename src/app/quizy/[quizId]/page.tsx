import { syncUser } from "@/actions/user.action";
import { getQuizBySlug } from "@/actions/quiz.actions";
import { Button } from "@/components/ui/button";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuizComponent from "./QuizComponent";
import { notFound } from "next/navigation";

export default async function QuizPage({
  params,
}: {
  params: { quizId: string };
}) {
  const user = await currentUser();

  if (user) {
    try {
      await syncUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const { quizId } = params;
  const quiz = await getQuizBySlug(quizId);

  if (!quiz) {
    notFound();
  }

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
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          {quiz.description}
        </p>
      </div>

      <QuizComponent quiz={quiz} clerkId={user?.id} />
    </div>
  );
}
