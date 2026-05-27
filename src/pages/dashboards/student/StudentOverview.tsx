import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { ClipboardList } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useAuth } from '../../../contexts/AuthContext'
import { GRADES, HOMEWORK, TIMETABLE, DAYS } from './_data'

export function StudentOverview() {
  const { user } = useAuth()
  const avg = Math.round(GRADES.reduce((s, g) => s + g.score, 0) / GRADES.length)
  const pending = HOMEWORK.filter(h => h.status === 'pending').length
  const todayKey = DAYS[Math.max(0, new Date().getDay() - 1)] ?? 'Monday'

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · Term 2, 2026</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Class Average',    value: `${avg}%`,       sub: 'Term 2 2026',               color: 'text-green-600 dark:text-green-400'  },
          { label: 'Pending Homework', value: String(pending), sub: `${HOMEWORK.length - pending} done`, color: 'text-yellow-600 dark:text-yellow-500' },
          { label: 'Attendance Rate',  value: '94%',           sub: '56 of 60 days',             color: 'text-blue-600 dark:text-blue-400'    },
          { label: 'Notices Unread',   value: '3',             sub: 'check Notices',             color: 'text-purple-600 dark:text-purple-400' },
        ].map(c => (
          <GlassCard key={c.label} className="p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.label}</p>
            <p className={`mt-1 text-3xl font-bold ${c.color}`}>{c.value}</p>
            <p className="mt-1 text-xs text-gray-400">{c.sub}</p>
          </GlassCard>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-white">My Grades — Term 2</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={GRADES} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="subject" tick={{ fontSize: 10 }} interval={0} angle={-20} textAnchor="end" height={40} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} />
              <Bar dataKey="score" fill="#15803d" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="mb-4 font-bold text-gray-900 dark:text-white">Upcoming Homework</h2>
          <div className="space-y-3">
            {HOMEWORK.filter(h => h.status === 'pending').slice(0, 4).map(hw => (
              <div key={hw.id} className="flex items-start gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 p-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                  <ClipboardList className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-gray-900 dark:text-white">{hw.title}</p>
                  <p className="text-xs text-gray-400">{hw.subject} · Due {hw.due}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <h2 className="mb-3 font-bold text-gray-900 dark:text-white">Today's Schedule — {todayKey}</h2>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {(TIMETABLE[todayKey] ?? TIMETABLE['Monday']).map((p, i) => (
            <div key={i} className="flex items-center gap-3 rounded-xl border border-gray-100 dark:border-gray-700 p-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs font-bold">
                {i + 1}
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">{p.subject}</p>
                <p className="text-xs text-gray-400">{p.time} · {p.room}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
