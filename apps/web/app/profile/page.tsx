"use client";

import { Card } from "@/components/ui/card";

export default function ProfilePage() {
  // Mock data for now — replace with real API calls later
  const mockProfile = {
    name: "Test Driver",
    division: "F2",
    team: "Independent",
    certifications: ["Bronze Racecraft", "Flag Rules Level 1"],
    examsTaken: 12,
    advisorSessions: 8,
    telemetryUploads: 5,
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Driver Profile</h1>

      {/* Basic Info */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-2">
        <h2 className="text-xl font-semibold">Basic Information</h2>
        <p><span className="font-medium">Name:</span> {mockProfile.name}</p>
        <p><span className="font-medium">Division:</span> {mockProfile.division}</p>
        <p><span className="font-medium">Team:</span> {mockProfile.team}</p>
      </Card>

      {/* Certifications */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Certifications</h2>
        <ul className="list-disc ml-6">
          {mockProfile.certifications.map((cert, i) => (
            <li key={i}>{cert}</li>
          ))}
        </ul>
      </Card>

      {/* Activity Summary */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Activity Summary</h2>
        <p><span className="font-medium">Exams Taken:</span> {mockProfile.examsTaken}</p>
        <p><span className="font-medium">Advisor Sessions:</span> {mockProfile.advisorSessions}</p>
        <p><span className="font-medium">Telemetry Uploads:</span> {mockProfile.telemetryUploads}</p>
      </Card>
    </div>
  );
}
