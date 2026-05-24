import { supabase } from "@db/client";

// -----------------------------
// Types
// -----------------------------

export interface ExamQuestion {
  id: string;
  correctAnswer: string;
  category: string;
}

export interface ExamSubmission {
  examId: string;
  userId: string;
  answers: Record<string, string>; // questionId -> userAnswer
}

export interface ExamResult {
  examId: string;
  userId: string;
  score: number;
  passed: boolean;
  totalQuestions: number;
  correct: number;
  incorrect: number;
  weakAreas: Record<string, number>;
  timestamp: string;
}

// -----------------------------
// Core Scoring Logic
// -----------------------------

export function scoreExam(
  questions: ExamQuestion[],
  submission: ExamSubmission
): ExamResult {
  let correct = 0;
  let incorrect = 0;

  const categoryTotals: Record<string, { correct: number; total: number }> = {};

  for (const q of questions) {
    const userAnswer = submission.answers[q.id];
    const isCorrect = userAnswer === q.correctAnswer;

    if (!categoryTotals[q.category]) {
      categoryTotals[q.category] = { correct: 0, total: 0 };
    }

    categoryTotals[q.category].total++;

    if (isCorrect) {
      correct++;
      categoryTotals[q.category].correct++;
    } else {
      incorrect++;
    }
  }

  const score = Math.round((correct / questions.length) * 100);

  // Weak areas = categories where accuracy < 70%
  const weakAreas: Record<string, number> = {};
  for (const category in categoryTotals) {
    const { correct, total } = categoryTotals[category];
    const accuracy = Math.round((correct / total) * 100);

    if (accuracy < 70) {
      weakAreas[category] = accuracy;
    }
  }

  return {
    examId: submission.examId,
    userId: submission.userId,
    score,
    passed: score >= 80,
    totalQuestions: questions.length,
    correct,
    incorrect,
    weakAreas,
    timestamp: new Date().toISOString(),
  };
}

// -----------------------------
// Supabase Persistence
// -----------------------------

export async function saveExamResult(result: ExamResult) {
  const { data, error } = await supabase
    .from("exam_attempts")
    .insert({
      exam_id: result.examId,
      user_id: result.userId,
      score: result.score,
      passed: result.passed,
      total_questions: result.totalQuestions,
      correct: result.correct,
      incorrect: result.incorrect,
      weak_areas: result.weakAreas,
      timestamp: result.timestamp,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving exam result:", error);
    throw error;
  }

  return data;
}

// -----------------------------
// Full Pipeline
// -----------------------------

export async function processExam(
  questions: ExamQuestion[],
  submission: ExamSubmission
) {
  const result = scoreExam(questions, submission);
  await saveExamResult(result);
  return result;
}
