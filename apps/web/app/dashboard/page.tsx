"use client";

import { Card } from "@/components/ui/card";

export default function DashboardPage() {
  // Mock data for now — replace with API calls later
  const mockExam = {
    score: 88,
    weakAreas: {
      "Blue Flags": 60,
      "Safety Car Restarts": 75,
    },
  };

  const mockAdvisor = {
    lastQuestion: "How do I improve corner exit speed?",
    lastAnswer:
      "Focus on smoother throttle application and reduce mid-corner steering angle.",
  };

  const mockTelemetry = {
    summary: "Your braking consistency is strong, but corner entry is slow.",
    metrics: {
      brakingConsistency: "87%",
      throttleSmoothness: "92%",
      cornerEntryDelta: "-0.12s",
    },
  };

  const mockCerts = {
    level: "Bronze",
    progress: "40%",
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Driver Dashboard</h1>

      {/* Exam Summary */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Latest Exam</h2>
        <p>Score: {mockExam.score}%</p>

        <h3 className="font-semibold mt-2">Weak Areas</h3>
        <ul className="list-disc ml-6">
          {Object.entries(mockExam.weakAreas).map(([area, acc]) => (
            <li key={area}>
              {area}: {acc}%
            </li>
          ))}
        </ul>
      </Card>

      {/* Advisor Summary */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Advisor</h2>
        <p className="font-medium">Last Question:</p>
        <p>{mockAdvisor.lastQuestion}</p>

        <p className="font-medium mt-2">Last Answer:</p>
        <p className="whitespace-pre-line">{mockAdvisor.lastAnswer}</p>
      </Card>

      {/* Telemetry Summary */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Telemetry</h2>
        <p>{mockTelemetry.summary}</p>

        <h3 className="font-semibold mt-2">Metrics</h3>
        <ul className="list-disc ml-6">
          {Object.entries(mockTelemetry.metrics).map(([key, value]) => (
            <li key={key}>
              {key}: {value}
            </li>
          ))}
        </ul>
      </Card>

      {/* Certification Progress */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Certification</h2>
        <p>Level: {mockCerts.level}</p>
        <p>Progress: {mockCerts.progress}</p>
      </Card>
    </div>
  );
}
