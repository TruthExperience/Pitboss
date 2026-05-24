import Link from "next/link";

export function Nav() {
  return (
    <nav className="flex gap-6 mb-10 text-lg font-medium">
      <Link href="/exam">Exam</Link>
      <Link href="/advisor">Advisor</Link>
      <Link href="/telemetry">Telemetry</Link>
      <Link href="/dashboard">Dashboard</Link>
      <Link href="/profile">Profile</Link>
    </nav>
  );
}
