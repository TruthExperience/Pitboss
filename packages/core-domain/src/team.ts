export type TeamStatus = 'active' | 'inactive' | 'suspended' | 'disbanded';

export type TeamRole = 'owner' | 'manager' | 'driver' | 'reserve' | 'coach';

export interface Team {
  id: string;
  leagueId: string;
  name: string;
  slug: string;
  shortName?: string;
  nationality?: string;
  status: TeamStatus;
  logoUrl?: string;
  bannerUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  discordRoleId?: string;
  carNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface TeamMembership {
  id: string;
  teamId: string;
  driverId: string;
  leagueId: string;
  role: TeamRole;
  seasonId?: string;
  joinedAt: string;
  leftAt?: string;
  isActive: boolean;
}

export interface TeamStanding {
  teamId: string;
  leagueId: string;
  seasonId: string;
  position: number;
  points: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  starts: number;
  dnfs: number;
  updatedAt: string;
}

export interface TeamStats {
  teamId: string;
  leagueId: string;
  seasonId?: string;
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  dnfs: number;
  points: number;
  winRate: number;
  podiumRate: number;
  avgFinish: number;
  updatedAt: string;
}
