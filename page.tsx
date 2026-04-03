'use client'

import { useEffect, useState } from 'react'

type Member = {
  id: string
  username: string
  email: string
  role: string
  discord_id: string | null
  leagues: { name: string; abbreviation: string } | null
  created_at: string
}

const ROLE_LABELS: Record<string, string> = {
  member: 'Member',
  steward: 'Steward',
  race_director: 'Race Director',
  commissioner: 'Commissioner',
  admin: 'Admin',
}

export default function MembersPage() {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(data => { setMembers(data); setLoading(false) })
  }, [])

  const filtered = members.filter(m =>
    m.username.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tight">Members</h1>
          <p className="text-zinc-500 text-sm mt-1">{members.length} registered members</p>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full max-w-sm bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white placeholder-zinc-500 text-sm focus:outline-none focus:border-red-600 transition-colors"
        />
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-zinc-600">Loading...</div>
        ) : filtered.length === 0 ? (
          <div className="p-8 text-center text-zinc-600">No members found.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-500 text-xs uppercase tracking-wider">
                <th className="text-left p-4">Username</th>
                <th className="text-left p-4">Email</th>
                <th className="text-left p-4">Role</th>
                <th className="text-left p-4">League</th>
                <th className="text-left p-4">Discord</th>
                <th className="text-left p-4">Joined</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(member => (
                <tr key={member.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors">
                  <td className="p-4 text-white font-medium">{member.username}</td>
                  <td className="p-4 text-zinc-400">{member.email}</td>
                  <td className="p-4">
                    <RoleBadge role={member.role} />
                  </td>
                  <td className="p-4 text-zinc-400">
                    {member.leagues?.abbreviation ?? '—'}
                  </td>
                  <td className="p-4 text-zinc-400">
                    {member.discord_id ? (
                      <span className="text-indigo-400 text-xs">✓ Linked</span>
                    ) : (
                      <span className="text-zinc-600 text-xs">Not linked</span>
                    )}
                  </td>
                  <td className="p-4 text-zinc-500 text-xs">
                    {new Date(member.created_at).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: 'bg-red-950 text-red-400 border-red-900',
    commissioner: 'bg-purple-950 text-purple-400 border-purple-900',
    race_director: 'bg-yellow-950 text-yellow-400 border-yellow-900',
    steward: 'bg-blue-950 text-blue-400 border-blue-900',
    member: 'bg-zinc-800 text-zinc-400 border-zinc-700',
  }
  return (
    <span className={`text-xs px-2 py-0.5 rounded border font-medium uppercase tracking-wide ${styles[role] ?? styles.member}`}>
      {ROLE_LABELS[role] ?? role}
    </span>
  )
}
