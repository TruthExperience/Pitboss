"use client";

import { supabase } from "@/lib/supabaseClient";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<any>(null);

export default function AuthProvider({ children }: any) {
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <AuthContext.Provider value={session}>
      {children}
    </AuthContext.Provider>
  );
}
