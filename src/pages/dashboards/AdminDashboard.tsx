import { useState } from 'react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { useAdminMetrics } from '../../hooks/useMetrics'
import { useStudents } from '../../hooks/useStudents'

export function AdminDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [announcement, setAnnouncement] = useState('')

  const { data: metricsData, isLoading: metricsLoading } = useAdminMetrics()
  const { data: students, isLoading: studentsLoading } = useStudents()

  const publish = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('School-wide announcement published')
    setAnnouncement('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Console — {user?.name}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metricsLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <GlassCard key={i} className="p-6 text-center animate-pulse">
                <div className="mx-auto h-8 w-20 rounded bg-neutral-300 dark:bg-neutral-600" />
                <div className="mx-auto mt-2 h-4 w-28 rounded bg-neutral-200 dark:bg-neutral-700" />
              </GlassCard>
            ))
          : metricsData?.metrics.map((m) => (
              <GlassCard key={m.label} className="p-6 text-center">
                <p className="text-3xl font-bold text-primary dark:text-gold">{m.value}</p>
                {m.change && (
                  <p className={`text-xs font-medium ${m.trend === 'up' ? 'text-primary' : m.trend === 'down' ? 'text-red-500' : 'text-muted'}`}>
                    {m.trend === 'up' ? '↑' : m.trend === 'down' ? '↓' : '—'} {m.change}
                  </p>
                )}
                <p className="mt-1 text-sm text-muted">{m.label}</p>
              </GlassCard>
            ))}
      </div>

      {metricsData?.recentActivity && (
        <GlassCard className="mt-8 p-6">
          <h2 className="mb-4 font-bold">Recent Activity</h2>
          <ul className="space-y-3">
            {metricsData.recentActivity.map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-foreground">{item.action}</span>
                <span className="shrink-0 text-muted">{item.user} · {item.time}</span>
              </li>
            ))}
          </ul>
        </GlassCard>
      )}

      <GlassCard className="mt-8 p-6">
        <h2 className="mb-4 font-bold">School-Wide Announcement</h2>
        <form onSubmit={publish} className="flex gap-4">
          <input
            required
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            placeholder="Type announcement..."
            className="field flex-1"
          />
          <Button type="submit" variant="primary">Publish</Button>
        </form>
      </GlassCard>

      <GlassCard className="mt-8 overflow-x-auto p-6">
        <h2 className="mb-4 font-bold">User Management</h2>
        {studentsLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            ))}
          </div>
        ) : (
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-theme text-muted">
                <th className="p-3">Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Role</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {students?.slice(0, 10).map((s) => (
                <tr key={s.id} className="border-b border-theme/50 text-foreground">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3 text-muted">{s.className}</td>
                  <td className="p-3">Student</td>
                  <td className="p-3">
                    <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs">Active</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassCard>
    </div>
  )
}
