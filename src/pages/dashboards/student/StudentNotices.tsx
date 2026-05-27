import { GlassCard } from '../../../components/ui/GlassCard'
import { ANNOUNCEMENTS, CAT_STYLES } from './_data'

export function StudentNotices() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Notices</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">{ANNOUNCEMENTS.length} announcements</p>
      </div>

      {ANNOUNCEMENTS.map(a => (
        <GlassCard key={a.id} className="p-6">
          <div className="flex flex-wrap items-start gap-3 mb-3">
            <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${CAT_STYLES[a.category] ?? CAT_STYLES.General}`}>
              {a.category}
            </span>
            <span className="text-xs text-gray-400 ml-auto">{a.date}</span>
          </div>
          <h3 className="mb-2 font-bold text-gray-900 dark:text-white">{a.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">{a.body}</p>
        </GlassCard>
      ))}
    </div>
  )
}
