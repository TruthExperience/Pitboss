"use client";

import type { Session } from "@supabase/supabase-js";
import { useAuthContext } from "@/components/AuthProvider";

type UseAuthReturn = {
  session: Session | null;
  loading: boolean;
  isAuthenticated: boolean;
};

export function useAuth(): UseAuthReturn {
  const { session, loading } = useAuthContext();

  return {
    session,
    loading,
    isAuthenticated: !!session,
  };
}
