import { Router } from 'express';
import type { League, Event, Driver, Session } from '@pitboss/core-domain';
import { db } from '@pitboss/db/src/client';
import { processAdvisor } from '@engines/advisor/src/advisorEngine';
import { processTelemetry } from '@engines/advisor/src/telemetryParser';
import { z } from 'zod';

export const router = Router();

// ── Health ────────────────────────────────────────────
router.get('/health', (_req, res) => {
  res.status(200).json({
    success: true,
    status: 'ok',
    service: 'pitboss-api',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV ?? 'development',
  });
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
      createdAt: new Date().toISO
