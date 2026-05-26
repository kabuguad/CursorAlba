import { useState } from 'react'
import { students } from '../../data/students'
import { teachers } from '../../data/teachers'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'

const METRICS = [
  { label: 'Total Students', value: '2,048' },
  { label: 'Staff Members', value: String(teachers.length) },
  { label: 'Active Classes', value: '86' },
  { label: 'Fee Collection', value: '94%' },
]

export function AdminDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [announcement, setAnnouncement] = useState('')

  const publish = (e: React.FormEvent) => {
    e.preventDefault()
    showToast('School-wide announcement published')
    setAnnouncement('')
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <h1 className="text-3xl font-bold">Admin Console — {user?.name}</h1>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {METRICS.map((m) => (
          <GlassCard key={m.label} className="p-6 text-center">
            <p className="text-3xl font-bold text-primary dark:text-gold">{m.value}</p>
            <p className="mt-1 text-sm text-muted">{m.label}</p>
          </GlassCard>
        ))}
      </div>

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
        <table className="w-full min-w-[500px] text-left text-sm">
          <thead>
            <tr className="border-b border-theme text-muted">
              <th className="p-3">Name</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {students.slice(0, 10).map((s) => (
              <tr key={s.id} className="border-b border-theme/50 text-foreground">
                <td className="p-3">{s.name}</td>
                <td className="p-3">Student</td>
                <td className="p-3">
                  <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs">Active</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassCard>
    </div>
  )
}
