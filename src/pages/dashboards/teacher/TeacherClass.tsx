import { GlassCard } from '../../../components/ui/GlassCard'
import { MY_CLASS, gradeColor } from './_data'

export function TeacherClass() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Class</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · {MY_CLASS.length} students</p>
        </div>
        <span className="rounded-full bg-red-50 dark:bg-red-900/30 px-3 py-1 text-sm font-semibold text-red-700 dark:text-red-400">
          {MY_CLASS.filter(s => s.status === 'At Risk').length} at risk
        </span>
      </div>

      <GlassCard className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-sm">
            <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
              <tr>
                {['Student', 'Term Average', 'Attendance', 'Status'].map(h => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50 bg-white dark:bg-gray-900">
              {MY_CLASS.map(s => (
                <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8B84B]/15 text-[10px] font-bold text-[#0d1b0d] dark:text-[#E8B84B]">
                        {s.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="font-medium text-gray-900 dark:text-white">{s.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-20 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                        <div className="h-full rounded-full bg-green-600" style={{ width: `${s.avg}%` }} />
                      </div>
                      <span className={`text-sm font-bold ${gradeColor(s.avg)}`}>{s.avg}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-sm font-semibold ${s.attendance >= 90 ? 'text-green-600 dark:text-green-400' : s.attendance >= 75 ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-600 dark:text-red-400'}`}>
                      {s.attendance}%
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === 'Active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>
                      {s.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
