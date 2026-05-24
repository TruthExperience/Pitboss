"use client";

import Link from "next/link";

export default function AdminHome() {
  return (
    <div className="space-y-8 p-8">
      <h1 className="text-3xl font-bold">PitBossOS Admin Panel</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin/drivers" className="p-6 bg-neutral-900 border border-neutral-700 rounded">
          <h2 className="text-xl font-semibold">Drivers</h2>
          <p className="text-neutral-400">Manage drivers, divisions, and teams.</p>
        </Link>

        <Link href="/admin/exams" className="p-6 bg-neutral-900 border border-neutral-700 rounded">
          <h2 className="text-xl font-semibold">Exams</h2>
          <p className="text-neutral-400">View exam results and weak areas.</p>
        </Link>

        <Link href="/admin/telemetry" className="p-6 bg-neutral-900 border border-neutral-700 rounded">
          <h2 className="text-xl font-semibold">Telemetry</h2>
          <p className="text-neutral-400">Review telemetry uploads and metrics.</p>
        </Link>

        <Link href="/admin/certifications" className="p-6 bg-neutral-900 border border-neutral-700 rounded">
          <h2 className="text-xl font-semibold">Certifications</h2>
          <p className="text-neutral-400">Assign or revoke certifications.</p>
        </Link>
      </div>
    </div>
  );
}
