import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Member = {
  id: string
  user_id: string
  discord_id: string | null
  username: string
  email: string
  role: 'member' | 'steward' | 'race_director' | 'commissioner' | 'admin'
  league_id: string | null
  avatar_url: string | null
  created_at: string
  updated_at: string
}

export type Certification = {
  id: string
  member_id: string
  certification_type_id: string
  status: 'pending' | 'in_progress' | 'passed' | 'failed' | 'expired'
  score: number | null
  issued_at: string | null
  expires_at: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export type CertificationType = {
  id: string
  name: string
  description: string | null
  league_id: string | null
  passing_score: number
  created_at: string
}

export type League = {
  id: string
  name: string
  abbreviation: string | null
  description: string | null
  created_at: string
}
