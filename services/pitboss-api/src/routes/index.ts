import { Router } from 'express';
import type { League, Event, Driver } from '@pitboss/core-domain';

export const router = Router();

router.get('/health', (_req, res) => {
  res.json({ ok: true });
});

router.get('/leagues', (_req, res) => {
  const leagues: League[] = [
    {
      id: 'league-1',
      name: 'WSC',
      slug: 'wsc'
    }
  ];

  res.json(leagues);
});

router.get('/events', (_req, res) => {
  const events: Event[] = [
    {
      id: 'event-1',
      leagueId: 'league-1',
      name: 'Season Opener',
      startsAt: new Date().toISOString()
    }
  ];

  res.json(events);
});

router.get('/drivers', (_req, res) => {
  const drivers: Driver[] = [
    {
      id: 'driver-1',
      firstName: 'Alex',
      lastName: 'Stone'
    }
  ];

  res.json(drivers);
});
