import "./globals.css";
import { ReactNode } from "react";
import { Nav } from "../components/Nav";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-950 text-white">
        <main className="max-w-5xl mx-auto py-10 px-6">
          <Nav />
          {children}
        </main>
      </body>
    </html>
  );
}
