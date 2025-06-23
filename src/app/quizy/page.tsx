import { syncUser } from "@/actions/user.action";
import { getQuizzes } from "@/actions/quiz.actions";
import { Button } from "@/components/ui/button";
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
import { Brain, Clock, Award, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function QuizyPage() {
  const user = await currentUser();
  if (user) {
    try {
      await syncUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const quizy = await getQuizzes();

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
        {quizy.map((quiz) => (
          <Card
            key={quiz.id}
            className="flex flex-col h-full hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <CardTitle>{quiz.title}</CardTitle>
              <CardDescription>{quiz.description}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Award className="h-4 w-4" />
                <span>Poziom: {quiz.difficulty}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span>Czas: {quiz.time}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Brain className="h-4 w-4" />
                <span>Pytań: {quiz.questionsCount}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Link href={`/quizy/${quiz.id}`} className="w-full">
                <Button className="w-full">
                  Rozpocznij quiz
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
