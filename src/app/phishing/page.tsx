import { syncUser } from "@/actions/user.action";
import { currentUser } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Shield,
  CircleArrowOutUpRight,
  Mail,
  Phone,
  MessageSquare,
} from "lucide-react";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function PhishingPage() {
  const user = await currentUser();

  if (user) {
    try {
      await syncUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  const modules = [
    {
      id: "email-phishing",
      title: "Phishing emailowy",
      description:
        "Naucz się rozpoznawać podejrzane emaile i fałszywe wiadomości",
      icon: <Mail className="h-8 w-8" />,
      difficulty: "Łatwy",
    },
    {
      id: "website-phishing",
      title: "Fałszywe strony internetowe",
      description: "Identyfikuj podrobione strony logowania i sklepy online",
      icon: <CircleArrowOutUpRight className="h-8 w-8" />,
      difficulty: "Średni",
    },
    {
      id: "sms-phishing",
      title: "SMiShing (SMS Phishing)",
      description: "Rozpoznaj oszustwa przez wiadomości tekstowe",
      icon: <MessageSquare className="h-8 w-8" />,
      difficulty: "Średni",
    },
    {
      id: "voice-phishing",
      title: "Vishing (Voice Phishing)",
      description: "Chroń się przed oszustwami telefonicznymi",
      icon: <Phone className="h-8 w-8" />,
      difficulty: "Trudny",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <Link
          href="/"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Powrót do strony głównej
        </Link>
      </div>

      <div className="flex flex-col items-center gap-6 text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">
          Centrum Anty-Phishingowe
        </h1>
        <p className="max-w-[700px] text-lg text-muted-foreground">
          Naucz się rozpoznawać i unikać ataków phishingowych przez praktyczne
          symulacje. Każdy moduł zawiera realistyczne scenariusze z
          natychmiastowym feedbackiem.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
        {modules.map((module) => (
          <Card key={module.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-primary/10 rounded-lg text-primary">
                  {module.icon}
                </div>
                <div>
                  <CardTitle>{module.title}</CardTitle>
                  <CardDescription className="mt-1">
                    {module.description}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm text-muted-foreground">
                  Poziom: {module.difficulty}
                </span>
              </div>
              <Link href={`/phishing/${module.id}`}>
                <Button className="w-full">Rozpocznij trening</Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Sekcja edukacyjna */}
      <Card>
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
