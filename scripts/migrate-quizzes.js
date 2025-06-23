const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const quizData = {
  security_basics: {
    title: "Podstawy bezpieczeństwa w sieci",
    description:
      "Poznaj podstawowe zasady bezpiecznego korzystania z internetu.",
    difficulty: "Łatwy",
    timeEstimate: "10 min",
    slug: "security_basics",
    questions: [
      {
        text: "Co to jest silne hasło?",
        options: [
          { text: "Hasło zawierające imię i datę urodzenia" },
          {
            text: "Hasło składające się z minimum 8 znaków, zawierające duże i małe litery, cyfry oraz znaki specjalne",
          },
          { text: "Hasło, które jest łatwe do zapamiętania, np. '123456'" },
          { text: "Hasło, które jest takie samo dla wszystkich kont" },
        ],
        correctIndex: 1,
      },
      {
        text: "Czym jest phishing?",
        options: [
          { text: "Rodzaj wirusa komputerowego" },
          { text: "Metoda łowienia ryb przez internet" },
          {
            text: "Technika oszustwa polegająca na podszywaniu się pod zaufane instytucje w celu wyłudzenia danych",
          },
          { text: "Sposób na szybkie pobieranie plików z internetu" },
        ],
        correctIndex: 2,
      },
      {
        text: "Które z poniższych działań zwiększa bezpieczeństwo konta online?",
        options: [
          { text: "Używanie tego samego hasła do wszystkich kont" },
          { text: "Zapisywanie haseł na kartce przyklejonej do monitora" },
          { text: "Udostępnianie swoich danych logowania zaufanym znajomym" },
          { text: "Włączenie weryfikacji dwuetapowej (2FA)" },
        ],
        correctIndex: 3,
      },
      {
        text: "Co to jest złośliwe oprogramowanie (malware)?",
        options: [
          { text: "Program antywirusowy" },
          {
            text: "Oprogramowanie, które ma na celu uszkodzenie lub uzyskanie nieautoryzowanego dostępu do systemu",
          },
          { text: "Program do tworzenia kopii zapasowych" },
          { text: "Oprogramowanie do optymalizacji działania komputera" },
        ],
        correctIndex: 1,
      },
      {
        text: "Jak rozpoznać bezpieczną stronę internetową?",
        options: [
          { text: "Ma dużo reklam i wyskakujących okienek" },
          { text: "Adres URL zaczyna się od 'http://'" },
          { text: "Adres URL zaczyna się od 'https://' i ma symbol kłódki" },
          { text: "Ma bardzo kolorowy interfejs" },
        ],
        correctIndex: 2,
      },
    ],
  },

  password_security: {
    title: "Bezpieczeństwo haseł",
    description: "Dowiedz się jak tworzyć silne hasła i chronić swoje konta.",
    difficulty: "Średni",
    timeEstimate: "12 min",
    slug: "password_security",
    questions: [
      {
        text: "Ile minimum znaków powinno mieć bezpieczne hasło?",
        options: [
          { text: "4 znaki" },
          { text: "6 znaków" },
          { text: "8 znaków" },
          { text: "12 znaków" },
        ],
        correctIndex: 3,
      },
      {
        text: "Co to jest menedżer haseł?",
        options: [
          { text: "Program do hakowania haseł" },
          {
            text: "Aplikacja do bezpiecznego przechowywania i generowania haseł",
          },
          { text: "Funkcja przeglądarki do zapamiętywania haseł" },
          { text: "Sposób na odzyskiwanie zapomnianych haseł" },
        ],
        correctIndex: 1,
      },
      {
        text: "Które hasło jest najbezpieczniejsze?",
        options: [
          { text: "password123" },
          { text: "Jan1990" },
          { text: "Tr0ub4dor&3" },
          { text: "qwerty" },
        ],
        correctIndex: 2,
      },
      {
        text: "Jak często powinieneś zmieniać hasła do ważnych kont?",
        options: [
          { text: "Codziennie" },
          { text: "Co tydzień" },
          {
            text: "Co 3-6 miesięcy lub gdy podejrzewasz naruszenie bezpieczeństwa",
          },
          { text: "Nigdy, jeśli hasło jest silne" },
        ],
        correctIndex: 2,
      },
      {
        text: "Co to jest atak słownikowy na hasła?",
        options: [
          {
            text: "Próba złamania hasła przez sprawdzanie popularnych haseł i słów ze słownika",
          },
          { text: "Metoda tworzenia haseł na podstawie słownika" },
          { text: "Sposób na zapamiętywanie haseł" },
          { text: "Technika szyfrowania haseł" },
        ],
        correctIndex: 0,
      },
    ],
  },

  social_media_safety: {
    title: "Bezpieczeństwo w mediach społecznościowych",
    description:
      "Jak bezpiecznie korzystać z platform społecznościowych i chronić swoją prywatność.",
    difficulty: "Średni",
    timeEstimate: "15 min",
    slug: "social_media_safety",
    questions: [
      {
        text: "Które informacje NIE powinny być publiczne w Twoim profilu na mediach społecznościowych?",
        options: [
          { text: "Twoje hobby i zainteresowania" },
          { text: "Pełny adres zamieszkania i numer telefonu" },
          { text: "Zdjęcia z wakacji" },
          { text: "Nazwa szkoły lub uczelni" },
        ],
        correctIndex: 1,
      },
      {
        text: "Co to jest oversharing w kontekście mediów społecznościowych?",
        options: [
          { text: "Udostępnianie zbyt wielu osobistych informacji online" },
          { text: "Dodawanie zbyt wielu zdjęć" },
          { text: "Komentowanie postów innych osób" },
          { text: "Używanie hashtag-ów" },
        ],
        correctIndex: 0,
      },
      {
        text: "Jak powinieneś reagować na podejrzane wiadomości prywatne od nieznanych osób?",
        options: [
          { text: "Odpowiedzieć grzecznie" },
          { text: "Zignorować i zgłosić jako spam" },
          { text: "Kliknąć w załączone linki, aby sprawdzić co to" },
          { text: "Przekazać wiadomość znajomym" },
        ],
        correctIndex: 1,
      },
      {
        text: "Które ustawienia prywatności są najbezpieczniejsze?",
        options: [
          { text: "Profil całkowicie publiczny" },
          { text: "Profil prywatny, widoczny tylko dla znajomych" },
          { text: "Profil widoczny dla znajomych znajomych" },
          { text: "Profil widoczny dla wszystkich w tej samej lokalizacji" },
        ],
        correctIndex: 1,
      },
      {
        text: "Co powinieneś zrobić przed dodaniem kogoś do znajomych?",
        options: [
          { text: "Dodać od razu każdą osobę, która wyśle zaproszenie" },
          { text: "Sprawdzić czy znasz tę osobę w rzeczywistości" },
          { text: "Sprawdzić ile ma znajomych" },
          { text: "Sprawdzić czy ma ładne zdjęcie profilowe" },
        ],
        correctIndex: 1,
      },
    ],
  },
};

