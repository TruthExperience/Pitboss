export type EventStatus =
  | 'scheduled'
  | 'active'
  | 'completed'
  | 'cancelled'
  | 'postponed';

export type SessionType =
  | 'practice'
  | 'qualifying'
  | 'warmup'
  | 'race'
  | 'sprint';

export interface Event {
  id: string;
  leagueId: string;
  seasonId: string;
  name: string;
  round: number;
  track: string;
  trackLayoutId?: string;
  game: string;
  status: EventStatus;
  scheduledAt: string;
  completedAt?: string;
  discordAnnouncementId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Session {
  id: string;
  eventId: string;
  leagueId: string;
  type: SessionType;
  status: EventStatus;
  scheduledAt: string;
  completedAt?: string;
  durationMinutes?: number;
  lapCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface Result {
  id: string;
  sessionId: string;
  eventId: string;
  leagueId: string;
  driverId: string;
  teamId?: string;
  startPosition: number;
  finishPosition: number;
  fastestLap?: string;
  fastestLapTime?: string;
  totalTime?: string;
  lapsCompleted: number;
  lapsLed: number;
  status: 'finished' | 'dnf' | 'dns' | 'dsq' | 'dnq';
  points: number;
  bonusPoints: number;
  penaltyPoints: number;
  createdAt: string;
  updatedAt: string;
}
