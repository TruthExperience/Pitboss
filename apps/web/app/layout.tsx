import "./globals.css";
import type { ReactNode } from "react";

import { AuthProvider } from "@/components/AuthProvider";
import HeartbeatIndicator from "@/components/HeartbeatIndicator";

export const metadata = {
  title: "PitBossOS",
  description: "Unified League Operating System for racing leagues"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        <AuthProvider>
          {children}
          <HeartbeatIndicator />
        </AuthProvider>

        {/* Register Service Worker */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ("serviceWorker" in navigator) {
                window.addEventListener("load", () => {
                  navigator.serviceWorker
                    .register("/sw.js")
                    .catch(err => console.error("SW registration failed:", err));
                });
              }
            `
          }}
        />
      </body>
    </html>
  );
}
