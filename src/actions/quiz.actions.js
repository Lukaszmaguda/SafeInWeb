"use server";

import prisma from "@/lib/prisma";

export async function getQuizzes() {
  try {
    const quizzes = await prisma.quiz.findMany({
      where: { isActive: true },
      include: {
        questions: true,
        _count: {
          select: { questions: true },
        },
      },
      orderBy: { createdAt: "asc" },
    });

    return quizzes.map((quiz) => ({
      id: quiz.slug,
      title: quiz.title,
      description: quiz.description,
      difficulty: quiz.difficulty,
      time: quiz.timeEstimate,
      questionsCount: quiz._count.questions,
    }));
  } catch (error) {
    console.error("Error fetching quizzes:", error);
    return [];
  }
}

export async function getQuizBySlug(slug) {
  try {
    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        questions: {
          include: {
            options: {
              orderBy: { order: "asc" },
            },
          },
          orderBy: { order: "asc" },
        },
      },
    });

    if (!quiz) return null;

    return {
      id: quiz.slug,
      title: quiz.title,
      description: quiz.description,
      questions: quiz.questions.map((question) => ({
        id: question.id,
        text: question.text,
        options: question.options.map((option) => ({
          id: option.id,
          text: option.text,
        })),
        correctOptionId: question.correctOptionId,
      })),
    };
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return null;
  }
}

export async function saveQuizResultByClerkId(clerkId, quizSlug, answers) {
  try {
    // Znajdź użytkownika po clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkId },
    });

    if (!user) {
      throw new Error(`User with clerkId ${clerkId} does not exist`);
    }

    // Pobierz quiz z bazy
    const quiz = await prisma.quiz.findUnique({
      where: { slug: quizSlug },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) throw new Error("Quiz not found");

    let correctCount = 0;
    const userAnswersData = [];

    // Sprawdź odpowiedzi
    for (const answer of answers) {
      const question = quiz.questions.find((q) => q.id === answer.questionId);
      const isCorrect = answer.selectedOptionId === question.correctOptionId;

      if (isCorrect) correctCount++;

      userAnswersData.push({
        userId: user.id,
        questionId: answer.questionId,
        selectedOptionId: answer.selectedOptionId,
        isCorrect,
      });
    }

    // Usuń poprzedni wynik jeśli istnieje
    await prisma.quizResult.deleteMany({
      where: {
        userId: user.id,
        quizId: quiz.id,
      },
    });

    // Zapisz nowy wynik
    const quizResult = await prisma.quizResult.create({
      data: {
        userId: user.id,
        quizId: quiz.id,
        score: correctCount,
        totalQuestions: quiz.questions.length,
        userAnswers: {
          create: userAnswersData,
        },
      },
    });

    return {
      score: correctCount,
      total: quiz.questions.length,
      percentage: Math.round((correctCount / quiz.questions.length) * 100),
    };
  } catch (error) {
    console.error("Error saving quiz result:", error);
    throw error;
  }
}

export async function createQuiz(quizData) {
  try {
    const quiz = await prisma.quiz.create({
      data: {
        title: quizData.title,
        description: quizData.description,
        difficulty: quizData.difficulty || "Łatwy",
        timeEstimate: quizData.timeEstimate || "10 min",
        slug: quizData.slug,
        questions: {
          create: quizData.questions.map((question, qIndex) => ({
            text: question.text,
            order: qIndex,
            correctOptionId: null,
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
    for (let i = 0; i < quizData.questions.length; i++) {
      const questionData = quizData.questions[i];
      const createdQuestion = quiz.questions[i];
      const correctOption = createdQuestion.options[questionData.correctIndex];

      await prisma.question.update({
        where: { id: createdQuestion.id },
        data: { correctOptionId: correctOption.id },
      });
    }

    return quiz;
  } catch (error) {
    console.error("Error creating quiz:", error);
    throw error;
  }
}
