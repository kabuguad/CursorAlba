import { GlassCard } from '../../../components/ui/GlassCard'
import { useAttendance } from '../../../hooks/useAttendance'

const LINKED_STUDENT_ID = 's-1'

export function ParentAttendance() {
  const { data: attendance, isLoading } = useAttendance(LINKED_STUDENT_ID, 2026, 2)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Attendance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Term 2, 2026</p>
      </div>

      <GlassCard className="p-6">
        {!isLoading && attendance && (
          <div className="mb-4 flex flex-wrap gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Present</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{attendance.presentCount} days</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Absent</p>
              <p className="text-2xl font-bold text-red-500">{attendance.absentCount} days</p>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-gray-400">Rate</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attendance.percentage}%</p>
            </div>
          </div>
        )}
        {isLoading ? (
          <div className="h-40 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {attendance?.days.map(d => (
              <div
                key={d.date}
                title={d.date}
                className={`h-8 w-8 rounded-md transition hover:scale-110 ${
                  d.present ? 'bg-green-600' : 'bg-gray-200 dark:bg-gray-700'
                }`}
              />
            ))}
          </div>
        )}
        <p className="mt-4 text-xs text-gray-400">Green = present · Grey = absent</p>
      </GlassCard>
    </div>
  )
}
