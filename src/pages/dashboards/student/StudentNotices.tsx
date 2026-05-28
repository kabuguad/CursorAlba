import { Bell, AlertTriangle, Info, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { useStudentAnnouncements } from '../../../hooks/useStudentData'

const PRIORITY_META = {
  normal: { icon: Info,         color:'text-blue-600 dark:text-blue-400',  bg:'bg-blue-50 dark:bg-blue-900/20',   dot:'bg-blue-500'  },
  high:   { icon: Bell,         color:'text-amber-600 dark:text-amber-400', bg:'bg-amber-50 dark:bg-amber-900/20', dot:'bg-amber-500' },
  urgent: { icon: AlertTriangle, color:'text-red-600 dark:text-red-400',    bg:'bg-red-50 dark:bg-red-900/20',     dot:'bg-red-500'   },
}

export function StudentNotices() {
  const { data: notices, isLoading } = useStudentAnnouncements()
  const [expanded, setExpanded] = useState<string | null>(null)

  if (isLoading) {
    return <div className="mx-auto max-w-3xl px-4 py-8 space-y-3">
      {[1,2,3].map(i => <div key={i} className="h-20 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  const items = notices ?? []
  const urgent = items.filter(n => n.priority === 'urgent').length

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notices & Announcements</h1>
          <p className="text-sm text-gray-400 mt-0.5">{items.length} announcements · {urgent > 0 && `${urgent} urgent`}</p>
        </div>
        {urgent > 0 && (
          <div className="flex items-center gap-1.5 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 px-3 py-1.5 text-sm font-semibold">
            <AlertTriangle className="h-4 w-4" /> {urgent} urgent
          </div>
        )}
      </div>

      {items.length === 0 ? (
        <GlassCard className="p-12 text-center">
          <Bell className="mx-auto h-12 w-12 text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-400">No announcements at this time</p>
        </GlassCard>
      ) : (
        <div className="space-y-3">
          {items.map(n => {
            const meta  = PRIORITY_META[n.priority] ?? PRIORITY_META.normal
            const Icon  = meta.icon
            const isExp = expanded === n.id
            const published = new Date(n.publishAt).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })

            return (
              <GlassCard key={n.id} className={`overflow-hidden transition-all ${meta.bg}`}>
                <button
                  className="w-full text-left p-5"
                  onClick={() => setExpanded(isExp ? null : n.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm mt-0.5`}>
                      <Icon className={`h-4 w-4 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{n.title}</h3>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className={`h-2 w-2 rounded-full ${meta.dot}`} />
                          <span className="text-xs text-gray-400 capitalize">{n.priority}</span>
                          {isExp ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
                        </div>
                      </div>
                      <p className={`text-sm text-gray-500 dark:text-gray-400 mt-0.5 ${isExp ? '' : 'line-clamp-2'}`}>
                        {n.body}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">Published {published}</p>
                    </div>
                  </div>
                </button>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
