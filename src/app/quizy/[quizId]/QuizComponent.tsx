"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { saveQuizResultByClerkId } from "@/actions/quiz.actions";

interface QuizComponentProps {
  quiz: {
    id: string;
    title: string;
    description: string;
    questions: Array<{
      id: string;
      text: string;
      options: Array<{
        id: string;
        text: string;
      }>;
      correctOptionId: string;
    }>;
  };
  clerkId?: string;
}

export default function QuizComponent({ quiz, clerkId }: QuizComponentProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [isQuizCompleted, setIsQuizCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<any>(null);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = async () => {
    if (!selectedOption) return;

    const newAnswers = {
      ...userAnswers,
      [currentQuestion.id]: selectedOption,
    };
    setUserAnswers(newAnswers);

    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption("");
    } else {
      setIsQuizCompleted(true);

      if (clerkId) {
        try {
          const answers = Object.entries(newAnswers).map(
            ([questionId, selectedOptionId]) => ({
              questionId,
              selectedOptionId,
            })
          );

          const result = await saveQuizResultByClerkId(
            clerkId,
            quiz.id,
            answers
          );
          setQuizResult(result);
        } catch (error) {
          console.error("Failed to save quiz result:", error);
        }
      } else {
        let correctCount = 0;
        Object.entries(newAnswers).forEach(([questionId, selectedOptionId]) => {
          const question = quiz.questions.find((q) => q.id === questionId);
          if (question && selectedOptionId === question.correctOptionId) {
            correctCount++;
          }
        });

        setQuizResult({
          score: correctCount,
          total: quiz.questions.length,
          percentage: Math.round((correctCount / quiz.questions.length) * 100),
        });
      }
    }
  };

  if (isQuizCompleted) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="text-center">Quiz ukończony!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {quizResult && (
              <>
                <div className="text-4xl font-bold text-primary">
                  {quizResult.score}/{quizResult.total}
                </div>
                <div className="text-xl">Wynik: {quizResult.percentage}%</div>
                <Progress value={quizResult.percentage} className="w-full" />
              </>
            )}
            <div className="flex gap-4 justify-center mt-6">
              <Button onClick={() => window.location.reload()}>
                Spróbuj ponownie
              </Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/quizy")}
              >
                Powrót do quizów
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-muted-foreground">
            Pytanie {currentQuestionIndex + 1} z {quiz.questions.length}
          </span>
          <span className="text-sm text-muted-foreground">
            {Math.round(progress)}%
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{currentQuestion.text}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentQuestion.options.map((option) => (
            <Button
              key={option.id}
              variant={selectedOption === option.id ? "default" : "outline"}
              className="w-full text-left justify-start h-auto p-4"
              onClick={() => handleOptionSelect(option.id)}
            >
              {option.text}
            </Button>
          ))}

          <div className="pt-4">
            <Button
              onClick={handleNextQuestion}
              disabled={!selectedOption}
              className="w-full"
            >
              {currentQuestionIndex < quiz.questions.length - 1
                ? "Następne pytanie"
                : "Zakończ quiz"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
