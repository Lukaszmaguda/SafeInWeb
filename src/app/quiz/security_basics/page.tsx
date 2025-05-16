import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { currentUser } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import QuizComponent from "@/app/quiz/security_basics/QuizComponent";
import { notFound } from "next/navigation";

// Przykładowe dane quizu - w przyszłości będą pobierane z bazy danych
const quizy = {
	podstawy: {
		id: "podstawy",
		title: "Podstawy bezpieczeństwa w sieci",
		description:
			"Poznaj podstawowe zasady bezpiecznego korzystania z internetu.",
		questions: [
			{
				id: "q1",
				text: "Co to jest silne hasło?",
				options: [
					{
						id: "q1-a",
						text: "Hasło zawierające imię i datę urodzenia",
					},
					{
						id: "q1-b",
						text: "Hasło składające się z minimum 8 znaków, zawierające duże i małe litery, cyfry oraz znaki specjalne",
					},
					{
						id: "q1-c",
						text: "Hasło, które jest łatwe do zapamiętania, np. '123456'",
					},
					{
						id: "q1-d",
						text: "Hasło, które jest takie samo dla wszystkich kont",
					},
				],
				correctOptionId: "q1-b",
			},
			{
				id: "q2",
				text: "Czym jest phishing?",
				options: [
					{ id: "q2-a", text: "Rodzaj wirusa komputerowego" },
					{ id: "q2-b", text: "Metoda łowienia ryb przez internet" },
					{
						id: "q2-c",
						text: "Technika oszustwa polegająca na podszywaniu się pod zaufane instytucje w celu wyłudzenia danych",
					},
					{
						id: "q2-d",
						text: "Sposób na szybkie pobieranie plików z internetu",
					},
				],
				correctOptionId: "q2-c",
			},
			{
				id: "q3",
				text: "Które z poniższych działań zwiększa bezpieczeństwo konta online?",
				options: [
					{
						id: "q3-a",
						text: "Używanie tego samego hasła do wszystkich kont",
					},
					{
						id: "q3-b",
						text: "Zapisywanie haseł na kartce przyklejonej do monitora",
					},
					{
						id: "q3-c",
						text: "Udostępnianie swoich danych logowania zaufanym znajomym",
					},
					{
						id: "q3-d",
						text: "Włączenie weryfikacji dwuetapowej (2FA)",
					},
				],
				correctOptionId: "q3-d",
			},
			{
				id: "q4",
				text: "Co to jest złośliwe oprogramowanie (malware)?",
				options: [
					{ id: "q4-a", text: "Program antywirusowy" },
					{
						id: "q4-b",
						text: "Oprogramowanie, które ma na celu uszkodzenie lub uzyskanie nieautoryzowanego dostępu do systemu",
					},
					{
						id: "q4-c",
						text: "Program do tworzenia kopii zapasowych",
					},
					{
						id: "q4-d",
						text: "Oprogramowanie do optymalizacji działania komputera",
					},
				],
				correctOptionId: "q4-b",
			},
			{
				id: "q5",
				text: "Jak rozpoznać bezpieczną stronę internetową?",
				options: [
					{
						id: "q5-a",
						text: "Ma dużo reklam i wyskakujących okienek",
					},
					{ id: "q5-b", text: "Adres URL zaczyna się od 'http://'" },
					{
						id: "q5-c",
						text: "Adres URL zaczyna się od 'https://' i ma symbol kłódki",
					},
					{ id: "q5-d", text: "Ma bardzo kolorowy interfejs" },
				],
				correctOptionId: "q5-c",
			},
			{
				id: "q6",
				text: "Co to jest VPN?",
				options: [
					{ id: "q6-a", text: "Wirus komputerowy" },
					{
						id: "q6-b",
						text: "Wirtualna sieć prywatna, która szyfruje połączenie internetowe",
					},
					{ id: "q6-c", text: "Program do edycji zdjęć" },
					{ id: "q6-d", text: "Rodzaj przeglądarki internetowej" },
				],
				correctOptionId: "q6-b",
			},
			{
				id: "q7",
				text: "Które z poniższych jest dobrą praktyką dotyczącą aktualizacji oprogramowania?",
				options: [
					{
						id: "q7-a",
						text: "Nigdy nie aktualizować, bo aktualizacje spowalniają komputer",
					},
					{
						id: "q7-b",
						text: "Aktualizować tylko gry i aplikacje rozrywkowe",
					},
					{
						id: "q7-c",
						text: "Regularnie aktualizować system operacyjny i wszystkie programy",
					},
					{ id: "q7-d", text: "Aktualizować tylko raz w roku" },
				],
				correctOptionId: "q7-c",
			},
			{
				id: "q8",
				text: "Co to jest atak socjotechniczny?",
				options: [
					{
						id: "q8-a",
						text: "Atak wykorzystujący słabości techniczne systemu",
					},
					{
						id: "q8-b",
						text: "Atak polegający na manipulacji psychologicznej, mający na celu nakłonienie ofiary do określonego działania",
					},
					{ id: "q8-c", text: "Atak na serwery społecznościowe" },
					{ id: "q8-d", text: "Rodzaj wirusa komputerowego" },
				],
				correctOptionId: "q8-b",
			},
			{
				id: "q9",
				text: "Co należy zrobić, gdy podejrzewamy, że nasze konto zostało zhakowane?",
				options: [
					{ id: "q9-a", text: "Nic, problem sam się rozwiąże" },
					{
						id: "q9-b",
						text: "Natychmiast zmienić hasło i włączyć weryfikację dwuetapową",
					},
					{
						id: "q9-c",
						text: "Usunąć konto i założyć nowe z tym samym hasłem",
					},
					{
						id: "q9-d",
						text: "Poczekać kilka dni i sprawdzić, czy problem nadal występuje",
					},
				],
				correctOptionId: "q9-b",
			},
			{
				id: "q10",
				text: "Które z poniższych zachowań jest najbezpieczniejsze podczas korzystania z publicznej sieci Wi-Fi?",
				options: [
					{
						id: "q10-a",
						text: "Logowanie się do banku i przeprowadzanie transakcji finansowych",
					},
					{
						id: "q10-b",
						text: "Udostępnianie swoich danych osobowych",
					},
					{
						id: "q10-c",
						text: "Korzystanie z VPN do szyfrowania połączenia",
					},
					{
						id: "q10-d",
						text: "Wyłączenie zapory sieciowej dla szybszego połączenia",
					},
				],
				correctOptionId: "q10-c",
			},
		],
	},
	// Tutaj można dodać więcej quizów
};

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
	const quiz = quizy[quizId as keyof typeof quizy];

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

			<QuizComponent quiz={quiz} userId={user?.id} />
		</div>
	);
}
