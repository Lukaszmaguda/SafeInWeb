"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import {
	CheckCircle2,
	XCircle,
	AlertCircle,
	ArrowRight,
	RotateCcw,
} from "lucide-react";
import { SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Option = {
	id: string;
	text: string;
};

type Question = {
	id: string;
	text: string;
	options: Option[];
	correctOptionId: string;
};

type Quiz = {
	id: string;
	title: string;
	description: string;
	questions: Question[];
};

type QuizComponentProps = {
	quiz: Quiz;
	userId?: string;
};

export default function QuizComponent({ quiz, userId }: QuizComponentProps) {
	const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
	const [selectedOptionId, setSelectedOptionId] = useState<string | null>(
		null
	);
	const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
	const [correctAnswers, setCorrectAnswers] = useState(0);
	const [isQuizCompleted, setIsQuizCompleted] = useState(false);
	const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});

	const currentQuestion = quiz.questions[currentQuestionIndex];
	const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

	const handleOptionSelect = (optionId: string) => {
		if (!isAnswerSubmitted) {
			setSelectedOptionId(optionId);
		}
	};

	const handleSubmitAnswer = () => {
		if (!selectedOptionId) return;

		setIsAnswerSubmitted(true);
		const isCorrect = selectedOptionId === currentQuestion.correctOptionId;

		if (isCorrect) {
			setCorrectAnswers((prev) => prev + 1);
		}

		// Zapisz odpowiedź użytkownika
		setUserAnswers((prev) => ({
			...prev,
			[currentQuestion.id]: selectedOptionId,
		}));
	};

	const handleNextQuestion = () => {
		if (currentQuestionIndex < quiz.questions.length - 1) {
			setCurrentQuestionIndex((prev) => prev + 1);
			setSelectedOptionId(null);
			setIsAnswerSubmitted(false);
		} else {
			setIsQuizCompleted(true);
			// Tutaj można dodać kod do zapisania wyniku w bazie danych
		}
	};

	const handleRestartQuiz = () => {
		setCurrentQuestionIndex(0);
		setSelectedOptionId(null);
		setIsAnswerSubmitted(false);
		setCorrectAnswers(0);
		setIsQuizCompleted(false);
		setUserAnswers({});
	};

	const getScoreMessage = () => {
		const scorePercentage = (correctAnswers / quiz.questions.length) * 100;
		if (scorePercentage >= 90) return "Świetny wynik! Jesteś ekspertem!";
		if (scorePercentage >= 70) return "Dobry wynik! Masz solidną wiedzę.";
		if (scorePercentage >= 50)
			return "Niezły wynik! Ale jest jeszcze miejsce na poprawę.";
		return "Warto powtórzyć materiał i spróbować ponownie.";
	};

	if (isQuizCompleted) {
		return (
			<Card className="w-full max-w-3xl mx-auto">
				<CardHeader className="text-center">
					<CardTitle className="text-2xl">Quiz ukończony!</CardTitle>
					<CardDescription>
						Twój wynik: {correctAnswers} z {quiz.questions.length} (
						{Math.round(
							(correctAnswers / quiz.questions.length) * 100
						)}
						%)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex justify-center mb-6">
						{correctAnswers === quiz.questions.length ? (
							<div className="bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 p-4 rounded-lg flex items-center">
								<CheckCircle2 className="h-6 w-6 mr-2" />
								<span>
									Wszystkie odpowiedzi poprawne! Gratulacje!
								</span>
							</div>
						) : correctAnswers >= quiz.questions.length / 2 ? (
							<div className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 p-4 rounded-lg flex items-center">
								<AlertCircle className="h-6 w-6 mr-2" />
								<span>{getScoreMessage()}</span>
							</div>
						) : (
							<div className="bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 p-4 rounded-lg flex items-center">
								<XCircle className="h-6 w-6 mr-2" />
								<span>{getScoreMessage()}</span>
							</div>
						)}
					</div>

					<h3 className="text-xl font-bold mb-4">
						Podsumowanie odpowiedzi:
					</h3>
					<div className="space-y-4">
						{quiz.questions.map((question, index) => {
							const userAnswer = userAnswers[question.id];
							const isCorrect =
								userAnswer === question.correctOptionId;
							const correctOption = question.options.find(
								(opt) => opt.id === question.correctOptionId
							);

							return (
								<div
									key={question.id}
									className="border rounded-lg p-4"
								>
									<div className="flex items-start gap-2">
										<div className="mt-1">
											{isCorrect ? (
												<CheckCircle2 className="h-5 w-5 text-green-500" />
											) : (
												<XCircle className="h-5 w-5 text-red-500" />
											)}
										</div>
										<div>
											<p className="font-medium">
												{index + 1}. {question.text}
											</p>
											{!isCorrect && (
												<div className="mt-2">
													<p className="text-sm text-muted-foreground">
														Twoja odpowiedź:{" "}
														{
															question.options.find(
																(opt) =>
																	opt.id ===
																	userAnswer
															)?.text
														}
													</p>
													<p className="text-sm text-green-600 dark:text-green-400">
														Poprawna odpowiedź:{" "}
														{correctOption?.text}
													</p>
												</div>
											)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
				</CardContent>
				<CardFooter className="flex justify-between">
					<Button
						onClick={handleRestartQuiz}
						variant="outline"
						className="flex items-center"
					>
						<RotateCcw className="mr-2 h-4 w-4" />
						Rozpocznij ponownie
					</Button>
					<Link href="/quizy">
						<Button>Wróć do listy quizów</Button>
					</Link>
				</CardFooter>
			</Card>
		);
	}

	return (
		<Card className="w-full max-w-3xl mx-auto">
			<CardHeader>
				<div className="flex justify-between items-center mb-2">
					<span className="text-sm text-muted-foreground">
						Pytanie {currentQuestionIndex + 1} z{" "}
						{quiz.questions.length}
					</span>
					<span className="text-sm font-medium">
						Poprawne odpowiedzi: {correctAnswers}
					</span>
				</div>
				<Progress value={progress} className="h-2" />
				<CardTitle className="mt-4 text-xl">
					{currentQuestion.text}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<RadioGroup
					value={selectedOptionId || ""}
					className="space-y-3"
				>
					{currentQuestion.options.map((option) => {
						const isCorrect =
							isAnswerSubmitted &&
							option.id === currentQuestion.correctOptionId;
						const isIncorrect =
							isAnswerSubmitted &&
							selectedOptionId === option.id &&
							option.id !== currentQuestion.correctOptionId;

						return (
							<div
								key={option.id}
								className={cn(
									"flex items-center space-x-2 rounded-md border p-4 cursor-pointer transition-colors",
									selectedOptionId === option.id &&
										!isAnswerSubmitted &&
										"border-primary",
									isCorrect &&
										"bg-green-100 border-green-500 dark:bg-green-900/20",
									isIncorrect &&
										"bg-red-100 border-red-500 dark:bg-red-900/20"
								)}
								onClick={() => handleOptionSelect(option.id)}
							>
								<RadioGroupItem
									value={option.id}
									id={option.id}
									disabled={isAnswerSubmitted}
									className="sr-only"
								/>
								<Label
									htmlFor={option.id}
									className={cn(
										"flex-grow cursor-pointer font-normal",
										isCorrect &&
											"text-green-700 dark:text-green-300",
										isIncorrect &&
											"text-red-700 dark:text-red-300"
									)}
								>
									{option.text}
								</Label>
								{isCorrect && (
									<CheckCircle2 className="h-5 w-5 text-green-500" />
								)}
								{isIncorrect && (
									<XCircle className="h-5 w-5 text-red-500" />
								)}
							</div>
						);
					})}
				</RadioGroup>
			</CardContent>
			<CardFooter className="flex justify-between">
				{!isAnswerSubmitted ? (
					<Button
						onClick={handleSubmitAnswer}
						disabled={!selectedOptionId}
						className="w-full"
					>
						Sprawdź odpowiedź
					</Button>
				) : (
					<Button onClick={handleNextQuestion} className="w-full">
						{currentQuestionIndex < quiz.questions.length - 1 ? (
							<>
								Następne pytanie
								<ArrowRight className="ml-2 h-4 w-4" />
							</>
						) : (
							"Zakończ quiz"
						)}
					</Button>
				)}
			</CardFooter>
		</Card>
	);
}
