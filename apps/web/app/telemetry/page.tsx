"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";

export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading, session } = useAuth();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Redirect if already logged in
  useEffect(() => {
    if (!loading && isAuthenticated && session) {
      router.replace("/dashboard");
    }
  }, [loading, isAuthenticated, session, router]);

  async function login() {
    setError("");

    if (!email.includes("@")) {
      setError("Please enter a valid email.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/dashboard`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  if (loading) {
    return <p className="text-center mt-10">Loading...</p>;
  }

  return (
    <div className="p-8 max-w-md mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Login</h1>

      {sent ? (
        <p className="text-green-400">
          Magic link sent! Check your email to continue.
        </p>
      ) : (
        <>
          <input
            className="bg-neutral-900 border border-neutral-700 p-3 rounded w-full text-white"
            placeholder="Enter your email..."
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          {error && (
            <p className="text-red-400 text-sm">{error}</p>
          )}

          <button
            onClick={login}
            disabled={loading || !email}
            className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded w-full transition disabled:opacity-40"
          >
            Send Magic Link
          </button>
        </>
      )}
    </div>
  );
}
