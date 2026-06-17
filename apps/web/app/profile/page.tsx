"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

export default function ProfilePage() {
  const { session, loading: authLoading, isAuthenticated } = useAuth();

  const [driver, setDriver] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    if (!session) return;

    async function loadDriver() {
      if (!session) return;

      const { data: driverRow } = await supabase
        .from("drivers")
        .select("*")
        .eq("auth_id", session.user.id)
        .single();

      if (!driverRow) {
        setLoading(false);
        return;
      }

      setDriver(driverRow);
      setName(driverRow.name || "");
      setBio(driverRow.bio || "");
      setLoading(false);
    }

    loadDriver();
  }, [session]);

  async function saveProfile() {
    if (!driver) return;

    setSaving(true);
    setSaved(false);

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/admin/drivers/${driver.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, bio }),
      }
    );

    setSaving(false);
    setSaved(true);
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

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading profile...</p>
      </div>
    );
  }

  return (
    <>
      <Nav />

      <div className="p-8 max-w-2xl mx-auto space-y-8">
        <h1 className="text-4xl font-bold">Your Profile</h1>

        {!driver ? (
          <p className="text-red-400">
            No driver profile found. Contact an admin.
          </p>
        ) : (
          <>
            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded space-y-4">
              <label className="block">
                <span className="text-neutral-300">Name</span>
                <input
                  className="bg-neutral-800 border border-neutral-700 p-3 rounded w-full mt-1 text-white"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </label>

              <label className="block">
                <span className="text-neutral-300">Bio</span>
                <textarea
                  className="bg-neutral-800 border border-neutral-700 p-3 rounded w-full mt-1 text-white h-28"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                />
              </label>

              <button
                onClick={saveProfile}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded transition disabled:opacity-50"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>

              {saved && (
                <p className="text-green-400 text-sm mt-2">
                  Profile updated successfully.
                </p>
              )}
            </div>

            <div className="bg-neutral-900 border border-neutral-700 p-6 rounded">
              <h2 className="text-xl font-semibold mb-3">
                Driver Stats
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
          </>
        )}
      </div>
    </>
  );
}
