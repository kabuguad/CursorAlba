import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts'
import { GlassCard } from '../../../components/ui/GlassCard'
import { GRADES, gradeColor } from './_data'

export function StudentGrades() {
  const avg = Math.round(GRADES.reduce((s, g) => s + g.score, 0) / GRADES.length)

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Grades</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Term 2, 2026 · Grade 5 Gold</p>
      </div>

      <GlassCard className="p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">Grade Report — Term 2 2026</h2>
          <span className="rounded-full bg-green-50 dark:bg-green-900/30 px-3 py-1 text-sm font-semibold text-green-700 dark:text-green-400">
            Average: {avg}%
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700">
              <tr>
                {['Subject', 'Score', 'Grade', 'Remarks'].map(h => (
                  <th key={h} className="pb-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
              {GRADES.map(g => (
                <tr key={g.subject} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="py-3.5 font-medium text-gray-900 dark:text-white">{g.subject}</td>
                  <td className="py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                        <div className="h-full rounded-full bg-green-600" style={{ width: `${g.score}%` }} />
                      </div>
                      <span className={`font-bold ${gradeColor(g.score)}`}>{g.score}%</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${gradeColor(g.score)}`}>{g.grade}</span>
                  </td>
                  <td className="py-3.5 text-gray-400 text-xs">
                    {g.score >= 90 ? 'Excellent — keep it up!' : g.score >= 75 ? 'Good performance' : g.score >= 60 ? 'Satisfactory' : 'Needs improvement'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <GlassCard className="p-6">
        <h2 className="mb-4 font-bold text-gray-900 dark:text-white">Performance Chart</h2>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={GRADES} margin={{ top: 0, right: 0, left: -20, bottom: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.06)" />
            <XAxis dataKey="subject" tick={{ fontSize: 11 }} angle={-20} textAnchor="end" height={50} />
            <YAxis domain={[0, 100]} />
            <Tooltip formatter={(v: number) => [`${v}%`, 'Score']} />
            <Bar dataKey="score" fill="#15803d" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </GlassCard>
    </div>
  )
}
