"use server";

import prisma from "@/lib/prisma";

export async function getPhishingModules() {
  try {
    const modules = await prisma.phishingScenario.groupBy({
      by: ["moduleId"],
      _count: {
        id: true,
      },
    });

    const moduleData = {
      "email-phishing": {
        title: "Phishing emailowy",
        description:
          "Naucz się rozpoznawać podejrzane emaile i fałszywe wiadomości",
        difficulty: "Łatwy",
      },
      "website-phishing": {
        title: "Fałszywe strony internetowe",
        description: "Identyfikuj podrobione strony logowania i sklepy online",
        difficulty: "Średni",
      },
      "sms-phishing": {
        title: "SMiShing (SMS Phishing)",
        description: "Rozpoznaj oszustwa przez wiadomości tekstowe",
        difficulty: "Średni",
      },
      "voice-phishing": {
        title: "Vishing (Voice Phishing)",
        description: "Chroń się przed oszustwami telefonicznymi",
        difficulty: "Trudny",
      },
    };

    return modules.map((module) => ({
      id: module.moduleId,
      ...moduleData[module.moduleId],
      scenarios: module._count.id,
    }));
  } catch (error) {
    console.error("Error fetching phishing modules:", error);
    return [];
  }
}

export async function getPhishingScenarios(moduleId) {
  try {
    const scenarios = await prisma.phishingScenario.findMany({
      where: { moduleId },
      orderBy: { order: "asc" },
    });

    return scenarios.map((scenario) => ({
      id: scenario.id,
      type: "email", // można rozszerzyć
      content: scenario.content,
      isPhishing: scenario.isPhishing,
      redFlags: scenario.redFlags,
      explanation: scenario.explanation,
      difficulty: scenario.difficulty,
    }));
  } catch (error) {
    console.error("Error fetching phishing scenarios:", error);
    return [];
  }
}

export async function savePhishingResult(clerkId, moduleId, results) {
  try {
    // Znajdź użytkownika po clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) {
      throw new Error(`User with clerkId ${clerkId} does not exist`);
    }

    let correctCount = 0;

    // Zapisz wyniki dla każdego scenariusza
    for (const result of results) {
      const isCorrect = result.userAnswer === result.correctAnswer;
      if (isCorrect) correctCount++;

      await prisma.phishingResult.upsert({
        where: {
          userId_scenarioId: {
            userId: user.id,
            scenarioId: result.scenarioId,
          },
        },
        update: {
          userAnswer: result.userAnswer,
          isCorrect: isCorrect,
          answeredAt: new Date(),
        },
        create: {
          userId: user.id,
          scenarioId: result.scenarioId,
          userAnswer: result.userAnswer,
          isCorrect: isCorrect,
        },
      });
    }

    // Zapisz ogólny wynik modułu
    await prisma.phishingModuleResult.upsert({
      where: {
        userId_moduleId: {
          userId: user.id,
          moduleId: moduleId,
        },
      },
      update: {
        score: correctCount,
        totalScenarios: results.length,
        completedAt: new Date(),
      },
      create: {
        userId: user.id,
        moduleId: moduleId,
        score: correctCount,
        totalScenarios: results.length,
      },
    });

    return {
      score: correctCount,
      total: results.length,
      percentage: Math.round((correctCount / results.length) * 100),
    };
  } catch (error) {
    console.error("Error saving phishing result:", error);
    throw error;
  }
}

export async function getUserPhishingResults(clerkId) {
  try {
    if (!clerkId) return {};

    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) return {};

    const results = await prisma.phishingModuleResult.findMany({
      where: { userId: user.id },
    });

    const resultsMap = {};
    results.forEach((result) => {
      resultsMap[result.moduleId] = {
        score: result.score,
        total: result.totalScenarios,
        percentage: Math.round((result.score / result.totalScenarios) * 100),
        completedAt: result.completedAt,
      };
    });

    return resultsMap;
  } catch (error) {
    console.error("Error fetching user phishing results:", error);
    return {};
  }
}

export async function createPhishingScenarios() {
  try {
    console.log("🚀 Creating phishing scenarios...");

    // Usuń istniejące scenariusze
    await prisma.phishingScenario.deleteMany({});

    const scenarios = [
      {
        moduleId: "email-phishing",
        title: "Fałszywy alert bankowy",
        description: "Podejrzany email od banku",
        content: {
          subject: "PILNE: Twoje konto zostało zablokowane!",
          sender: "security@pkobp-bank.com",
          body: `Szanowny Kliencie,\n\nWykryliśmy podejrzaną aktywność na Twoim koncie. Z powodów bezpieczeństwa Twoje konto zostało tymczasowo zablokowane.\n\nAby odblokować konto, kliknij poniższy link i potwierdź swoje dane w ciągu 24 godzin:\n\nhttps://pko-bp-secure.verification-center.com/unlock\n\nJeśli nie podejmiesz działań, Twoje konto zostanie trwale zamknięte.\n\nZ poważaniem,\nZespół Bezpieczeństwa PKO BP`,
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
        order: 0,
      },
      {
        moduleId: "email-phishing",
        title: "Prawdziwy PayPal",
        description: "Oficjalny email od PayPal",
        content: {
          subject: "Potwierdzenie płatności PayPal - 2,847.99 PLN",
          sender: "service@paypal.com",
          body: `Dziękujemy za płatność PayPal\n\nSzczegóły transakcji:\nKwota: 2,847.99 PLN\nOdbiorca: TechStore Premium\nData: ${new Date().toLocaleDateString()}\n\nJeśli to nie była Twoja transakcja, kliknij tutaj aby anulować:\nhttps://paypal.com/cancel-transaction/ref=ps847291\n\nZespół PayPal`,
        },
        isPhishing: false,
        redFlags: [],
        explanation:
          "Ten email wygląda podejrzanie przez wysoką kwotę, ale adres nadawcy jest prawidłowy i link prowadzi do oficjalnej domeny PayPal.",
        difficulty: "medium",
        order: 1,
      },
      {
        moduleId: "email-phishing",
        title: "Fałszywa nagroda Amazon",
        description: "Oszustwo z nagrodą",
        content: {
          subject: "Gratulacje! Wygrałeś iPhone 15 Pro!",
          sender: "prizes@amazon-rewards.net",
          body: `Drogi Kliencie Amazon,\n\nGratulujemy! Zostałeś wybrany jako zwycięzca naszej miesięcznej loterii!\n\nTwoja nagroda: iPhone 15 Pro (wartość 5,999 PLN)\n\nAby odebrać nagrodę, wypełnij formularz w ciągu 48 godzin:\nhttps://amazon-rewards.net/claim-prize?user=winner2024\n\nWymagane informacje:\n- Pełne imię i nazwisko\n- Adres zamieszkania\n- Numer telefonu\n- Dane karty kredytowej (do weryfikacji tożsamości)\n\nZespół Amazon Rewards`,
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
        order: 2,
      },
    ];

    for (const scenario of scenarios) {
      await prisma.phishingScenario.create({
        data: scenario,
      });
    }

    console.log("✅ Phishing scenarios created successfully!");

    const count = await prisma.phishingScenario.count();
    console.log(`📊 Total scenarios: ${count}`);
  } catch (error) {
    console.error("❌ Failed to create phishing scenarios:", error);
  }
}
