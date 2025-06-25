import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from "@/components/ui/accordion";
import { currentUser } from "@clerk/nextjs/server";
import {
	BookOpen,
	FileText,
	GraduationCap,
	Library,
	Users,
} from "lucide-react";

export default async function OProjekciePage() {
	const user = await currentUser();
	if (user) {
		try {
			await syncUser();
		} catch (error) {
			console.error("Failed to sync user:", error);
		}
	}

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="flex flex-col items-center gap-6 text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
					O projekcie Safe in Web
				</h1>
				<p className="max-w-[800px] text-lg text-muted-foreground">
					Aplikacja edukacyjna o bezpieczeństwie w sieci stworzona
					jako projekt licencjacki
				</p>
			</div>

			<div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
				<div>
					<h2 className="text-3xl font-bold mb-6">Cel projektu</h2>
					<p className="text-lg mb-4">
						Projekt "Safe in Web" powstał jako część pracy
						licencjackiej, której celem jest stworzenie efektywnego
						narzędzia edukacyjnego zwiększającego świadomość
						użytkowników w zakresie bezpieczeństwa w internecie.
					</p>
					<p className="text-lg mb-4">
						Aplikacja ma za zadanie przekazywać wiedzę w przystępny
						i interaktywny sposób, wykorzystując nowoczesne
						technologie webowe oraz metody gamifikacji w postaci
						quizów i interaktywnych materiałów.
					</p>
					<p className="text-lg">
						Głównym założeniem projektu jest nie tylko dostarczenie
						informacji o zagrożeniach, ale również kształtowanie
						praktycznych umiejętności rozpoznawania i reagowania na
						niebezpieczne sytuacje w sieci.
					</p>
				</div>
				<div>
					<h2 className="text-3xl font-bold mb-6">
						Założenia badawcze
					</h2>
					<div className="space-y-4">
						<div className="flex items-start gap-3">
							<div className="mt-1 bg-primary/10 p-2 rounded-full">
								<GraduationCap className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">
									Analiza efektywności edukacyjnej
								</h3>
								<p>
									Badanie skuteczności interaktywnych metod
									nauczania w kontekście edukacji o
									cyberbezpieczeństwie
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="mt-1 bg-primary/10 p-2 rounded-full">
								<Users className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">
									Dostępność wiedzy
								</h3>
								<p>
									Badanie dostępności i przystępności wiedzy o
									bezpieczeństwie w sieci dla różnych grup
									odbiorców
								</p>
							</div>
						</div>
						<div className="flex items-start gap-3">
							<div className="mt-1 bg-primary/10 p-2 rounded-full">
								<FileText className="h-5 w-5 text-primary" />
							</div>
							<div>
								<h3 className="font-semibold text-lg">
									Praktyczne zastosowanie
								</h3>
								<p>
									Analiza możliwości praktycznego zastosowania
									zdobytej wiedzy w codziennym korzystaniu z
									internetu
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>

			<div className="mb-16">
				<h2 className="text-3xl font-bold mb-6 text-center">
					Metodologia
				</h2>
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					<Card>
						<CardContent className="pt-6">
							<div className="flex justify-center mb-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<BookOpen className="h-6 w-6 text-primary" />
								</div>
							</div>
							<h3 className="text-xl font-bold mb-3 text-center">
								Analiza literatury
							</h3>
							<p>
								Projekt opiera się na analizie aktualnej
								literatury naukowej z zakresu
								cyberbezpieczeństwa, edukacji online oraz
								psychologii poznawczej.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex justify-center mb-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<Users className="h-6 w-6 text-primary" />
								</div>
							</div>
							<h3 className="text-xl font-bold mb-3 text-center">
								Badania użytkowników
							</h3>
							<p>
								W ramach projektu przeprowadzono badania potrzeb
								i preferencji potencjalnych użytkowników
								aplikacji edukacyjnej o bezpieczeństwie.
							</p>
						</CardContent>
					</Card>
					<Card>
						<CardContent className="pt-6">
							<div className="flex justify-center mb-4">
								<div className="bg-primary/10 p-3 rounded-full">
									<FileText className="h-6 w-6 text-primary" />
								</div>
							</div>
							<h3 className="text-xl font-bold mb-3 text-center">
								Implementacja
							</h3>
							<p>
								Aplikacja została zaimplementowana z
								wykorzystaniem nowoczesnych technologii
								webowych, z naciskiem na dostępność i
								użyteczność.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>

			<div className="mb-16">
				<h2 className="text-3xl font-bold mb-6">
					Źródła i bibliografia
				</h2>
				<div className="bg-muted p-6 rounded-lg">
					<div className="flex items-center gap-3 mb-4">
						<Library className="h-6 w-6 text-primary" />
						<h3 className="text-xl font-bold">
							Wykorzystane źródła i materiały
						</h3>
					</div>
					<p className="mb-6 text-muted-foreground">
						Poniżej znajduje się lista źródeł i materiałów, które
						zostały wykorzystane podczas tworzenia treści
						edukacyjnych w aplikacji Safe in Web.
					</p>

					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1">
							<AccordionTrigger>
								Publikacje naukowe
							</AccordionTrigger>
							<AccordionContent>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<p className="font-medium">
											[Nazwisko, I. (Rok). Tytuł
											publikacji. Wydawnictwo.]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									<li>
										<p className="font-medium">
											[Nazwisko, I. (Rok). Tytuł
											publikacji. Wydawnictwo.]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									{/* Więcej pozycji */}
								</ul>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2">
							<AccordionTrigger>
								Raporty i analizy
							</AccordionTrigger>
							<AccordionContent>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<p className="font-medium">
											[Nazwa organizacji. (Rok). Tytuł
											raportu.]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									<li>
										<p className="font-medium">
											[Nazwa organizacji. (Rok). Tytuł
											raportu.]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									{/* Więcej pozycji */}
								</ul>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3">
							<AccordionTrigger>
								Materiały edukacyjne
							</AccordionTrigger>
							<AccordionContent>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<p className="font-medium">
											[Autor/Organizacja. (Rok). Tytuł
											materiału. Źródło.]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									<li>
										<p className="font-medium">
											[Autor/Organizacja. (Rok). Tytuł
											materiału. Źródło.]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									{/* Więcej pozycji */}
								</ul>
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4">
							<AccordionTrigger>
								Zasoby internetowe
							</AccordionTrigger>
							<AccordionContent>
								<ul className="list-disc pl-6 space-y-2">
									<li>
										<p className="font-medium">
											[Autor/Organizacja. (Rok). Tytuł
											zasobu. URL]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									<li>
										<p className="font-medium">
											[Autor/Organizacja. (Rok). Tytuł
											zasobu. URL]
										</p>
										<p className="text-sm text-muted-foreground">
											Krótki opis wykorzystania źródła w
											projekcie
										</p>
									</li>
									{/* Więcej pozycji */}
								</ul>
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</div>
			</div>

			<div className="mb-16">
				<h2 className="text-3xl font-bold mb-6">Autor projektu</h2>
				<div className="bg-muted rounded-lg">
					<div className="flex flex-col md:flex-row items-center md:items-start gap-8">
						<div className="bg-background p-6 rounded-lg text-center md:text-left">
							<h3 className="text-2xl font-bold">
								Łukasz Maguda
							</h3>
							<p className="text-muted-foreground mb-4">
								Informatyka Stosowana
							</p>
							<p className="mb-2">
								Uniwersytet Ekonomiczny w Krakowie
							</p>
							<p className="text-sm text-muted-foreground">
								Projekt realizowany pod kierunkiem:
								<br />
								dr Michał Widlak
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
