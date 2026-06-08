export type CertificationStatus =
  | 'draft'
  | 'active'
  | 'archived'
  | 'deprecated';

export type QuestionType =
  | 'multiple_choice'
  | 'true_false'
  | 'multi_select';

export type AttemptStatus =
  | 'in_progress'
  | 'completed'
  | 'abandoned'
  | 'expired';

export type CertificationTier =
  | 'rookie'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'elite';

export interface Certification {
  id: string;
  leagueId: string;
  name: string;
  slug: string;
  description: string;
  tier: CertificationTier;
  status: CertificationStatus;
  passingScore: number;
  timeLimit?: number;
  maxAttempts?: number;
  cooldownHours?: number;
  isRequired: boolean;
  grantsLicenseClass?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Exam {
  id: string;
  certificationId: string;
  leagueId: string;
  title: string;
  description?: string;
  version: number;
  isActive: boolean;
  questionCount: number;
  questions?: Question[];
  createdAt: string;
  updatedAt: string;
}

export interface Question {
  id: string;
  examId: string;
  certificationId: string;
  leagueId: string;
  type: QuestionType;
  text: string;
  explanation?: string;
  points: number;
  order: number;
  imageUrl?: string;
  videoUrl?: string;
  aiGenerated?: boolean;
  options: AnswerOption[];
  createdAt: string;
  updatedAt: string;
}

export interface AnswerOption {
  id: string;
  questionId: string;
  text: string;
  isCorrect: boolean;
  order: number;
  explanation?: string;
}

export interface Attempt {
  id: string;
  examId: string;
  certificationId: string;
  leagueId: string;
  driverId: string;
  status: AttemptStatus;
  startedAt: string;
  completedAt?: string;
  expiresAt?: string;
  score?: number;
  passed?: boolean;
  answers?: AttemptAnswer[];
  timeSpentSeconds?: number;
  attemptNumber: number;
  createdAt: string;
  updatedAt: string;
}

export interface AttemptAnswer {
  id: string;
  attemptId: string;
  questionId: string;
  selectedOptionIds: string[];
  isCorrect?: boolean;
  pointsAwarded?: number;
  answeredAt: string;
}

export interface CertificationResult {
  attemptId: string;
  driverId: string;
  certificationId: string;
  leagueId: string;
  examId: string;
  score: number;
  passingScore: number;
  passed: boolean;
  totalQuestions: number;
  correctAnswers: number;
  timeSpentSeconds: number;
  completedAt: string;
  grantsLicenseClass?: string;
}

export interface CertificationStats {
  certificationId: string;
  leagueId: string;
  totalAttempts: number;
  passRate: number;
  avgScore: number;
  avgTimeSeconds: number;
  totalPassed: number;
  totalFailed: number;
  updatedAt: string;
}
