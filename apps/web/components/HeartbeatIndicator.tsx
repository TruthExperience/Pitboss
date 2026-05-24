"use client";

import { useHeartbeat } from "@/hooks/useHeartbeat";

export default function HeartbeatIndicator() {
  const {
    isStandalone,
    isPWAInstalled,
    isOnline,
    apiReachable,
    serviceWorkerActive,
  } = useHeartbeat();

  const status =
    !isOnline
      ? "OFFLINE"
      : !apiReachable
      ? "DEGRADED"
      : "LIVE";

  const color =
    status === "LIVE"
      ? "text-green-400"
      : status === "DEGRADED"
      ? "text-yellow-400"
      : "text-red-500";

  return (
    <div className="fixed bottom-4 right-4 bg-neutral-900 border border-neutral-700 px-4 py-2 rounded-lg text-sm">
      <p className={`font-bold ${color}`}>Status: {status}</p>
      <p>PWA Installed: {isPWAInstalled ? "Yes" : "No"}</p>
      <p>Standalone: {isStandalone ? "Yes" : "No"}</p>
      <p>Online: {isOnline ? "Yes" : "No"}</p>
      <p>API Reachable: {apiReachable ? "Yes" : "No"}</p>
      <p>SW Active: {serviceWorkerActive ? "Yes" : "No"}</p>
    </div>
  );
}
