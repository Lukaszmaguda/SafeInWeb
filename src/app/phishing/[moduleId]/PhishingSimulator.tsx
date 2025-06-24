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
  Clock,
  User,
  Globe,
  Smartphone,
  Phone,
} from "lucide-react";
import {
  getPhishingScenarios,
  savePhishingResult,
} from "@/actions/phishing.actions";

interface PhishingScenario {
  id: string;
  type: string;
  content: {
    // Email fields
    subject?: string;
    sender?: string;
    body?: string;
    // Website fields
    url?: string;
    pageTitle?: string;
    elements?: string[];
    // SMS fields
    phone?: string;
    message?: string;
    time?: string;
  };
  isPhishing: boolean;
  redFlags: string[];
  explanation: string;
  difficulty: string;
}

interface PhishingSimulatorProps {
  moduleId: string;
  clerkId?: string;
}

export default function PhishingSimulator({
  moduleId,
  clerkId,
}: PhishingSimulatorProps) {
  const [scenarios, setScenarios] = useState<PhishingScenario[]>([]);
  const [currentScenario, setCurrentScenario] = useState(0);
  const [userAnswers, setUserAnswers] = useState<boolean[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadScenarios = async () => {
      try {
        const data = await getPhishingScenarios(moduleId);
        setScenarios(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to load scenarios:", error);
        setLoading(false);
      }
    };
    loadScenarios();
  }, [moduleId]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4">Ładowanie scenariuszy...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (scenarios.length === 0) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="p-8 text-center">
            <p>Brak dostępnych scenariuszy dla tego modułu.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentScenarioData = scenarios[currentScenario];
  const progress = ((currentScenario + 1) / scenarios.length) * 100;

  const getModuleIcon = () => {
    switch (moduleId) {
      case "email-phishing":
        return <Mail className="h-5 w-5" />;
      case "website-phishing":
        return <Globe className="h-5 w-5" />;
      case "sms-phishing":
        return <Smartphone className="h-5 w-5" />;
      case "voice-phishing":
        return <Phone className="h-5 w-5" />;
      default:
        return <Mail className="h-5 w-5" />;
    }
  };

  const renderScenarioContent = () => {
    switch (moduleId) {
      case "email-phishing":
        return (
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
        );

      case "website-phishing":
        return (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Globe className="h-4 w-4" />
                <span className="font-medium">URL:</span>
                <span className="font-mono bg-white px-2 py-1 rounded border">
                  {currentScenarioData.content.url}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <span className="font-medium">Tytuł strony:</span>
                <span>{currentScenarioData.content.pageTitle}</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="space-y-3">
              <p className="text-sm font-medium">Zawartość strony:</p>
              <p className="text-sm">{currentScenarioData.content.body}</p>
              {currentScenarioData.content.elements && (
                <div>
                  <p className="text-sm font-medium mb-2">
                    Elementy na stronie:
                  </p>
                  <ul className="text-sm space-y-1">
                    {currentScenarioData.content.elements.map(
                      (element, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                          {element}
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        );

      case "sms-phishing":
        return (
          <div className="bg-gray-50 rounded-lg p-4 border">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm">
                <Smartphone className="h-4 w-4" />
                <span className="font-medium">Od:</span>
                <span>{currentScenarioData.content.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Czas:</span>
                <span>{currentScenarioData.content.time}</span>
              </div>
            </div>
            <hr className="my-4" />
            <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs">
              <p className="text-sm">{currentScenarioData.content.message}</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleAnswer = async (isPhishing: boolean) => {
    const newAnswers = [...userAnswers, isPhishing];
    setUserAnswers(newAnswers);

    const isCorrect = isPhishing === currentScenarioData.isPhishing;
    if (isCorrect) {
      setScore(score + 1);
    }

    setShowResult(true);
    setShowExplanation(true);
  };

  const nextScenario = async () => {
    if (currentScenario < scenarios.length - 1) {
      setCurrentScenario(currentScenario + 1);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      setIsCompleted(true);

      if (clerkId) {
        try {
          const results = scenarios.map((scenario, index) => ({
            scenarioId: scenario.id,
            userAnswer: userAnswers[index],
            correctAnswer: scenario.isPhishing,
          }));

          await savePhishingResult(clerkId, moduleId, results);
        } catch (error) {
          console.error("Failed to save phishing result:", error);
        }
      }
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

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            {getModuleIcon()}
            <CardTitle>Czy to phishing?</CardTitle>
            <Badge variant="outline">
              {currentScenarioData.difficulty === "easy" && "Łatwy"}
              {currentScenarioData.difficulty === "medium" && "Średni"}
              {currentScenarioData.difficulty === "hard" && "Trudny"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderScenarioContent()}

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
                    : "To było bezpieczne."}
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
