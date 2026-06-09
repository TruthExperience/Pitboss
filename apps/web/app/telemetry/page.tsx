"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

interface TelemetryMetrics {
  bestLap?: number;
  avgLap?: number;
  consistency?: number;
  topSpeed?: number;
  totalLaps?: number;
}

interface TelemetryResult {
  summary: string;
  metrics: TelemetryMetrics;
  insights: string[];
  analyzedAt: string;
}

export default function TelemetryPage() {
  const { session, isAuthenticated, loading: authLoading } = useAuth();

  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<TelemetryResult | null>(null);
  const [error, setError] = useState("");

  async function uploadTelemetry() {
    if (!file || !session) return;

    setUploading(true);
    setError("");
    setResult(null);

    try {
      const text = await file.text();
      const session_data = JSON.parse(text);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/telemetry/upload`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            driver_id: session.user.id,
            session: session_data,
          }),
        }
      );

      if (!res.ok) {
        throw new Error("Failed to upload telemetry");
      }

      const data = await res.json();
      setResult(data.data);
    } catch (err) {
      console.error("Telemetry upload error:", err);
      setError(
        err instanceof Error ? err.message : "Failed to upload telemetry"
      );
    } finally {
      setUploading(false);
    }
  }

  if (authLoading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">Please log in</h1>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Telemetry Upload</h1>

        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded space-y-4">
          <p className="text-neutral-400">
            Upload your telemetry JSON file to get AI-powered analysis
            and insights.
          </p>

          <input
            type="file"
            accept=".json"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-neutral-400
              file:mr-4 file:py-2 file:px-4
              file:rounded file:border-0
              file:bg-blue-600 file:text-white
              hover:file:bg-blue-500 cursor-pointer"
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={uploadTelemetry}
            disabled={!file || uploading}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded
              transition disabled:opacity-40 w-full"
          >
            {uploading ? "Analyzing..." : "Upload & Analyze"}
          </button>
        </div>

        {result && (
          <div className="bg-neutral-900 border border-neutral-700 p-6 rounded space-y-6">
            <h2 className="text-2xl font-semibold">Analysis Results</h2>

            <p className="text-neutral-300">{result.summary}</p>

            <div className="grid grid-cols-2 gap-4">
              {result.metrics.bestLap && (
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-neutral-400 text-sm">Best Lap</p>
                  <p className="text-white font-semibold text-xl">
                    {result.metrics.bestLap.toFixed(3)}s
                  </p>
                </div>
              )}
              {result.metrics.avgLap && (
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-neutral-400 text-sm">Avg Lap</p>
                  <p className="text-white font-semibold text-xl">
                    {result.metrics.avgLap.toFixed(3)}s
                  </p>
                </div>
              )}
              {result.metrics.consistency && (
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-neutral-400 text-sm">Consistency</p>
                  <p className="text-white font-semibold text-xl">
                    {result.metrics.consistency}%
                  </p>
                </div>
              )}
              {result.metrics.totalLaps && (
                <div className="bg-neutral-800 p-4 rounded">
                  <p className="text-neutral-400 text-sm">Total Laps</p>
                  <p className="text-white font-semibold text-xl">
                    {result.metrics.totalLaps}
                  </p>
                </div>
              )}
            </div>

            {result.insights.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold mb-2">Insights</h3>
                <ul className="list-disc ml-6 text-neutral-300 space-y-1">
                  {result.insights.map((insight, i) => (
                    <li key={i}>{insight}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
