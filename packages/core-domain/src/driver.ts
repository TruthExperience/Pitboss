export type LicenseClass =
  | 'rookie'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'elite';

export type DriverStatus = 'active' | 'inactive' | 'suspended' | 'banned';

export interface DiscordProfile {
  discordId: string;
  username: string;
  discriminator?: string;
  avatarUrl?: string;
  locale?: string;
}

export interface DriverLicense {
  id: string;
  driverId: string;
  leagueId: string;
  class: LicenseClass;
  points: number;
  issueDate: string;
  expiryDate?: string;
  suspendedUntil?: string;
  notes?: string;
}

export interface Driver {
  id: string;
  firstName: string;
  lastName: string;
  displayName?: string;
  nationality?: string;
  status: DriverStatus;
  licenseClass: LicenseClass;
  discord: DiscordProfile;
  teamId?: string;
  leagueIds: string[];
  avatarUrl?: string;
  bannerUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DriverStats {
  driverId: string;
  leagueId: string;
  seasonId?: string;
  starts: number;
  wins: number;
  podiums: number;
  poles: number;
  fastestLaps: number;
  dnfs: number;
  points: number;
  pointsPerRace: number;
  winRate: number;
  podiumRate: number;
  avgFinish: number;
  avgStart: number;
  updatedAt: string;
}

export interface DriverBan {
  id: string;
  driverId: string;
  leagueId: string;
  reason: string;
  issuedBy: string;
  issuedAt: string;
  expiresAt?: string;
  isPermanent: boolean;
  appealId?: string;
}
