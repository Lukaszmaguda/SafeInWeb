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
        "Poznaj najważniejsze zasady bezpiecznego korzystania z internetu i ochrony danych osobowych.",
      readTime: "8 min",
      category: "Podstawy",
      link: "https://kwestiabezpieczenstwa.pl/zasady-bezpiecznego-korzystania-z-internetu/",
    },
    {
      id: "silne-hasla",
      title: "Jak tworzyć silne hasła?",
      description:
        "Praktyczny poradnik tworzenia i zarządzania bezpiecznymi hasłami oraz używania menedżerów haseł.",
      readTime: "6 min",
      category: "Hasła",
      link: "https://www.gov.pl/web/baza-wiedzy/jak-tworzyc-bezpieczne-hasla/",
    },
    {
      id: "phishing-rozpoznawanie",
      title: "Jak rozpoznać phishing?",
      description:
        "Naucz się rozpoznawać próby wyłudzenia danych i oszustwa internetowe na przykładach rzeczywistych ataków.",
      readTime: "10 min",
      category: "Zagrożenia",
      link: "https://www.malwarebytes.com/pl/phishing",
    },
    {
      id: "prywatnosc-w-sieci",
      title: "Ochrona prywatności w sieci",
      description:
        "Jak chronić swoją prywatność podczas korzystania z internetu, mediów społecznościowych i aplikacji.",
      readTime: "12 min",
      category: "Prywatność",
      link: "https://bitdefender.pl/czym-jest-prywatnosc-w-sieci-i-dlaczego-jest-wazna/",
    },
    {
      id: "bezpieczne-zakupy",
      title: "Bezpieczne zakupy online",
      description:
        "Przewodnik po bezpiecznym robieniu zakupów w internecie - od weryfikacji sklepów po bezpieczne płatności.",
      readTime: "9 min",
      category: "E-commerce",
      link: "https://nordvpn.com/pl/blog/bezpieczne-zakupy-w-internecie/",
    },
  ];

  const poradniki = [
    {
      id: "Phishing-Guide",
      title: "Phishing i jak go rozpoznawać",
      description: "Kompletny przewodnik jak rozpoznawać phishing.",
      type: "PDF",
      size: "2.8 MB",
      link: "https://www.pomorski-bs.pl/pliki/cyber-edu-01-cyberzagrożenia-bądź-na-bieżąco-20230615.pdf",
    },
    {
      id: "cybersecurity-guide",
      title: "Cybersecurity dla małych firm",
      description:
        "Praktyczny poradnik cyberbezpieczeństwa dla małych i średnich przedsiębiorstw.",
      type: "PDF",
      size: "4.2 MB",
      link: "https://www.google.com/url?sa=t&rct=j&q=&esrc=s&source=web&cd=&ved=2ahUKEwjuhdn4io2OAxVQJBAIHXduI2UQFnoECBkQAQ&url=https%3A%2F%2Fbibliotekanauki.pl%2Farticles%2F30145728.pdf&usg=AOvVaw0SPAJBiqhGtsRusXsD-Jse&opi=89978449",
    },
    {
      id: "defense-in-depth",
      title: "Jak uchronić się przed atakami",
      description:
        "Przedstawienie technik zwiększających bezpieczeństwo w sieci.",
      type: "PDF",
      size: "1.9 MB",
      link: "https://www.zut.edu.pl/fileadmin/pliki/2021/obi/1/RCB-Cyberbezpieczeństwo.pdf",
    },
    {
      id: "safe-buying-online",
      title: "Bezpieczne zakupy online",
      description:
        "Przewodnik po bezpiecznych zakupach w internecie, jak unikać oszustw i dbać o swoje dane.",
      type: "PDF",
      size: "3.1 MB",
      link: "https://cyfroweumiejetnosci.malopolska.pl/images/2022/Bezpieczne%20zakupy%20w%20sieci.pdf",
    },
  ];

  const wideo = [
    {
      id: "phishing-awareness",
      title: "Phishing Awareness Training",
      description:
        "Profesjonalny film szkoleniowy pokazujący różne typy ataków phishingowych i sposoby ich rozpoznawania.",
      duration: "6:47",
      link: "https://www.youtube.com/watch?v=XBkzBrXlle0",
    },
    {
      id: "password-security",
      title: "Password Security Best Practices",
      description: "Wyjaśnienie najlepszych technik ustawiania silnych haseł.",
      duration: "3:30",
      link: "https://www.youtube.com/watch?v=aEmF3Iylvr4",
    },
    {
      id: "social-engineering",
      title: "Social Engineering Attacks Explained",
      description:
        "Analiza technik inżynierii społecznej używanych przez cyberprzestępców i sposobów obrony.",
      duration: "6:56",
      link: "https://www.youtube.com/watch?v=v7VTJhkJUUY",
    },
  ];

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col items-center gap-6 text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl">
          Materiały edukacyjne
        </h1>
        <p className="max-w-[800px] text-lg text-muted-foreground">
          Przeglądaj nasze materiały edukacyjne, aby pogłębić swoją wiedzę o
          bezpieczeństwie w internecie. Znajdziesz tu artykuły, poradniki i
          materiały wideo przygotowane przez ekspertów.
        </p>
      </div>

      <Tabs defaultValue="artykuly" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="artykuly" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Artykuły
          </TabsTrigger>
          <TabsTrigger value="poradniki" className="flex items-center gap-2">
            <BookOpen className="h-4 w-4" />
            Poradniki
          </TabsTrigger>
          <TabsTrigger value="wideo" className="flex items-center gap-2">
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
                  <div className="inline-block px-3 py-1 text-xs font-medium bg-primary/10 text-primary rounded-full mb-2 w-fit">
                    {artykul.category}
                  </div>
                  <CardTitle>{artykul.title}</CardTitle>
                  <CardDescription>{artykul.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Czas czytania: {artykul.readTime}</span>
                  </div>
                </CardContent>
                <CardFooter>
                  <Link
                    href={artykul.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button variant="outline" className="w-full">
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
                  <div className="inline-block px-3 py-1 text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 rounded-full mb-2 w-fit">
                    {poradnik.type}
                  </div>
                  <CardTitle>{poradnik.title}</CardTitle>
                  <CardDescription>{poradnik.description}</CardDescription>
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
                    target="_blank"
                    rel="noopener noreferrer"
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
                  <CardDescription>{film.description}</CardDescription>
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
                    <Button variant="outline" className="w-full">
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
