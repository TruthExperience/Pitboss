import { Router, Request, Response } from 'express';
import type { League, Event, Driver, Session } from '@pitboss/core-domain';
import { db } from '@pitboss/db/src/client';
import { processAdvisor } from '@engines/advisor/src/advisorEngine';
import { processTelemetry } from '@engines/advisor/src/telemetryParser';
import { z } from 'zod';

export const router: Router = Router();

// ── Health ────────────────────────────────────────────
router.get('/health', (_req: Request, res: Response) => {
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
router.get('/leagues', (_req: Request, res: Response) => {
  const leagues: League[] = [
    {
      id: 'league-wsc',
      name: 'World Series Championship',
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
    {
      id: 'league-srh',
      name: 'SRH',
      slug: 'srh',
      description: 'SRH racing league',
      status: 'active',
      tier: 'semi-pro',
      game: 'iRacing',
      discordGuildId: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  res.json(leagues);
});

// ── Events ────────────────────────────────────────────
router.get('/events', (_req: Request, res: Response) => {
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
router.get('/drivers', (_req: Request, res: Response) => {
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
router.get('/sessions', (_req: Request, res: Response) => {
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

// ── Exam ──────────────────────────────────────────────
const examSubmissionSchema = z.object({
  user_id: z.string().uuid(),
  answers: z.record(z.any()),
});

router.post('/exam/submit', async (req: Request, res: Response) => {
  try {
    const { user_id, answers } = examSubmissionSchema.parse(req.body);

    const { data: questions, error: questionsError } = await db
      .from('exam_questions')
      .select('*');

    if (questionsError || !questions) {
      return res.status(500).json({ success: false, error: 'Failed to load questions' });
    }

    if (questions.length === 0) {
      return res.status(500).json({ success: false, error: 'No exam questions found' });
    }

    let correct = 0;
    const weakAreas: string[] = [];

    for (const question of questions) {
      const userAnswer = answers[question.id];
      if (userAnswer === question.answer) {
        correct++;
      } else if (question.category) {
        weakAreas.push(question.category as string);
      }
    }

    const total = questions.length;
    const score = Math.round((correct / total) * 100);
    const passed = score >= 80;

    const { data: result, error: insertError } = await db
      .from('exam_results')
      .insert({
        driver_id: user_id,
        score,
        passed,
        weak_areas: [...new Set(weakAreas)],
      })
      .select()
      .single();

    if (insertError) {
      return res.status(500).json({ success: false, error: 'Failed to save exam result' });
    }

    return res.json({
      success: true,
      data: {
        score,
        passed,
        correct,
        incorrect: total - correct,
        weakAreas: [...new Set(weakAreas)],
        result,
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid request payload', details: error.flatten() });
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ── Advisor ───────────────────────────────────────────
router.post('/advisor/run', async (req: Request, res: Response) => {
  try {
    const { examResult, driver_id } = req.body as {
      examResult: Parameters<typeof processAdvisor>[0];
      driver_id: string;
    };

    if (!examResult || !driver_id) {
      return res.status(400).json({ success: false, error: 'Missing examResult or driver_id' });
    }

    const session = await processAdvisor(examResult);

    const { data, error } = await db
      .from('advisor_sessions')
      .insert({ driver_id, question: session.question, answer: session.answer })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to save advisor session' });
    }

    return res.json({ success: true, data });
  } catch (err) {
    console.error('Advisor error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ── Telemetry ─────────────────────────────────────────
const telemetrySchema = z.object({
  driver_id: z.string().uuid(),
  session: z.any(),
});

router.post('/telemetry/upload', async (req: Request, res: Response) => {
  try {
    const { driver_id, session } = telemetrySchema.parse(req.body);
    const analysis = await processTelemetry(session);

    if (!analysis?.summary || !analysis?.metrics) {
      return res.status(500).json({ success: false, error: 'Telemetry engine returned invalid analysis' });
    }

    const { data, error } = await db
      .from('telemetry_analysis')
      .insert({
        driver_id,
        summary: analysis.summary,
        metrics: analysis.metrics,
        analyzed_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      return res.status(500).json({ success: false, error: 'Failed to save telemetry analysis' });
    }

    return res.status(201).json({ success: true, data });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid request payload', details: error.flatten() });
    }
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// ── Admin: Driver Detail ──────────────────────────────
const driverIdSchema = z.string().uuid();

router.get('/admin/drivers/:id', async (req: Request, res: Response) => {
  try {
    const driverId = driverIdSchema.parse(req.params.id);

    const [
      driverResult,
      activityResult,
      examsResult,
      advisorResult,
      telemetryResult,
      certsResult,
    ] = await Promise.all([
      db.from('drivers').select('*').eq('id', driverId).single(),
      db.from('driver_activity').select('*').eq('driver_id', driverId).single(),
      db.from('exam_results').select('*').eq('driver_id', driverId).order('created_at', { ascending: false }),
      db.from('advisor_sessions').select('*').eq('driver_id', driverId).order('created_at', { ascending: false }),
      db.from('telemetry_analysis').select('*').eq('driver_id', driverId).order('created_at', { ascending: false }),
      db.from('driver_certifications').select('*').eq('driver_id', driverId).order('earned_at', { ascending: false }),
    ]);

    if (driverResult.error || !driverResult.data) {
      return res.status(404).json({ success: false, error: 'Driver not found' });
    }

    return res.status(200).json({
      success: true,
      data: {
        driver: driverResult.data,
        activity: activityResult.data ?? null,
        exams: examsResult.data ?? [],
        advisor: advisorResult.data ?? [],
        telemetry: telemetryResult.data ?? [],
        certifications: certsResult.data ?? [],
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ success: false, error: 'Invalid driver ID format' });
    }
    return res.status(500).json({ success: false, error: 'Failed to load driver profile' });
  }
});