async function migrateQuizzes() {
  try {
    console.log("🚀 Starting quiz migration...");

    // Usuń istniejące quizy (opcjonalnie)
    await prisma.quiz.deleteMany({});
    console.log("🗑️ Cleared existing quizzes");

    for (const [key, quiz] of Object.entries(quizData)) {
      console.log(`📝 Migrating quiz: ${quiz.title}`);

      const createdQuiz = await prisma.quiz.create({
        data: {
          title: quiz.title,
          description: quiz.description,
          difficulty: quiz.difficulty,
          timeEstimate: quiz.timeEstimate,
          slug: quiz.slug,
          questions: {
            create: quiz.questions.map((question, qIndex) => ({
              text: question.text,
              order: qIndex,
              options: {
                create: question.options.map((option, oIndex) => ({
                  text: option.text,
                  order: oIndex,
                })),
              },
            })),
          },
        },
        include: {
          questions: {
            include: {
              options: true,
            },
          },
        },
      });

      // Ustaw poprawne odpowiedzi
      for (let i = 0; i < quiz.questions.length; i++) {
        const questionData = quiz.questions[i];
        const createdQuestion = createdQuiz.questions[i];
        const correctOption =
          createdQuestion.options[questionData.correctIndex];

        await prisma.question.update({
          where: { id: createdQuestion.id },
          data: { correctOptionId: correctOption.id },
        });
      }

      console.log(`✅ Quiz "${quiz.title}" migrated successfully`);
    }

    console.log("🎉 All quizzes migrated successfully!");

    // Wyświetl podsumowanie
    const quizCount = await prisma.quiz.count();
    const questionCount = await prisma.question.count();
    console.log(`📊 Summary: ${quizCount} quizzes, ${questionCount} questions`);
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}

migrateQuizzes();
