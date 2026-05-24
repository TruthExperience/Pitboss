import { supabase } from "@db/client";
import { ExamResult } from "../exam/examEngine";

// -----------------------------
// Types
// -----------------------------

export interface AdvisorRecommendation {
  category: string;
  issue: string;
  suggestion: string;
}

export interface AdvisorSession {
  userId: string;
  examId: string;
  recommendations: AdvisorRecommendation[];
  timestamp: string;
}

// -----------------------------
// Core Advisor Logic
// -----------------------------

export function generateRecommendations(result: ExamResult): AdvisorRecommendation[] {
  const recs: AdvisorRecommendation[] = [];

  for (const category in result.weakAreas) {
    const accuracy = result.weakAreas[category];

    // Basic recommendation logic (expandable)
    if (accuracy < 50) {
      recs.push({
        category,
        issue: "Severe weakness",
        suggestion: `Your accuracy in ${category} is very low (${accuracy}%). Focus on fundamentals and re-study the core rules.`,
      });
    } else if (accuracy < 70) {
      recs.push({
        category,
        issue: "Moderate weakness",
        suggestion: `Your accuracy in ${category} is below target (${accuracy}%). Review examples and practice more questions.`,
      });
    }
  }

  // If no weak areas
  if (recs.length === 0) {
    recs.push({
      category: "Overall",
      issue: "Strong performance",
      suggestion: "Great job! No major weak areas detected. Continue to the next certification level.",
    });
  }

  return recs;
}

// -----------------------------
// Supabase Persistence
// -----------------------------

export async function saveAdvisorSession(session: AdvisorSession) {
  const { data, error } = await supabase
    .from("advisor_sessions")
    .insert({
      user_id: session.userId,
      exam_id: session.examId,
      recommendations: session.recommendations,
      timestamp: session.timestamp,
    })
    .select()
    .single();

  if (error) {
    console.error("Error saving advisor session:", error);
    throw error;
  }

  return data;
}

// -----------------------------
// Full Pipeline
// -----------------------------

export async function processAdvisor(result: ExamResult) {
  const recommendations = generateRecommendations(result);

  const session: AdvisorSession = {
    userId: result.userId,
    examId: result.examId,
    recommendations,
    timestamp: new Date().toISOString(),
  };

  await saveAdvisorSession(session);

  return session;
}
