const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPhishingScenarios() {
  try {
    console.log("🚀 Creating phishing scenarios...");

    await prisma.phishingScenario.deleteMany({});

    const scenarios = [
      {
        moduleId: "email-phishing",
        title: "Fałszywy alert bankowy",
        description: "Podejrzany email od banku",
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
        order: 0,
      },
      {
        moduleId: "email-phishing",
        title: "Prawdziwy PayPal",
        description: "Oficjalny email od PayPal",
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
        order: 1,
      },
      {
        moduleId: "email-phishing",
        title: "Fałszywa nagroda Amazon",
        description: "Oszustwo z nagrodą",
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
  } finally {
    await prisma.$disconnect();
  }
}

createPhishingScenarios();
