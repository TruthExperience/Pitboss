"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  async function login() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: "http://localhost:3000/dashboard" }
    });

    if (!error) setSent(true);
  }

  return (
    <div className="p-8 space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>

      {sent ? (
        <p>Magic link sent! Check your email.</p>
      ) : (
        <>
          <input
            className="bg-neutral-900 border border-neutral-700 p-2 rounded w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <button
            onClick={login}
            className="bg-blue-600 px-4 py-2 rounded"
          >
            Send Magic Link
          </button>
        </>
      )}
    </div>
  );
}
