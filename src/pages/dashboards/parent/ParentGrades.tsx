import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useStudentGrades } from '../../../hooks/useGrades'

const LINKED_STUDENT_ID = 's-1'

export function ParentGrades() {
  const { data: progress, isLoading } = useStudentGrades(LINKED_STUDENT_ID)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Grade Progress</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Grade 5 Gold · Term 2, 2026</p>
      </div>

      <GlassCard className="p-6">
        {progress && (
          <p className="mb-4 text-sm text-gray-500 dark:text-gray-400">
            Average: <span className="font-semibold text-gray-900 dark:text-white">{progress.average}%</span>
            {' · '}
            Trend:{' '}
            <span className={progress.trend === 'up' ? 'text-green-600 dark:text-green-400' : progress.trend === 'down' ? 'text-red-500' : 'text-gray-400'}>
              {progress.trend === 'up' ? '↑ Improving' : progress.trend === 'down' ? '↓ Declining' : '→ Stable'}
            </span>
          </p>
        )}
        {isLoading ? (
          <div className="h-[250px] animate-pulse rounded-xl bg-gray-200 dark:bg-gray-700" />
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={progress?.grades}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
              <XAxis dataKey="subject" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip formatter={(val: number) => [`${val}%`, 'Score']} />
              <Bar dataKey="score" fill="#15803d" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </GlassCard>
    </div>
  )
}
