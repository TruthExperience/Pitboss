"use client";

import { useEffect, useState, useContext } from "react";
import { supabase } from "@/lib/supabaseClient";
import { AuthContext } from "@/components/AuthProvider";
import Nav from "@/components/Nav";

export default function DashboardPage() {
  const session = useContext(AuthContext);
  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;

    async function loadDriver() {
      const { data, error } = await supabase
        .from("drivers")
        .select("*")
        .eq("auth_id", session.user.id)
        .single();

      if (!error) setDriver(data);
      setLoading(false);
    }

    loadDriver();
  }, [session]);

  if (!session) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-3xl font-bold">Please log in</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <div className="p-8 space-y-8">
        <h1 className="text-4xl font-bold">Dashboard</h1>

        {!driver ? (
          <p className="text-red-400">
            No driver profile found. Contact an admin.
          </p>
        ) : (
          <div className="space-y-6">
            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
              <h2 className="text-2xl font-semibold mb-2">
                Welcome, {driver.name}
              </h2>
              <p className="text-neutral-400">
                License Level:{" "}
                <span className="text-white font-semibold">
                  {driver.license_level}
                </span>
              </p>
              <p className="text-neutral-400">
                Exams Passed:{" "}
                <span className="text-white font-semibold">
                  {driver.exams_passed}
                </span>
              </p>
              <p className="text-neutral-400">
                Advisor Score:{" "}
                <span className="text-white font-semibold">
                  {driver.advisor_score}
                </span>
              </p>
            </div>

            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
              <h2 className="text-xl font-semibold mb-3">Next Steps</h2>
              <ul className="list-disc ml-6 text-neutral-300 space-y-2">
                <li>Take your next certification exam</li>
                <li>Run telemetry to improve your driving</li>
                <li>Use the Advisor to get personalized coaching</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
