"use client";

import { createContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    // Load initial session
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    // Listen for login/logout/session refresh
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}
