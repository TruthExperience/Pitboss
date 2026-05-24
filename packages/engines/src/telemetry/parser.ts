import { supabase } from "@db/client";

// -----------------------------
// Types
// -----------------------------

export interface TelemetryPoint {
  lap: number;
  distance: number;
  speed: number;
  throttle: number;
  brake: number;
  gear: number;
  steering: number;
  rpm: number;
}

export interface TelemetrySession {
  userId: string;
  sessionId: string;
  data: TelemetryPoint[];
}

export interface TelemetryAnalysis {
  sessionId: string;
  userId: string;
  avgBrakeConsistency: number;
  avgThrottleDiscipline: number;
  cornerEntryVariance: number;
  cornerExitVariance: number;
  lapConsistency: number;
  oversteerRate: number;
  understeerRate: number;
  timestamp: string;
}

// -----------------------------
// Core Analysis Functions
// -----------------------------

function calculateBrakeConsistency(data: TelemetryPoint[]) {
  const brakeValues = data.map(p => p.brake);
  const avg = brakeValues.reduce((a, b) => a + b, 0) / brakeValues.length;
  const variance =
    brakeValues.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
    brakeValues.length;

  return Math.max(0, 100 - variance * 2);
}

function calculateThrottleDiscipline(data: TelemetryPoint[]) {
  const throttleValues = data.map(p => p.throttle);
  const avg = throttleValues.reduce((a, b) => a + b, 0) / throttleValues.length;
  const variance =
    throttleValues.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
    throttleValues.length;

  return Math.max(0, 100 - variance * 1.5);
}

function calculateCornerVariance(data: TelemetryPoint[]) {
  const entries = data.filter(p => Math.abs(p.steering) > 10 && p.brake > 20);
  const exits = data.filter(p => Math.abs(p.steering) > 10 && p.throttle > 20);

  const entrySpeeds = entries.map(p => p.speed);
  const exitSpeeds = exits.map(p => p.speed);

  const entryVar =
    entrySpeeds.reduce((a, b) => a + Math.pow(b - (entrySpeeds.reduce((a, b) => a + b, 0) / entrySpeeds.length), 2), 0) /
    (entrySpeeds.length || 1);

  const exitVar =
    exitSpeeds.reduce((a, b) => a + Math.pow(b - (exitSpeeds.reduce((a, b) => a + b, 0) / exitSpeeds.length), 2), 0) /
    (exitSpeeds.length || 1);

  return {
    entry: Math.min(100, 100 - entryVar),
    exit: Math.min(100, 100 - exitVar),
  };
}

function calculateLapConsistency(data: TelemetryPoint[]) {
  const laps = [...new Set(data.map(p => p.lap))];
  const lapAverages = laps.map(lap => {
    const lapPoints = data.filter(p => p.lap === lap);
    return lapPoints.reduce((a, b) => a + b.speed, 0) / lapPoints.length;
  });

  const avg = lapAverages.reduce((a, b) => a + b, 0) / lapAverages.length;
  const variance =
    lapAverages.reduce((a, b) => a + Math.pow(b - avg, 2), 0) /
    lapAverages.length;

  return Math.max(0, 100 - variance * 3);
}

function calculateSteeringBalance(data: TelemetryPoint[]) {
  const oversteer = data.filter(p => p.steering < -15).length;
  const understeer = data.filter(p => p.steering > 15).length;
  const total = data.length;

  return {
    oversteerRate: Math.round((oversteer / total) * 100),
    understeerRate: Math.round((understeer / total) * 100),
  };
}

// -----------------------------
// Full Telemetry Analysis
// -----------------------------

export function analyzeTelemetry(session: TelemetrySession): TelemetryAnalysis {
  const { data, userId, sessionId } = session;

  const brakeConsistency = calculateBrakeConsistency(data);
  const throttleDiscipline = calculateThrottleDiscipline(data);
  const cornerVariance = calculateCornerVariance(data);
  const lapConsistency = calculateLapConsistency(data);
  const steering = calculateSteeringBalance(data);

  return {
    sessionId,
    userId,
    avgBrakeConsistency: brakeConsistency,
    avgThrottleDiscipline: throttleDiscipline,
    cornerEntryVariance: cornerVariance.entry,
    cornerExitVariance: cornerVariance.exit,
    lapConsistency,
    oversteerRate: steering.oversteerRate,
    understeerRate: steering.understeerRate,
    timestamp: new Date().toISOString(),
  };
}

// -----------------------------
// Supabase Persistence
// -----------------------------

export async function saveTelemetryAnalysis(analysis: TelemetryAnalysis) {
  const { data, error } = await supabase
    .from("telemetry_analysis")
    .insert(analysis)
    .select()
    .single();

  if (error) {
    console.error("Error saving telemetry analysis:", error);
    throw error;
  }

  return data;
}

// -----------------------------
// Full Pipeline
// -----------------------------

export async function processTelemetry(session: TelemetrySession) {
  const analysis = analyzeTelemetry(session);
  await saveTelemetryAnalysis(analysis);
  return analysis;
}
