import { CheckCircle2, XCircle, Clock, FileCheck, CalendarDays, TrendingUp } from 'lucide-react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useStudentAttendance } from '../../../hooks/useStudentData'

const STATUS_META = {
  present: { label:'Present', icon: CheckCircle2, color:'text-green-600 dark:text-green-400', bg:'bg-green-100 dark:bg-green-900/30', dot:'bg-green-500' },
  absent:  { label:'Absent',  icon: XCircle,      color:'text-red-500',                        bg:'bg-red-100 dark:bg-red-900/30',     dot:'bg-red-500'   },
  late:    { label:'Late',    icon: Clock,         color:'text-amber-600 dark:text-amber-400',  bg:'bg-amber-100 dark:bg-amber-900/30', dot:'bg-amber-500' },
  excused: { label:'Excused', icon: FileCheck,     color:'text-blue-600 dark:text-blue-400',    bg:'bg-blue-100 dark:bg-blue-900/30',   dot:'bg-blue-500'  },
}

function AttendanceMeter({ percent }: { percent: number }) {
  const color = percent >= 90 ? '#16a34a' : percent >= 75 ? '#d97706' : '#ef4444'
  const r = 54, cx = 64, cy = 64
  const circ = 2 * Math.PI * r
  const dash = (percent / 100) * circ
  return (
    <svg viewBox="0 0 128 128" className="w-32 h-32">
      <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth="10" stroke="rgba(0,0,0,0.06)" />
      <circle cx={cx} cy={cy} r={r} fill="none" strokeWidth="10" stroke={color}
        strokeDasharray={`${dash} ${circ - dash}`} strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`} />
      <text x={cx} y={cy - 4} textAnchor="middle" fill={color} fontSize="20" fontWeight="bold">{percent}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#9ca3af" fontSize="9">Attendance</text>
    </svg>
  )
}

export function StudentAttendance() {
  const { data: att, isLoading } = useStudentAttendance()

  if (isLoading) {
    return <div className="mx-auto max-w-4xl px-4 py-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-28 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  const records  = att?.records ?? []
  const percent  = att?.percent ?? 100
  const statusSummary = [
    { ...STATUS_META.present, count: att?.present ?? 0 },
    { ...STATUS_META.absent,  count: att?.absent  ?? 0 },
    { ...STATUS_META.late,    count: att?.late    ?? 0 },
    { ...STATUS_META.excused, count: att?.excused ?? 0 },
  ]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 space-y-6">

      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Attendance</h1>
        <p className="text-sm text-gray-400 mt-0.5">Term 2, 2026 attendance record</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Meter */}
        <GlassCard className="p-6 flex items-center gap-6">
          <AttendanceMeter percent={percent} />
          <div>
            <p className="text-sm text-gray-400 mb-1">This Term</p>
            <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{att?.total ?? 0} days</p>
            <p className="text-sm text-gray-400 mt-1">School days recorded</p>
            <div className="mt-3 flex items-center gap-1.5 text-xs">
              <TrendingUp className="h-3.5 w-3.5 text-green-500" />
              <span className={percent >= 90 ? 'text-green-600 dark:text-green-400' : percent >= 75 ? 'text-amber-600' : 'text-red-500'}>
                {percent >= 90 ? 'Excellent attendance' : percent >= 75 ? 'Acceptable attendance' : 'Needs improvement'}
              </span>
            </div>
          </div>
        </GlassCard>

        {/* Breakdown */}
        <div className="grid grid-cols-2 gap-3">
          {statusSummary.map(s => (
            <GlassCard key={s.label} className="p-4 flex items-center gap-3">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${s.bg}`}>
                <s.icon className={`h-5 w-5 ${s.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${s.color}`}>{s.count}</p>
                <p className="text-xs text-gray-400">{s.label}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      {/* Record list */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-green-600" />
          <h2 className="font-bold text-gray-900 dark:text-white">Daily Record — {records.length} days</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                <th className="text-left px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Date</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Day</th>
                <th className="text-center px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400">Status</th>
                <th className="text-left px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-400 hidden sm:table-cell">Notes</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr><td colSpan={4} className="py-10 text-center text-gray-400">No records for this term</td></tr>
              ) : records.map((r, i) => {
                const meta = STATUS_META[r.status] ?? STATUS_META.present
                const d    = new Date(r.date)
                const dayLabel = d.toLocaleDateString('en-KE', { weekday: 'short' })
                const dateLabel = d.toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })
                return (
                  <tr key={r.id} className={`border-b border-gray-50 dark:border-gray-800/50 ${i%2===1?'bg-gray-50/40 dark:bg-gray-800/20':''}`}>
                    <td className="px-5 py-3 font-medium text-gray-800 dark:text-gray-200">{dateLabel}</td>
                    <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{dayLabel}</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${meta.bg} ${meta.color}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
                        {meta.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-400 hidden sm:table-cell">{r.notes || '—'}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
