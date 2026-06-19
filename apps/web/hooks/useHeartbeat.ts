"use client";

import { useEffect, useState } from "react";

export function useHeartbeat() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isPWAInstalled, setIsPWAInstalled] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [apiReachable, setApiReachable] = useState(false);
  const [serviceWorkerActive, setServiceWorkerActive] = useState(false);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);
  }, []);

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", () =>
      setIsPWAInstalled(false)
    );
    window.addEventListener("appinstalled", () =>
      setIsPWAInstalled(true)
    );
  }, []);

  useEffect(() => {
    const updateOnline = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", updateOnline);
    window.addEventListener("offline", updateOnline);
    updateOnline();
  }, []);

  useEffect(() => {
    async function checkAPI() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/health`
        );
        setApiReachable(res.ok);
      } catch {
        setApiReachable(false);
      }
    }
    checkAPI();
    const interval = setInterval(checkAPI, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setServiceWorkerActive(true);
      });
    }
  }, []);

  return {
    isStandalone,
    isPWAInstalled,
    isOnline,
    apiReachable,
    serviceWorkerActive,
  };
}
