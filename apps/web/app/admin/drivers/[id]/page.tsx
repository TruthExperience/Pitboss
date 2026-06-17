"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

interface DriverProfileResponse {
  success: boolean;
  data: {
    driver: any;
    activity: any;
    exams: any[];
    advisor: any[];
    telemetry: any[];
    certifications: any[];
  };
}

export default function DriverDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { isAuthenticated, loading: authLoading } = useAuth();

  const [data, setData] = useState<DriverProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDriver = async () => {
      try {
        setLoading(true);

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/admin/drivers/${id}`
        );

        if (!response.ok) {
          throw new Error("Failed to load driver");
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError("Failed to load driver profile");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadDriver();
    }
  }, [id]);

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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading driver profile...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-400">{error ?? "Driver not found"}</p>
      </div>
    );
  }

  const { driver, activity, exams, advisor, telemetry, certifications } =
    data.data;

  return (
    <>
      <Nav />

      <div className="p-8 max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">
          {driver.name ?? `${driver.first_name} ${driver.last_name}`}
        </h1>

        {/* Driver Info */}
        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded space-y-2">
          <h2 className="text-xl font-semibold mb-3">Driver Info</h2>
          <p className="text-neutral-400">
            License Level:{" "}
            <span className="text-white font-semibold">
              {driver.license_level}
            </span>
          </p>
          <p className="text-neutral-400">
            Status:{" "}
            <span className="text-white font-semibold">
              {driver.status}
            </span>
          </p>
          {activity && (
            <p className="text-neutral-400">
              Telemetry Uploads:{" "}
              <span className="text-white font-semibold">
                {activity.telemetry_uploads ?? 0}
              </span>
            </p>
          )}
        </div>

        {/* Exam Results */}
        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">
            Exam Results ({exams.length})
          </h2>
          {exams.length === 0 ? (
            <p className="text-neutral-400">No exams taken yet.</p>
          ) : (
            <div className="space-y-2">
              {exams.map((exam: any, i: number) => (
                <div
                  key={i}
                  className="flex justify-between items-center bg-neutral-800 p-3 rounded"
                >
                  <span className="text-neutral-300">
                    Score: {exam.score}%
                  </span>
                  <span
                    className={
                      exam.passed ? "text-green-400" : "text-red-400"
                    }
                  >
                    {exam.passed ? "Passed" : "Failed"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Certifications */}
        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">
            Certifications ({certifications.length})
          </h2>
          {certifications.length === 0 ? (
            <p className="text-neutral-400">No certifications earned yet.</p>
          ) : (
            <div className="space-y-2">
              {certifications.map((cert: any, i: number) => (
                <div
                  key={i}
                  className="bg-neutral-800 p-3 rounded"
                >
                  <p className="text-white font-semibold">
                    {cert.certification_name}
                  </p>
                  <p className="text-neutral-400 text-sm">
                    Earned: {new Date(cert.earned_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Telemetry */}
        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">
            Telemetry Uploads ({telemetry.length})
          </h2>
          {telemetry.length === 0 ? (
            <p className="text-neutral-400">No telemetry uploaded yet.</p>
          ) : (
            <div className="space-y-2">
              {telemetry.map((t: any, i: number) => (
                <div key={i} className="bg-neutral-800 p-3 rounded">
                  <p className="text-neutral-300">{t.summary}</p>
                  <p className="text-neutral-400 text-sm">
                    {new Date(t.analyzed_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Advisor Sessions */}
        <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
          <h2 className="text-xl font-semibold mb-3">
            Advisor Sessions ({advisor.length})
          </h2>
          {advisor.length === 0 ? (
            <p className="text-neutral-400">No advisor sessions yet.</p>
          ) : (
            <div className="space-y-2">
              {advisor.map((session: any, i: number) => (
                <div key={i} className="bg-neutral-800 p-3 rounded">
                  <p className="text-neutral-300 text-sm">
                    Q: {session.question}
                  </p>
                  <p className="text-neutral-400 text-sm mt-1">
                    A: {session.answer}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
