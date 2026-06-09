export interface ExamResult {
  score: number;
  passed: boolean;
  correct: number;
  incorrect: number;
  weakAreas: string[];
}

export interface AdvisorSession {
  question: string;
  answer: string;
  weakAreas: string[];
  recommendedTopics: string[];
  generatedAt: string;
}

export async function processAdvisor(
  examResult: ExamResult
): Promise<AdvisorSession> {
  // Stub — AI provider wired in Phase 6
  const weakAreaSummary =
    examResult.weakAreas.length > 0
      ? `You struggled with: ${examResult.weakAreas.join(', ')}.`
      : 'No specific weak areas identified.';

  return {
    question: `Your exam score was ${examResult.score}%. ${weakAreaSummary} What areas would you like to focus on?`,
    answer: `Based on your performance, I recommend reviewing: ${
      examResult.weakAreas.length > 0
        ? examResult.weakAreas.join(', ')
        : 'general racing rules and regulations'
    }.`,
    weakAreas: examResult.weakAreas,
    recommendedTopics:
      examResult.weakAreas.length > 0
        ? examResult.weakAreas
        : ['racing rules', 'flag signals', 'incident reporting'],
    generatedAt: new Date().toISOString(),
  };
}
