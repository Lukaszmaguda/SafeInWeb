"use client";

import { useState, useEffect, SetStateAction } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Eye, EyeOff, RefreshCw, Trophy, Target } from "lucide-react";

interface PasswordStrength {
  score: number;
  level: string;
  emoji: string;
  color: string;
  bgColor: string;
  message: string;
  tips: string[];
}

interface PasswordGameProps {
  userId?: string;
}

export default function PasswordGame({ userId }: PasswordGameProps) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [strength, setStrength] = useState<PasswordStrength>({
    score: 0,
    level: "Brak hasła",
    emoji: "😴",
    color: "text-gray-500",
    bgColor: "bg-gray-100",
    message: "Wpisz hasło, aby rozpocząć!",
    tips: [],
  });
  const [achievements, setAchievements] = useState<string[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);

  const calculateStrength = (pwd: string): PasswordStrength => {
    if (!pwd) {
      return {
        score: 0,
        level: "Brak hasła",
        emoji: "😴",
        color: "text-gray-500",
        bgColor: "bg-gray-100",
        message: "Wpisz hasło, aby rozpocząć!",
        tips: ["Zacznij wpisywać hasło..."],
      };
    }

    let score = 0;
    const tips: string[] = [];

    // Długość
    if (pwd.length >= 12) {
      score += 25;
    } else if (pwd.length >= 8) {
      score += 15;
    } else {
      tips.push("Użyj co najmniej 8 znaków (lepiej 12+)");
    }

    // Małe litery
    if (/[a-z]/.test(pwd)) {
      score += 10;
    } else {
      tips.push("Dodaj małe litery (a-z)");
    }

    // Duże litery
    if (/[A-Z]/.test(pwd)) {
      score += 10;
    } else {
      tips.push("Dodaj duże litery (A-Z)");
    }

    // Cyfry
    if (/\d/.test(pwd)) {
      score += 10;
    } else {
      tips.push("Dodaj cyfry (0-9)");
    }

    // Znaki specjalne
    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      score += 15;
    } else {
      tips.push("Dodaj znaki specjalne (!@#$%^&*)");
    }

    // Różnorodność
    const uniqueChars = new Set(pwd).size;
    if (uniqueChars >= pwd.length * 0.7) {
      score += 10;
    } else {
      tips.push("Użyj więcej różnych znaków");
    }

    // Brak popularnych wzorców
    const commonPatterns = ["123", "abc", "qwerty", "password", "admin"];
    const hasCommonPattern = commonPatterns.some((pattern) =>
      pwd.toLowerCase().includes(pattern)
    );
    if (!hasCommonPattern) {
      score += 10;
    } else {
      tips.push("Unikaj popularnych wzorców (123, abc, qwerty)");
    }

    // Określ poziom
    if (score >= 80) {
      return {
        score,
        level: "Bardzo silne",
        emoji: "🤩",
        color: "text-green-600",
        bgColor: "bg-green-100",
        message: "Wow! To hasło jest niesamowite! 🎉",
        tips: ["🏆 Perfekcyjne hasło! Gratulacje!"],
      };
    } else if (score >= 60) {
      return {
        score,
        level: "Silne",
        emoji: "😊",
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        message: "Świetnie! To hasło jest bardzo bezpieczne!",
        tips: tips.length > 0 ? tips : ["✨ Prawie idealne!"],
      };
    } else if (score >= 40) {
      return {
        score,
        level: "Średnie",
        emoji: "😐",
        color: "text-yellow-600",
        bgColor: "bg-yellow-100",
        message: "Niezłe, ale można lepiej...",
        tips,
      };
    } else if (score >= 20) {
      return {
        score,
        level: "Słabe",
        emoji: "😟",
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        message: "Hmm, to hasło potrzebuje wzmocnienia",
        tips,
      };
    } else {
      return {
        score,
        level: "Bardzo słabe",
        emoji: "😰",
        color: "text-red-600",
        bgColor: "bg-red-100",
        message: "Ojej! To hasło jest bardzo niebezpieczne!",
        tips,
      };
    }
  };

  useEffect(() => {
    const newStrength = calculateStrength(password);
    setStrength(newStrength);

    // Sprawdź osiągnięcia
    const newAchievements: string[] = [];

    if (password.length >= 12 && !achievements.includes("długie")) {
      newAchievements.push("długie");
    }
    if (newStrength.score >= 80 && !achievements.includes("perfekcyjne")) {
      newAchievements.push("perfekcyjne");
      setShowCelebration(true);
      setTimeout(() => setShowCelebration(false), 3000);
    }
    if (
      /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) &&
      !achievements.includes("specjalne")
    ) {
      newAchievements.push("specjalne");
    }

    if (newAchievements.length > 0) {
      setAchievements((prev) => [...prev, ...newAchievements]);
    }
  }, [password, achievements]);

  const generateStrongPassword = () => {
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let result = "";

    // Zapewnij co najmniej jeden znak z każdej kategorii
    result += lowercase[Math.floor(Math.random() * lowercase.length)];
    result += uppercase[Math.floor(Math.random() * uppercase.length)];
    result += numbers[Math.floor(Math.random() * numbers.length)];
    result += symbols[Math.floor(Math.random() * symbols.length)];

    // Dodaj pozostałe znaki
    const allChars = lowercase + uppercase + numbers + symbols;
    for (let i = 4; i < 16; i++) {
      result += allChars[Math.floor(Math.random() * allChars.length)];
    }

    // Przemieszaj znaki
    result = result
      .split("")
      .sort(() => Math.random() - 0.5)
      .join("");

    setPassword(result);
  };

  const resetGame = () => {
    setPassword("");
    setAchievements([]);
    setShowCelebration(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Animacja celebracji */}
      {showCelebration && (
        <div className="fixed inset-0 pointer-events-none z-50 flex items-center justify-center">
          <div className="text-8xl animate-bounce">🎉</div>
        </div>
      )}

      {/* Główna karta gry */}
      <Card
        className={`${strength.bgColor} transition-all duration-500 border-2`}
      >
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="text-8xl animate-bounce transition-all duration-10">
              {strength.emoji}
            </div>
          </div>
          <CardTitle
            className={`text-2xl ${strength.color} transition-colors duration-300`}
          >
            Strażnik Haseł: {strength.level}
          </CardTitle>
          <p className={`${strength.color} font-medium`}>{strength.message}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Input hasła */}
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Wpisz swoje hasło..."
              value={password}
              onChange={(e: { target: { value: SetStateAction<string> } }) =>
                setPassword(e.target.value)
              }
              className="pr-12 text-lg h-12"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </Button>
          </div>

          {/* Pasek siły */}
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Siła hasła:</span>
              <Badge className={strength.color}>{strength.score}/100</Badge>
            </div>
            <Progress value={strength.score} className="h-3" />
          </div>

          {/* Przyciski */}
          <div className="flex gap-2">
            <Button onClick={generateStrongPassword} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Wygeneruj silne hasło
            </Button>
            <Button onClick={resetGame} variant="outline">
              <Target className="mr-2 h-4 w-4" />
              Reset
            </Button>
          </div>
        </CardContent>
      </Card>

      {strength.tips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg"> Wskazówki do poprawy</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {strength.tips.map((tip, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-sm">{tip}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Osiągnięcia */}
      {achievements.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              Twoje osiągnięcia
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {achievements.map((achievement) => (
                <Badge
                  key={achievement}
                  variant="secondary"
                  className="bg-yellow-100 text-yellow-800"
                >
                  {achievement === "długie" && "Długie hasło (12+ znaków)"}
                  {achievement === "perfekcyjne" && " Perfekcyjne hasło!"}
                  {achievement === "specjalne" && "Użyto znaków specjalnych"}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Edukacyjna sekcja */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            Dlaczego silne hasła są ważne?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-green-600">
                ✅ Dobre praktyki:
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Minimum 12 znaków</li>
                <li>• Mieszanka liter, cyfr i symboli</li>
                <li>• Unikalne dla każdego konta</li>
                <li>• Używaj menedżera haseł</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-red-600">❌ Czego unikać:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Danych osobowych</li>
                <li>• Popularnych wzorców</li>
                <li>• Słów ze słownika</li>
                <li>• Tego samego hasła wszędzie</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
