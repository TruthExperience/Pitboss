import "./globals.css";
import type { ReactNode } from "react";

export const metadata = {
  title: "PitBossOS",
  description: "Unified League Operating System for racing leagues"
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-black text-white">
        {children}

        {/* Service Worker Registration */}
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
            `,
          }}
        />
      </body>
    </html>
  );
}
