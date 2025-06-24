"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Mail,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  Shield,
  Clock,
  User,
  Link as LinkIcon,
} from "lucide-react";

interface PhishingScenario {
  id: string;
  type: "email" | "website" | "sms" | "voice";
  content: {
    subject?: string;
    sender?: string;
    body?: string;
    url?: string;
    phone?: string;
    message?: string;
  };
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
  difficulty: "easy" | "medium" | "hard";
}

interface PhishingSimulatorProps {
  moduleId: string;
  userId?: string;
}

export default function PhishingSimulator({
  moduleId,
  userId,
}: PhishingSimulatorProps) {
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const scenarios: PhishingScenario[] = [
    {
      id: "bank-alert",
      type: "email",
      content: {
        subject: "PILNE: Twoje konto zostało zablokowane!",
        sender: "security@pkobp-bank.com",
        body: `Szanowny Kliencie,

Wykryliśmy podejrzaną aktywność na Twoim koncie. Z powodów bezpieczeństwa Twoje konto zostało tymczasowo zablokowane.

Aby odblokować konto, kliknij poniższy link i potwierdź swoje dane w ciągu 24 godzin:

https://pko-bp-secure.verification-center.com/unlock

Jeśli nie podejmiesz działań, Twoje konto zostanie trwale zamknięte.

Z poważaniem,
Zespół Bezpieczeństwa PKO BP`,
      },
      isPhishing: true,
      redFlags: [
        "Błędna domena nadawcy (pkobp-bank.com zamiast pkobp.pl)",
        "Pilność i groźby",
        "Podejrzany link (nie jest to oficjalna domena banku)",
        "Prośba o potwierdzenie danych przez link",
      ],
      explanation:
        "To klasyczny przykład phishingu bankowego. Prawdziwy bank nigdy nie prosi o potwierdzenie danych przez email.",
      difficulty: "easy",
    },
    {
      id: "paypal-invoice",
      type: "email",
      content: {
        subject: "Potwierdzenie płatności PayPal - 2,847.99 PLN",
        sender: "service@paypal.com",
        body: `Dziękujemy za płatność PayPal

Szczegóły transakcji:
Kwota: 2,847.99 PLN
Odbiorca: TechStore Premium
Data: ${new Date().toLocaleDateString()}

Jeśli to nie była Twoja transakcja, kliknij tutaj aby anulować:
https://paypal.com/cancel-transaction/ref=ps847291

Zespół PayPal`,
      },
      isPhishing: false,
      redFlags: [],
      explanation:
        "Ten email wygląda podejrzanie przez wysoką kwotę, ale adres nadawcy jest prawidłowy i link prowadzi do oficjalnej domeny PayPal.",
      difficulty: "medium",
    },
    {
      id: "microsoft-security",
      type: "email",
      content: {
        subject: "Wykryto nietypowe logowanie do Twojego konta Microsoft",
        sender: "account-security-noreply@accountprotection.microsoft.com",
        body: `Witaj,

Wykryliśmy logowanie do Twojego konta Microsoft z nowego urządzenia:

Lokalizacja: Warszawa, Polska
Urządzenie: Windows 10 PC
Czas: ${new Date().toLocaleString()}

Jeśli to byłeś Ty, możesz zignorować tę wiadomość.

Jeśli to nie byłeś Ty, zabezpiecz swoje konto:
https://account.microsoft.com/security

Zespół Microsoft`,
      },
      isPhishing: false,
      redFlags: [],
      explanation:
        "To prawdziwy email od Microsoft. Adres nadawcy jest oficjalny, a link prowadzi do prawdziwej strony Microsoft.",
      difficulty: "hard",
    },
    {
      id: "amazon-prize",
      type: "email",
      content: {
        subject: "Gratulacje! Wygrałeś iPhone 15 Pro!",
        sender: "prizes@amazon-rewards.net",
        body: `Drogi Kliencie Amazon,

Gratulujemy! Zostałeś wybrany jako zwycięzca naszej miesięcznej loterii!

Twoja nagroda: iPhone 15 Pro (wartość 5,999 PLN)

Aby odebrać nagrodę, wypełnij formularz w ciągu 48 godzin:
https://amazon-rewards.net/claim-prize?user=winner2024

Wymagane informacje:
- Pełne imię i nazwisko  
- Adres zamieszkania
- Numer telefonu
- Dane karty kredytowej (do weryfikacji tożsamości)

Zespół Amazon Rewards`,
      },
      isPhishing: true,
      redFlags: [
        "Fałszywa domena (amazon-rewards.net zamiast amazon.pl)",
        "Nierealistyczna nagroda bez udziału w konkursie",
        "Prośba o dane karty kredytowej",
        "Presja czasowa (48 godzin)",
        "Ogólne zwroty bez personalizacji",
      ],
      explanation:
        "Klasyczny phishing z nagrodą. Amazon nigdy nie organizuje takich losowań przez email i nie prosi o dane karty.",
      difficulty: "easy",
    },
  ];

  const currentScenarioData = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  const handleAnswer = (isPhishing: boolean) => {
    const newAnswers = [...userAnswers, isPhishing];
    setUserAnswers(newAnswers);

    const isCorrect = isPhishing === currentScenarioData.isPhishing;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
    setShowExplanation(true);
  };

  const nextScenario = () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);
    }
  };

  const resetSimulation = () => {
    setCurrentScenario(0);
    setUserAnswers([]);
    setShowResult(false);
    setShowExplanation(false);
    setScore(0);
    setIsCompleted(false);
  };

  if (isCompleted) {
    const percentage = Math.round((score / scenarios.length) * 100);

    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Symulacja ukończona!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-6">
            <div className="text-6xl">
              {percentage >= 80 ? "🛡️" : percentage >= 60 ? "⚠️" : "🚨"}
            </div>
            <div>
              <div className="text-4xl font-bold text-primary mb-2">
                {score}/{scenarios.length}
              </div>
              <div className="text-xl mb-4">Wynik: {percentage}%</div>
              <Progress
                value={percentage}
                className="w-full max-w-md mx-auto"
              />
            </div>

            <div className="space-y-2">
              {percentage >= 80 && (
                <p className="text-green-600 font-medium">
                  Świetnie! Jesteś ekspertem w rozpoznawaniu phishingu!
                </p>
              )}
              {percentage >= 60 && percentage < 80 && (
                <p className="text-yellow-600 font-medium">
                  Dobrze! Ale warto jeszcze poćwiczyć rozpoznawanie
                  zaawansowanych ataków.
                </p>
              )}
              {percentage < 60 && (
                <p className="text-red-600 font-medium">
                  Uwaga! Potrzebujesz więcej treningu, aby bezpiecznie korzystać
                  z internetu.
                </p>
              )}
            </div>

            <div className="flex gap-4 justify-center">
              <Button onClick={resetSimulation}>Spróbuj ponownie</Button>
              <Button
                variant="outline"
                onClick={() => (window.location.href = "/phishing")}
              >
                Powrót do centrum
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Pasek postępu */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">
            Scenariusz {currentScenario + 1} z {scenarios.length}
          </span>
          <span className="text-sm text-muted-foreground">
            Wynik: {score}/{currentScenario + (showResult ? 1 : 0)}
          </span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>

      {/* Główna karta scenariusza */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            <CardTitle>Czy to phishing?</CardTitle>
            <Badge variant="outline">
              {currentScenarioData.difficulty === "easy" && "Łatwy"}
              {currentScenarioData.difficulty === "medium" && "Średni"}
              {currentScenarioData.difficulty === "hard" && "Trudny"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Email content */}
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <User className="h-4 w-4" />
                <span className="font-medium">Od:</span>
                <span>{currentScenarioData.content.sender}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Mail className="h-4 w-4" />
                <span className="font-medium">Temat:</span>
                <span>{currentScenarioData.content.subject}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Data:</span>
                <span>{new Date().toLocaleString()}</span>
              </div>
            </div>

            <hr className="my-4" />

            <div className="whitespace-pre-line text-sm">
              {currentScenarioData.content.body}
            </div>
          </div>

          {!showResult && (
            <div className="flex gap-4 justify-center">
              <Button
                onClick={() => handleAnswer(true)}
                variant="destructive"
                size="lg"
              >
                <XCircle className="mr-2 h-5 w-5" />
                To jest phishing
              </Button>
              <Button
                onClick={() => handleAnswer(false)}
                variant="default"
                size="lg"
              >
                <CheckCircle className="mr-2 h-5 w-5" />
                To jest bezpieczne
              </Button>
            </div>
          )}

          {showResult && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg ${
                  userAnswers[currentScenario] ===
                  currentScenarioData.isPhishing
                    ? "bg-green-100 border-green-200"
                    : "bg-red-100 border-red-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {userAnswers[currentScenario] ===
                  currentScenarioData.isPhishing ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                  <span className="font-medium">
                    {userAnswers[currentScenario] ===
                    currentScenarioData.isPhishing
                      ? "Prawidłowa odpowiedź!"
                      : "Nieprawidłowa odpowiedź"}
                  </span>
                </div>
                <p className="text-sm">
                  {currentScenarioData.isPhishing
                    ? "To był phishing!"
                    : "To był bezpieczny email."}
                </p>
              </div>

              {showExplanation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Eye className="h-5 w-5" />
                      Wyjaśnienie
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="mb-4">{currentScenarioData.explanation}</p>

                    {currentScenarioData.redFlags.length > 0 && (
                      <div>
                        <h4 className="font-medium text-red-600 mb-2 flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4" />
                          Czerwone flagi:
                        </h4>
                        <ul className="text-sm space-y-1">
                          {currentScenarioData.redFlags.map((flag, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-red-500">•</span>
                              <span>{flag}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              <div className="flex justify-center">
                <Button onClick={nextScenario} size="lg">
                  {currentScenario < scenarios.length - 1
                    ? "Następny scenariusz"
                    : "Zakończ symulację"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
