import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useStudents } from '../../../hooks/useStudents'
import { useSubmitAttendance } from '../../../hooks/useAttendance'

export function TeacherAttendance() {
  const { data: students, isLoading } = useStudents()
  const { mutate: submitAttendance, isPending } = useSubmitAttendance()
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({})
  const visible = students?.slice(0, 15) ?? []

  const handleSubmit = () => {
    const records = visible.map(s => ({ studentId: s.id, present: attendanceMap[s.id] ?? true }))
    submitAttendance({ classId: 'cls-grade5-gold', date: new Date().toISOString().split('T')[0], records })
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mark Attendance</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
        </p>
      </div>

      <GlassCard className="p-6">
        {isLoading ? (
          <div className="space-y-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
            ))}
          </div>
        ) : (
          <div className="max-h-[480px] space-y-2 overflow-y-auto">
            {visible.map(s => (
              <label
                key={s.id}
                className="flex items-center gap-3 rounded-xl border border-transparent p-2.5 hover:border-gray-200 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={attendanceMap[s.id] ?? true}
                  onChange={e => setAttendanceMap(prev => ({ ...prev, [s.id]: e.target.checked }))}
                  className="h-5 w-5 accent-green-700"
                />
                <span className="text-sm font-medium text-gray-900 dark:text-white">{s.name}</span>
                <span className="ml-auto text-xs text-gray-400">{s.className}</span>
              </label>
            ))}
          </div>
        )}
        <Button variant="gold" className="mt-4" onClick={handleSubmit} disabled={isPending || isLoading}>
          {isPending ? 'Saving...' : 'Submit Attendance'}
        </Button>
      </GlassCard>
    </div>
  )
}
