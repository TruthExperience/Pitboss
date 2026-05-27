"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/card";

export default function AdminDriverDetail() {
  const { id } = useParams();
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`http://localhost:4000/drivers/${id}`)
      .then((res) => res.json())
      .then(setData);
  }, [id]);

  if (!data) return <p className="p-8">Loading...</p>;

  const driver = data.driver;
  const activity = data.activity ?? {};
  const exams = data.exams ?? [];
  const advisor = data.advisor ?? [];
  const telemetry = data.telemetry ?? [];
  const certs = data.certs ?? [];

  return (
    <div className="p-8 space-y-10">
      <h1 className="text-3xl font-bold">Driver: {driver.name}</h1>

      {/* DRIVER INFO */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-2">
        <h2 className="text-xl font-semibold">Driver Information</h2>
        <p><span className="font-semibold">Division:</span> {driver.division}</p>
        <p><span className="font-semibold">Team:</span> {driver.team}</p>
        <p><span className="font-semibold">License Level:</span> {driver.license_level}</p>
        <p><span className="font-semibold">Exams Passed:</span> {driver.exams_passed}</p>
        <p><span className="font-semibold">Advisor Score:</span> {driver.advisor_score}</p>
        <p><span className="font-semibold">Created:</span> {new Date(driver.created_at).toLocaleString()}</p>
      </Card>

      {/* ACTIVITY */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-2">
        <h2 className="text-xl font-semibold">Driver Activity</h2>
        <p><span className="font-semibold">Exams Taken:</span> {activity.exams_taken}</p>
        <p><span className="font-semibold">Advisor Sessions:</span> {activity.advisor_sessions}</p>
        <p><span className="font-semibold">Telemetry Uploads:</span> {activity.telemetry_uploads}</p>
        <p><span className="font-semibold">Last Updated:</span> {new Date(activity.updated_at).toLocaleString()}</p>
      </Card>

      {/* EXAMS */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Exam Results</h2>

        {exams.length === 0 && <p>No exams taken.</p>}

        {exams.map((e: any) => (
          <div key={e.id} className="border-b border-neutral-800 pb-4 mb-4">
            <p className="font-semibold">Score: {e.score}%</p>
            <p className="text-neutral-400 text-sm">
              Weak Areas: {e.weak_areas ? JSON.stringify(e.weak_areas) : "None"}
            </p>
            <p className="text-neutral-500 text-xs">
              {new Date(e.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </Card>

      {/* ADVISOR */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Advisor Sessions</h2>

        {advisor.length === 0 && <p>No advisor sessions.</p>}

        {advisor.map((a: any) => (
          <div key={a.id} className="border-b border-neutral-800 pb-4 mb-4">
            <p className="font-semibold">Q: {a.question}</p>
            <p className="text-neutral-300">A: {a.answer}</p>
            <p className="text-neutral-500 text-xs">
              {new Date(a.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </Card>

      {/* TELEMETRY */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Telemetry Uploads</h2>

        {telemetry.length === 0 && <p>No telemetry uploads.</p>}

        {telemetry.map((t: any) => (
          <div key={t.id} className="border-b border-neutral-800 pb-4 mb-4">
            <p className="font-semibold">{t.summary}</p>
            <p className="text-neutral-400 text-sm">
              Metrics: {JSON.stringify(t.metrics)}
            </p>
            <p className="text-neutral-500 text-xs">
              {new Date(t.created_at).toLocaleString()}
            </p>
          </div>
        ))}
      </Card>

      {/* CERTIFICATIONS */}
      <Card className="p-6 bg-neutral-900 border-neutral-700 space-y-4">
        <h2 className="text-xl font-semibold">Certifications</h2>

        {certs.length === 0 && <p>No certifications.</p>}

        {certs.map((c: any) => (
          <div key={c.id} className="border-b border-neutral-800 pb-4 mb-4">
            <p className="font-semibold">{c.cert_name}</p>
            <p className="text-neutral-500 text-xs">
              Earned: {new Date(c.earned_at).toLocaleString()}
            </p>
          </div>
        ))}
      </Card>
    </div>
  );
}
