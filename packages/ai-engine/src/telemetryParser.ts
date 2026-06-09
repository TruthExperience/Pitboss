export interface TelemetrySession {
  lapTimes?: number[];
  topSpeed?: number;
  avgSpeed?: number;
  brakePoints?: number[];
  throttleData?: number[];
  sectors?: SectorData[];
  trackName?: string;
  carName?: string;
  sessionType?: string;
}

export interface SectorData {
  sector: number;
  time: number;
  minSpeed: number;
  maxSpeed: number;
}

export interface TelemetryMetrics {
  bestLap?: number;
  avgLap?: number;
  consistency?: number;
  topSpeed?: number;
  avgThrottle?: number;
  avgBrake?: number;
  totalLaps?: number;
}

export interface TelemetryAnalysis {
  summary: string;
  metrics: TelemetryMetrics;
  insights: string[];
  analyzedAt: string;
}

export async function processTelemetry(
  session: TelemetrySession
): Promise<TelemetryAnalysis> {
  // Stub — real telemetry processing wired in Phase 6
  const lapTimes = session.lapTimes ?? [];
  const bestLap = lapTimes.length > 0 ? Math.min(...lapTimes) : undefined;
  const avgLap =
    lapTimes.length > 0
      ? lapTimes.reduce((a, b) => a + b, 0) / lapTimes.length
      : undefined;

  const consistency =
    bestLap && avgLap
      ? Math.round((1 - (avgLap - bestLap) / bestLap) * 100)
      : undefined;

  const metrics: TelemetryMetrics = {
    bestLap,
    avgLap,
    consistency,
    topSpeed: session.topSpeed,
    totalLaps: lapTimes.length,
  };

  const insights: string[] = [];

  if (consistency !== undefined) {
    if (consistency >= 95) {
      insights.push('Excellent consistency across laps.');
    } else if (consistency >= 85) {
      insights.push('Good consistency — minor improvements possible.');
    } else {
      insights.push('Consistency needs work — focus on repeatable braking points.');
    }
  }

  if (session.topSpeed) {
    insights.push(`Top speed recorded: ${session.topSpeed} km/h.`);
  }

  return {
    summary: `Telemetry analysis complete for ${session.trackName ?? 'unknown track'}. ${
      lapTimes.length
    } laps recorded.`,
    metrics,
    insights,
    analyzedAt: new Date().toISOString(),
  };
}
