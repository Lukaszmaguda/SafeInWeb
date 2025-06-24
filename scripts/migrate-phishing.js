const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function createPhishingScenarios() {
  try {
    console.log("🚀 Creating phishing scenarios...");

    // Najpierw usuń powiązane wyniki phishingu
    console.log("🗑️ Clearing phishing results...");
    await prisma.phishingResult.deleteMany({});

    // Następnie usuń wyniki modułów
    console.log("🗑️ Clearing phishing module results...");
    await prisma.phishingModuleResult.deleteMany({});

    // Na końcu usuń scenariusze
    console.log("🗑️ Clearing phishing scenarios...");
    await prisma.phishingScenario.deleteMany({});

    const scenarios = [
      // EMAIL PHISHING
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

      // WEBSITE PHISHING
      {
        moduleId: "website-phishing",
        title: "Fałszywa strona logowania banku",
        description: "Podrobiona strona logowania do banku",
        content: {
          url: "https://secure-pko-bp-login.com",
          body: "Prosimy o zalogowanie się, aby zweryfikować swoje konto.",
          pageTitle: "PKO Bank Polski - Logowanie",
          elements: [
            "Pole na login",
            "Pole na hasło",
            "Pole na PESEL",
            "Przycisk 'Zaloguj'",
          ],
        },
        isPhishing: true,
        redFlags: [
          "Adres URL nie jest oficjalną domeną banku (pkobp.pl)",
          "Brak certyfikatu SSL lub nieprawidłowy certyfikat",
          "Prośba o podanie numeru PESEL przy logowaniu",
          "Podejrzana domena secure-pko-bp-login.com",
        ],
        explanation:
          "To jest fałszywa strona, która próbuje wyłudzić dane logowania. Prawdziwy PKO BP ma domenę pkobp.pl i nie prosi o PESEL przy logowaniu.",
        difficulty: "medium",
        order: 0,
      },
      {
        moduleId: "website-phishing",
        title: "Fałszywy sklep internetowy",
        description:
          "Podrobiony sklep online oferujący podejrzanie tanie produkty",
        content: {
          url: "https://super-okazje-shop.com",
          body: "Kup teraz najnowszy smartfon za 1/3 ceny! Oferta ograniczona czasowo.",
          pageTitle: "Super Okazje - Najlepsze ceny w sieci!",
          elements: [
            "iPhone 15 Pro - 1999 PLN",
            "Samsung Galaxy S24 - 1499 PLN",
            "Tylko dziś!",
            "Kup teraz!",
          ],
        },
        isPhishing: true,
        redFlags: [
          "Podejrzanie niskie ceny (iPhone za 1999 PLN)",
          "Presja czasowa ('tylko dziś')",
          "Brak informacji o firmie i polityce zwrotów",
          "Nieznana domena super-okazje-shop.com",
        ],
        explanation:
          "To jest fałszywy sklep, który próbuje wyłudzić dane karty kredytowej. Ceny są nierealistycznie niskie.",
        difficulty: "easy",
        order: 1,
      },
      {
        moduleId: "website-phishing",
        title: "Prawdziwa strona banku",
        description: "Oficjalna strona banku z bezpiecznym połączeniem",
        content: {
          url: "https://www.pkobp.pl",
          body: "Witamy na oficjalnej stronie PKO BP. Zaloguj się, aby zarządzać swoim kontem.",
          pageTitle: "PKO Bank Polski",
          elements: [
            "Bezpieczne logowanie",
            "Certyfikat SSL",
            "Oficjalne logo",
            "Kontakt z bankiem",
          ],
        },
        isPhishing: false,
        redFlags: [],
        explanation:
          "To jest prawdziwa strona banku z poprawnym certyfikatem SSL i oficjalną domeną pkobp.pl.",
        difficulty: "medium",
        order: 2,
      },

      // SMS PHISHING
      {
        moduleId: "sms-phishing",
        title: "Fałszywa wiadomość SMS o blokadzie konta",
        description: "Oszustwo SMS informujące o blokadzie konta",
        content: {
          phone: "+48 123 456 789",
          message:
            "PKO BP: Twoje konto zostało zablokowane z powodu podejrzanej aktywności. Odblokuj natychmiast: http://pkobp-unlock.com/verify",
          time: "14:23",
        },
        isPhishing: true,
        redFlags: [
          "Link nie prowadzi do oficjalnej strony banku (pkobp.pl)",
          "Nieznany numer telefonu (+48 123 456 789)",
          "Presja czasowa i groźby",
          "Podejrzana domena pkobp-unlock.com",
        ],
        explanation:
          "To jest fałszywa wiadomość SMS. Prawdziwy bank wysyła SMS-y z oficjalnych numerów i nie umieszcza linków do logowania.",
        difficulty: "easy",
        order: 0,
      },
      {
        moduleId: "sms-phishing",
        title: "Fałszywy SMS o paczce",
        description: "Oszustwo SMS o niedostarczonej paczce",
        content: {
          phone: "+48 987 654 321",
          message:
            "InPost: Nie udało się dostarczyć Twojej paczki. Opłać 2.50 PLN za ponowną dostawę: http://inpost-delivery.net/pay",
          time: "09:15",
        },
        isPhishing: true,
        redFlags: [
          "Fałszywa domena (inpost-delivery.net zamiast inpost.pl)",
          "Prośba o płatność przez link w SMS",
          "Nieoficjalny numer nadawcy",
          "Mała kwota mająca uśpić czujność",
        ],
        explanation:
          "To klasyczny SMS phishing. InPost nie wysyła linków do płatności w SMS-ach i używa oficjalnej domeny inpost.pl.",
        difficulty: "medium",
        order: 1,
      },
      {
        moduleId: "sms-phishing",
        title: "Prawdziwa wiadomość SMS od banku",
        description: "Oficjalna wiadomość SMS z informacją o transakcji",
        content: {
          phone: "PKO BP",
          message:
            "Transakcja kartą *1234 na kwotę 150.00 PLN w sklepie BIEDRONKA została autoryzowana. Saldo: 2,847.50 PLN",
          time: "16:42",
        },
        isPhishing: false,
        redFlags: [],
        explanation:
          "To jest prawdziwa wiadomość SMS od banku. Zawiera tylko informację o transakcji, bez linków czy próśb o dane.",
        difficulty: "medium",
        order: 2,
      },
      {
        moduleId: "sms-phishing",
        title: "Fałszywy SMS o wygranej",
        description: "Oszustwo SMS o wygranej w loterii",
        content: {
          phone: "+48 555 123 456",
          message:
            "GRATULACJE! Wygrałeś 50,000 PLN w loterii Lotto! Aby odebrać nagrodę, kliknij: http://lotto-nagroda.com/claim i podaj swoje dane.",
          time: "20:30",
        },
        isPhishing: true,
        redFlags: [
          "Nierealistyczna wygrana bez udziału w loterii",
          "Fałszywa domena (lotto-nagroda.com)",
          "Prośba o podanie danych przez link",
          "Nieoficjalny numer nadawcy",
        ],
        explanation:
          "To oszustwo SMS. Totalizator Sportowy nie informuje o wygranych przez SMS z linkami i używa oficjalnych kanałów komunikacji.",
        difficulty: "easy",
        order: 3,
      },
    ];

    console.log("📝 Creating new scenarios...");
    for (const scenario of scenarios) {
      await prisma.phishingScenario.create({
        data: scenario,
      });
    }

    console.log("✅ Phishing scenarios created successfully!");

    const count = await prisma.phishingScenario.count();
    console.log(`📊 Total scenarios: ${count}`);

    const stats = await prisma.phishingScenario.groupBy({
      by: ["moduleId"],
      _count: { id: true },
    });

    console.log("📈 Scenarios per module:");
    stats.forEach((stat) => {
      console.log(`   ${stat.moduleId}: ${stat._count.id} scenarios`);
    });
  } catch (error) {
    console.error("❌ Failed to create phishing scenarios:", error);
  } finally {
    await prisma.$disconnect();
  }
}

createPhishingScenarios();
