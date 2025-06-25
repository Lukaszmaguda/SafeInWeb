import { syncUser } from "@/actions/user.action";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import { currentUser } from "@clerk/nextjs/server";
import Link from "next/link";
import { Shield, BookOpen, CheckCircle, Lock } from "lucide-react";

export default async function Home() {
  const user = await currentUser();
  if (user) {
    try {
      await syncUser();
    } catch (error) {
      console.error("Failed to sync user:", error);
    }
  }

  return (
    <div className="flex flex-col items-center min-h-screen">
      <section className="w-full py-12 md:py-24 lg:py-8 bg-gradient-to-b from-background to-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-5xl lg:text-6xl">
              Bezpieczeństwo w sieci jest na wyciągnięcie ręki
            </h1>
            <p className="max-w-[900px] text-lg text-muted-foreground md:text-xl">
              Dowiedz się jak chronić siebie i swoich bliskich przed
              zagrożeniami w internecie. Zdobądź praktyczną wiedzę poprzez
              interaktywne quizy i materiały edukacyjne.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <Link href="/quizy">
                <Button size="lg" className="px-8 py-4 text-lg">
                  Rozpocznij naukę
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg"
                >
                  Dowiedz się więcej
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="w-full py-8 md:py-8 lg:py-8">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Dlaczego warto się uczyć o bezpieczeństwie?
            </h2>
            <p className="max-w-[800px] text-lg text-muted-foreground md:text-xl">
              Poznaj najważniejsze aspekty bezpieczeństwa w sieci i naucz się
              chronić swoje dane.
            </p>
          </div>
          <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-16">
            {[
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Ochrona danych",
                desc: "Naucz się chronić swoje dane osobowe i prywatność w internecie.",
              },
              {
                icon: <Lock className="h-12 w-12 text-primary" />,
                title: "Silne hasła",
                desc: "Dowiedz się jak tworzyć i zarządzać bezpiecznymi hasłami.",
              },
              {
                icon: <CheckCircle className="h-12 w-12 text-primary" />,
                title: "Weryfikacja informacji",
                desc: "Naucz się rozpoznawać fałszywe informacje i oszustwa w sieci.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-4 rounded-xl border p-8 hover:shadow-lg transition-shadow"
              >
                {feature.icon}
                <h3 className="text-2xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground text-center text-lg">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="w-full py-12 md:py-8 lg:py-8 bg-muted">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
              Gotowy, by stać się bezpieczniejszym w sieci?
            </h2>
            <p className="max-w-[800px] text-lg text-muted-foreground md:text-xl">
              Dołącz do nas i zacznij swoją podróż ku bezpiecznemu korzystaniu z
              internetu.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 mt-6">
              <SignedOut>
                <SignUpButton mode="modal">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Zarejestruj się
                  </Button>
                </SignUpButton>
                <SignInButton mode="modal">
                  <Button
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg"
                  >
                    Mam już konto
                  </Button>
                </SignInButton>
              </SignedOut>
              <SignedIn>
                <Link href="/quiz">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Przejdź do quizów
                  </Button>
                </Link>
              </SignedIn>
              <SignedIn>
                <Link href="/password-game">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Naucz się tworzenia silnych haseł
                  </Button>
                </Link>
              </SignedIn>
              <SignedIn>
                <Link href="/phishing">
                  <Button size="lg" className="px-8 py-4 text-lg">
                    Naucz się jak radzić sobie z phishingiem
                  </Button>
                </Link>
              </SignedIn>
            </div>
          </div>
        </div>
      </section>

      <footer className="w-full py-8 border-t mt-12">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center gap-4 text-center">
            <p className="text-base text-muted-foreground">
              © {new Date().getFullYear()} Safe in Web - Łukasz Maguda.
              Wszystkie prawa zastrzeżone.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
