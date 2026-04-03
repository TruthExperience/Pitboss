import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import CredentialsProvider from 'next-auth/providers/credentials'
import { supabase } from '@/lib/supabase'

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Email',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null
        const { data, error } = await supabase.auth.signInWithPassword({
          email: credentials.email as string,
          password: credentials.password as string,
        })
        if (error || !data.user) return null
        return {
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.username ?? data.user.email,
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'discord') {
        // Upsert member record on Discord login
        const { error } = await supabase.from('members').upsert({
          user_id: user.id,
          discord_id: account.providerAccountId,
          username: user.name ?? 'Unknown',
          email: user.email ?? '',
        }, { onConflict: 'discord_id' })
        if (error) console.error('Member upsert error:', error)
      }
      return true
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub
      }
      return session
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id
      return token
    },
  },
  pages: {
    signIn: '/auth/login',
    error: '/auth/error',
  },
})
