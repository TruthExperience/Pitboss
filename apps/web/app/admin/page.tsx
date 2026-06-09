"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import Nav from "@/components/Nav";

export default function AdminHome() {
  const { session, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.replace("/");
    }
  }, [session, loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <p className="text-neutral-400">Loading...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <>
      <Nav />

      <div className="space-y-8 p-8">
        <h1 className="text-3xl font-bold">PitBossOS Admin Panel</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link
            href="/admin/drivers"
            className="p-6 bg-neutral-900 border border-neutral-700 rounded hover:border-neutral-500 transition"
          >
            <h2 className="text-xl font-semibold">Drivers</h2>
            <p className="text-neutral-400">
              Manage drivers, divisions, and teams.
            </p>
          </Link>

          <Link
            href="/admin/exams"
            className="p-6 bg-neutral-900 border border-neutral-700 rounded hover:border-neutral-500 transition"
          >
            <h2 className="text-xl font-semibold">Exams</h2>
            <p className="text-neutral-400">
              View exam results and weak areas.
            </p>
          </Link>

          <Link
            href="/admin/telemetry"
            className="p-6 bg-neutral-900 border border-neutral-700 rounded hover:border-neutral-500 transition"
          >
            <h2 className="text-xl font-semibold">Telemetry</h2>
            <p className="text-neutral-400">
              Review telemetry uploads and metrics.
            </p>
          </Link>

          <Link
            href="/admin/certifications"
            className="p-6 bg-neutral-900 border border-neutral-700 rounded hover:border-neutral-500 transition"
          >
            <h2 className="text-xl font-semibold">Certifications</h2>
            <p className="text-neutral-400">
              Assign or revoke certifications.
            </p>
          </Link>

          <Link
            href="/admin/stewarding"
            className="p-6 bg-neutral-900 border border-neutral-700 rounded hover:border-neutral-500 transition"
          >
            <h2 className="text-xl font-semibold">Stewarding</h2>
            <p className="text-neutral-400">
              Review incidents and manage decisions.
            </p>
          </Link>

          <Link
            href="/admin/leagues"
            className="p-6 bg-neutral-900 border border-neutral-700 rounded hover:border-neutral-500 transition"
          >
            <h2 className="text-xl font-semibold">Leagues</h2>
            <p className="text-neutral-400">
              Manage WSC, SRH, and TRL leagues.
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
