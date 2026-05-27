import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Search, CheckCheck } from 'lucide-react'

interface Notice {
  id: number
  title: string
  date: string
  category: string
  body: string
  read: boolean
}

const INITIAL_NOTICES: Notice[] = [
  { id: 1, title: 'Term 2 Examination Timetable Released',   date: '26 May 2026', category: 'Academic',      read: false, body: "The Term 2 examination timetable has been released. Exams begin 27 July 2026. Please collect your child's admit card from the school office from 1 July 2026. Students who have outstanding fee balances must clear them before picking up admit cards." },
  { id: 2, title: 'Drama Festival Rehearsals',               date: '24 May 2026', category: 'Co-curricular', read: false, body: 'Students selected for the Inter-School Drama Festival must attend rehearsals every Wednesday 4–6 PM in the Theatre Studio starting 28 May 2026. A consent form will be sent home this week.' },
  { id: 3, title: 'School Fees Reminder — Term 2',           date: '20 May 2026', category: 'Finance',       read: false, body: 'Term 2 fees are due by 15 June 2026. Parents are advised to clear all outstanding balances promptly to avoid inconveniences. Payments can be made via M-Pesa Paybill 522522 (Account: Student Admission Number).' },
  { id: 4, title: 'Sports Day — Inter-House Championships',  date: '15 May 2026', category: 'Sports',        read: true,  body: 'The Annual Inter-House Athletics Championship will be held on 15 June 2026 at the School Sports Complex. All students are required to attend and wear their house colours. Parents and guardians are warmly invited to cheer.' },
  { id: 5, title: 'Parent-Teacher Conference Scheduled',     date: '10 May 2026', category: 'Meeting',       read: true,  body: 'The Term 2 Parent-Teacher Conference is scheduled for 22 June 2026, 8:00 AM – 4:00 PM. Booking of slots is now open. Please book your 15-minute slot via the portal (Meetings section) or call the school office on 0712-345-678.' },
  { id: 6, title: 'New School Canteen Menu — Term 2',        date: '2 May 2026',  category: 'General',       read: true,  body: 'The school canteen has introduced a new balanced meal plan for Term 2. All hot meals are prepared fresh daily. A copy of the weekly menu is available at the school office and will be sent home in the student diary.' },
  { id: 7, title: 'Road Safety Week — Student Awareness',    date: '28 Apr 2026', category: 'General',       read: true,  body: 'Alber School will participate in the National Road Safety Week from 4–8 May 2026. Students will receive age-appropriate road safety lessons. Parents are encouraged to reinforce road safety habits at home.' },
  { id: 8, title: 'Term 2 Opening — Stationery Requirements',date: '20 Apr 2026', category: 'Academic',      read: true,  body: 'The full list of required stationery and textbooks for Term 2 has been published on the school notice board and is available from the school office. Parents are asked to ensure all items are in place by the second week of term.' },
]

const CATEGORIES = ['All', 'Academic', 'Finance', 'Sports', 'Meeting', 'Co-curricular', 'General']

const CAT_STYLES: Record<string, string> = {
  Academic:        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Co-curricular': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Finance:         'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Sports:          'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Meeting:         'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  General:         'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300',
}

export function ParentNotices() {
  const [notices, setNotices] = useState(INITIAL_NOTICES)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [expanded, setExpanded] = useState<number | null>(null)

  const unread = notices.filter(n => !n.read).length

  const filtered = notices.filter(n => {
    const matchCat = category === 'All' || n.category === category
    const matchSearch = n.title.toLowerCase().includes(search.toLowerCase()) ||
                        n.body.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const markRead = (id: number) => {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  const markAllRead = () => {
    setNotices(prev => prev.map(n => ({ ...n, read: true })))
  }

  const handleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id)
    markRead(id)
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-5">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">School Notices</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {notices.length} notices{unread > 0 ? ` · ${unread} unread` : ' · all read'}
          </p>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 rounded-xl border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition"
          >
            <CheckCheck className="h-4 w-4" />
            Mark all read
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search notices…"
          className="field w-full pl-10"
        />
      </div>

      {/* Category filter */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold transition ${
              category === cat
                ? cat === 'All'
                  ? 'bg-gray-800 dark:bg-white text-white dark:text-gray-900'
                  : CAT_STYLES[cat] + ' ring-1 ring-inset ring-current/20'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Notices list */}
      {filtered.length === 0 && (
        <GlassCard className="p-8 text-center">
          <p className="text-gray-400">No notices match your search.</p>
        </GlassCard>
      )}

      <div className="space-y-2">
        {filtered.map(notice => {
          const isExpanded = expanded === notice.id
          return (
            <GlassCard
              key={notice.id}
              className={`overflow-hidden transition-all ${!notice.read ? 'ring-1 ring-blue-200 dark:ring-blue-800' : ''}`}
            >
              <button
                className="w-full p-5 text-left"
                onClick={() => handleExpand(notice.id)}
              >
                <div className="flex items-start gap-3">
                  {/* Unread indicator */}
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full transition-all ${notice.read ? 'bg-transparent' : 'bg-blue-500'}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${CAT_STYLES[notice.category] ?? CAT_STYLES.General}`}>
                        {notice.category}
                      </span>
                      <span className="text-xs text-gray-400">{notice.date}</span>
                    </div>
                    <h3 className={`text-sm font-semibold leading-snug ${notice.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {notice.title}
                    </h3>
                    {!isExpanded && (
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">{notice.body}</p>
                    )}
                  </div>
                </div>
              </button>

              {isExpanded && (
                <div className="border-t border-gray-100 dark:border-gray-800 px-5 pb-5 pt-3">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{notice.body}</p>
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>

    </div>
  )
}
