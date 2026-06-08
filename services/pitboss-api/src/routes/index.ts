import { Router } from 'express';
import type {
  League,
  Event,
  Driver,
  Session,
  IncidentReport,
} from '@pitboss/core-domain';

export const router = Router();

// ── Health ────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'pitboss-api', timestamp: new Date().toISOString() });
});

// ── Leagues ───────────────────────────────────────────
router.get('/leagues', (_req, res) => {
  const leagues: League[] = [
    {
      id: 'league-wsc',
      name: 'World Sim Championship',
      slug: 'wsc',
      description: 'Premier sim racing league',
      status: 'active',
      tier: 'elite',
      game: 'iRacing',
      discordGuildId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'league-trl',
      name: 'Truth Racing League',
      slug: 'trl',
      description: 'Community sim racing league',
      status: 'active',
      tier: 'pro',
      game: 'iRacing',
      discordGuildId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  res.json(leagues);
});

// ── Events ────────────────────────────────────────────
router.get('/events', (_req, res) => {
  const events: Event[] = [
    {
      id: 'event-1',
      leagueId: 'league-wsc',
      seasonId: 'season-1',
      name: 'Season Opener',
      round: 1,
      track: 'Daytona International Speedway',
      game: 'iRacing',
      status: 'scheduled',
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  res.json(events);
});

// ── Drivers ───────────────────────────────────────────
router.get('/drivers', (_req, res) => {
  const drivers: Driver[] = [
    {
      id: 'driver-1',
      firstName: 'Andre',
      lastName: 'Truth',
      status: 'active',
      licenseClass: 'elite',
      discord: {
        discordId: '',
        username: 'TruthExperience',
      },
      leagueIds: ['league-wsc', 'league-trl'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  res.json(drivers);
});

// ── Sessions ──────────────────────────────────────────
router.get('/sessions', (_req, res) => {
  const sessions: Session[] = [
    {
      id: 'session-1',
      eventId: 'event-1',
      leagueId: 'league-wsc',
      type: 'race',
      status: 'scheduled',
      scheduledAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  res.json(sessions);
});

// ── Incidents ─────────────────────────────────────────
router.get('/incidents', (_req, res) => {
  const incidents: IncidentReport[] = [];
  res.json(incidents);
});
