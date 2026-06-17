export type IncidentType =
  | 'collision'
  | 'dangerous_driving'
  | 'cutting_track'
  | 'false_start'
  | 'pit_lane_violation'
  | 'blue_flag_violation'
  | 'unsportsmanlike_conduct'
  | 'technical_infringement'
  | 'other';

export type IncidentStatus =
  | 'reported'
  | 'under_review'
  | 'decision_made'
  | 'appealed'
  | 'closed';

export type PenaltyType =
  | 'time_penalty'
  | 'grid_penalty'
  | 'drive_through'
  | 'stop_go'
  | 'disqualification'
  | 'points_deduction'
  | 'license_penalty'
  | 'warning'
  | 'no_further_action';

export type AppealStatus =
  | 'submitted'
  | 'under_review'
  | 'upheld'
  | 'rejected'
  | 'withdrawn';

export interface IncidentReport {
  id: string;
  leagueId: string;
  eventId: string;
  sessionId: string;
  reportedBy: string;
  reportedAt: string;
  type: IncidentType;
  status: IncidentStatus;
  lap?: number;
  corner?: string;
  description: string;
  involvedDriverIds: string[];
  videoUrl?: string;
  screenshotUrls?: string[];
  assignedStewardId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StewardDecision {
  id: string;
  incidentId: string;
  leagueId: string;
  stewardId: string;
  decidedAt: string;
  penalty: PenaltyType;
  penaltyValue?: number;
  targetDriverId: string;
  reasoning: string;
  aiSuggested?: boolean;
  aiSuggestionAccepted?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface PenaltyTemplate {
  id: string;
  leagueId: string;
  name: string;
  incidentType: IncidentType;
  penaltyType: PenaltyType;
  defaultValue?: number;
  minValue?: number;
  maxValue?: number;
  description: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Appeal {
  id: string;
  decisionId: string;
  incidentId: string;
  leagueId: string;
  submittedBy: string;
  submittedAt: string;
  status: AppealStatus;
  grounds: string;
  evidence?: string;
  videoUrl?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  outcome?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StewardingStats {
  leagueId: string;
  seasonId?: string;
  totalIncidents: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  totalAppeals: number;
  upheldAppeals: number;
  rejectedAppeals: number;
  avgResolutionHours: number;
  mostCommonIncidentType: IncidentType;
  updatedAt: string;
}
