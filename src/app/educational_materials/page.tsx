import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { currentUser } from "@clerk/nextjs/server";
import {
	BookOpen,
	FileText,
	Video,
	Download,
	ExternalLink,
	Clock,
} from "lucide-react";
import Link from "next/link";

export default async function MaterialyPage() {
	const user = await currentUser();
	if (user) {
		try {
			await syncUser();
		} catch (error) {
			console.error("Failed to sync user:", error);
		}
	}

	const artykuly = [
		{
			id: "podstawy-bezpieczenstwa",
			title: "Podstawy bezpieczeństwa w sieci",
			description:
				"Poznaj najważniejsze zasady bezpiecznego korzystania z internetu.",
			readTime: "10 min",
			category: "Podstawy",
			link: "/materialy/artykuly/podstawy-bezpieczenstwa",
		},
		{
			id: "silne-hasla",
			title: "Jak tworzyć silne hasła?",
			description:
				"Praktyczny poradnik tworzenia i zarządzania bezpiecznymi hasłami.",
			readTime: "8 min",
			category: "Hasła",
			link: "/materialy/artykuly/silne-hasla",
		},
		{
			id: "phishing-rozpoznawanie",
			title: "Jak rozpoznać phishing?",
			description:
				"Naucz się rozpoznawać próby wyłudzenia danych i oszustwa internetowe.",
			readTime: "12 min",
			category: "Zagrożenia",
			link: "/materialy/artykuly/phishing-rozpoznawanie",
		},
		{
			id: "prywatnosc-w-sieci",
			title: "Ochrona prywatności w sieci",
			description:
				"Jak chronić swoją prywatność podczas korzystania z internetu.",
			readTime: "15 min",
			category: "Prywatność",
			link: "/materialy/artykuly/prywatnosc-w-sieci",
		},
	];

	const poradniki = [
		{
			id: "dwustopniowe-uwierzytelnianie",
			title: "Jak włączyć dwustopniowe uwierzytelnianie?",
			description:
				"Krok po kroku, jak zabezpieczyć swoje konta dodatkową warstwą ochrony.",
			type: "PDF",
			size: "2.5 MB",
			link: "/materialy/poradniki/dwustopniowe-uwierzytelnianie.pdf",
		},
		{
			id: "bezpieczne-zakupy",
			title: "Bezpieczne zakupy online",
			description: "Poradnik bezpiecznego robienia zakupów w internecie.",
			type: "PDF",
			size: "3.1 MB",
			link: "/materialy/poradniki/bezpieczne-zakupy.pdf",
		},
		{
			id: "ochrona-dzieci",
			title: "Jak chronić dzieci w internecie?",
			description: "Praktyczne wskazówki dla rodziców i opiekunów.",
			type: "PDF",
			size: "4.2 MB",
			link: "/materialy/poradniki/ochrona-dzieci.pdf",
		},
	];

	const wideo = [
		{
			id: "phishing-wideo",
			title: "Jak działa phishing?",
			description:
				"Animacja pokazująca mechanizmy działania ataków phishingowych.",
			duration: "5:32",
			link: "https://www.youtube.com/watch?v=example1",
		},
		{
			id: "hasla-wideo",
			title: "Dlaczego silne hasła są ważne?",
			description:
				"Krótki film wyjaśniający znaczenie silnych haseł w cyberbezpieczeństwie.",
			duration: "4:15",
			link: "https://www.youtube.com/watch?v=example2",
		},
		{
			id: "social-media-wideo",
			title: "Bezpieczeństwo w mediach społecznościowych",
			description:
				"Jak bezpiecznie korzystać z platform społecznościowych.",
			duration: "8:47",
			link: "https://www.youtube.com/watch?v=example3",
		},
	];

	return (
		<div className="container mx-auto px-4 py-12">
			<div className="flex flex-col items-center gap-6 text-center mb-12">
				<h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
					Materiały edukacyjne
				</h1>
				<p className="max-w-[800px] text-lg text-muted-foreground">
					Przeglądaj nasze materiały edukacyjne, aby pogłębić swoją
					wiedzę o bezpieczeństwie w internecie. Znajdziesz tu
					artykuły, poradniki i materiały wideo przygotowane przez
					ekspertów.
				</p>
			</div>

			<Tabs defaultValue="artykuly" className="w-full">
				<TabsList className="grid w-full grid-cols-3 mb-8">
					<TabsTrigger
						value="artykuly"
						className="flex items-center gap-2"
					>
						<FileText className="h-4 w-4" />
						Artykuły
					</TabsTrigger>
					<TabsTrigger
						value="poradniki"
						className="flex items-center gap-2"
					>
						<BookOpen className="h-4 w-4" />
						Poradniki
					</TabsTrigger>
					<TabsTrigger
						value="wideo"
						className="flex items-center gap-2"
					>
						<Video className="h-4 w-4" />
						Wideo
					</TabsTrigger>
				</TabsList>

				<TabsContent value="artykuly">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{artykuly.map((artykul) => (
							<Card
								key={artykul.id}
								className="flex flex-col h-full hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2">
										{artykul.category}
									</div>
									<CardTitle>{artykul.title}</CardTitle>
									<CardDescription>
										{artykul.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-grow">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Clock className="h-4 w-4" />
										<span>
											Czas czytania: {artykul.readTime}
										</span>
									</div>
								</CardContent>
								<CardFooter>
									<Link
										href={artykul.link}
										className="w-full"
									>
										<Button
											variant="outline"
											className="w-full"
										>
											Czytaj artykuł
											<ExternalLink className="ml-2 h-4 w-4" />
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="poradniki">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{poradniki.map((poradnik) => (
							<Card
								key={poradnik.id}
								className="flex flex-col h-full hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<div className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full mb-2">
										{poradnik.type}
									</div>
									<CardTitle>{poradnik.title}</CardTitle>
									<CardDescription>
										{poradnik.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-grow">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<FileText className="h-4 w-4" />
										<span>Rozmiar: {poradnik.size}</span>
									</div>
								</CardContent>
								<CardFooter>
									<Link
										href={poradnik.link}
										className="w-full"
									>
										<Button className="w-full">
											Pobierz poradnik
											<Download className="ml-2 h-4 w-4" />
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>

				<TabsContent value="wideo">
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
						{wideo.map((film) => (
							<Card
								key={film.id}
								className="flex flex-col h-full hover:shadow-lg transition-shadow"
							>
								<CardHeader>
									<CardTitle>{film.title}</CardTitle>
									<CardDescription>
										{film.description}
									</CardDescription>
								</CardHeader>
								<CardContent className="flex-grow">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Video className="h-4 w-4" />
										<span>Długość: {film.duration}</span>
									</div>
								</CardContent>
								<CardFooter>
									<Link
										href={film.link}
										target="_blank"
										rel="noopener noreferrer"
										className="w-full"
									>
										<Button
											variant="outline"
											className="w-full"
										>
											Obejrzyj film
											<ExternalLink className="ml-2 h-4 w-4" />
										</Button>
									</Link>
								</CardFooter>
							</Card>
						))}
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
