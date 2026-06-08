export type LeagueStatus = 'active' | 'inactive' | 'archived';

export type LeagueTier = 'open' | 'semi-pro' | 'pro' | 'elite';

export interface League {
  id: string;
  name: string;
  slug: string;
  description?: string;
  status: LeagueStatus;
  tier: LeagueTier;
  game: string;
  logoUrl?: string;
  bannerUrl?: string;
  discordGuildId?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Season {
  id: string;
  leagueId: string;
  name: string;
  number: number;
  status: 'upcoming' | 'active' | 'completed';
  startDate: string;
  endDate?: string;
  createdAt: string;
  updatedAt: string;
}
