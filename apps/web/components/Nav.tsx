"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useContext } from "react";
import { AuthContext } from "@/components/AuthProvider";

export default function Nav() {
  const pathname = usePathname();
  const session = useContext(AuthContext);

  const linkClass = (path: string) =>
    pathname === path
      ? "text-blue-400 font-semibold"
      : "text-neutral-300 hover:text-white transition";

  return (
    <nav className="flex items-center justify-between px-6 py-4 border-b border-neutral-800 bg-black/40 backdrop-blur">
      {/* Left side links */}
      <div className="flex gap-6 text-lg font-medium">
        <Link href="/dashboard" className={linkClass("/dashboard")}>
          Dashboard
        </Link>

        <Link href="/exam" className={linkClass("/exam")}>
          Exam
        </Link>

        <Link href="/advisor" className={linkClass("/advisor")}>
          Advisor
        </Link>

        <Link href="/telemetry" className={linkClass("/telemetry")}>
          Telemetry
        </Link>

        <Link href="/profile" className={linkClass("/profile")}>
          Profile
        </Link>

        {/* Admin link only visible if logged in */}
        {session && (
          <Link href="/admin" className={linkClass("/admin")}>
            Admin
          </Link>
        )}
      </div>

      {/* Right side auth controls */}
      <div className="flex items-center gap-4">
        {!session ? (
          <Link
            href="/login"
            className="text-neutral-300 hover:text-white transition"
          >
            Login
          </Link>
        ) : (
          <button
            onClick={() => supabase.auth.signOut()}
            className="text-red-400 hover:text-red-300 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
