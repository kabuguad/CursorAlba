import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Bell, Search, CheckCheck, ChevronDown, Paperclip, Calendar } from 'lucide-react'

type Category = 'all' | 'circular' | 'meeting' | 'deadline' | 'event' | 'policy'

interface Notice {
  id: string
  title: string
  body: string
  from: string
  date: string
  category: Exclude<Category, 'all'>
  read: boolean
  attachment?: string
  priority: 'high' | 'normal' | 'low'
}

const INITIAL_NOTICES: Notice[] = [
  {
    id: 'n1', category: 'deadline', priority: 'high', read: false,
    title: 'Deadline: Term 2 Scheme of Work Submission',
    from: 'Deputy Head (Academics)', date: '2025-05-27',
    body: 'All subject teachers are reminded to submit their Term 2 Scheme of Work to the Academics Office by Friday, 30 May 2025. Late submissions will be noted in the professional conduct file. Soft copies should be emailed to academics@alberschool.ke and hard copies placed in your departmental tray.',
  },
  {
    id: 'n2', category: 'meeting', priority: 'high', read: false,
    title: 'Staff Meeting — Friday 30 May 2025, 4:00 PM',
    from: 'Head Teacher', date: '2025-05-26',
    body: 'There will be a mandatory staff meeting this Friday at 4:00 PM in the Main Staffroom. Agenda: (1) End-of-term examination timetable, (2) CBC progress review, (3) Co-curricular day planning, (4) AOB. Attendance is compulsory. Kindly notify HOD if you have a conflict.',
  },
  {
    id: 'n3', category: 'circular', priority: 'normal', read: false,
    title: 'Updated Student Discipline Policy — Effective June 2025',
    from: 'Head Teacher', date: '2025-05-22',
    body: 'Following the Board of Governors review, the Student Discipline Policy has been updated. Key changes include: (1) Three-stage bullying intervention process, (2) Mandatory counselling for repeat offenders before suspension, (3) Parent conference requirement for serious misconduct. Full policy document attached. Please read and sign the acknowledgement form before 2 June.',
    attachment: 'Discipline_Policy_2025.pdf',
  },
  {
    id: 'n4', category: 'event', priority: 'normal', read: true,
    title: 'Inter-Schools Athletics Day — 14 June 2025',
    from: 'Games & Sports Department', date: '2025-05-20',
    body: 'Alber School will host the Kirinyaga Central Zone Athletics Day on Saturday, 14 June 2025. Teachers are requested to volunteer for duty. Volunteer sign-up sheet is on the staffroom noticeboard. Lunch will be provided for duty teachers. Wear school colours. Event starts at 8:00 AM.',
  },
  {
    id: 'n5', category: 'deadline', priority: 'normal', read: true,
    title: 'Grade Entry Deadline — Term 2 CAT 2',
    from: 'Examinations Office', date: '2025-05-18',
    body: 'Please note that all CAT 2 scores must be entered into the school management system by Monday, 2 June 2025. Any scores submitted after this date will require the Head Teacher\'s approval to be included in the mid-term report cards. Contact the exams office if you have any queries.',
  },
  {
    id: 'n6', category: 'policy', priority: 'low', read: true,
    title: 'Fire Drill Scheduled — Wednesday 4 June, 10:00 AM',
    from: 'Safety & Security Officer', date: '2025-05-15',
    body: 'An unannounced (simulated) fire drill will take place on Wednesday, 4 June at approximately 10:00 AM. Teachers should note the assembly points for their respective classes and ensure all students are briefed on evacuation procedures. Do not inform students of the date/time.',
  },
  {
    id: 'n7', category: 'circular', priority: 'low', read: true,
    title: 'CPD Workshop — Digital Tools in CBC Classrooms',
    from: 'Professional Development Committee', date: '2025-05-10',
    body: 'A free CPD workshop on "Digital Tools for CBC Instruction" will be held on Saturday, 7 June from 9 AM to 1 PM in the ICT Lab. Facilitated by KICD trainers. CPD certificates will be issued. Seats are limited — please RSVP to the PDC by 30 May via the sign-up sheet in the staffroom.',
    attachment: 'CPD_Workshop_Programme.pdf',
  },
]

const CATEGORIES: { value: Category; label: string }[] = [
  { value: 'all',      label: 'All Notices' },
  { value: 'deadline', label: 'Deadlines'   },
  { value: 'meeting',  label: 'Meetings'    },
  { value: 'circular', label: 'Circulars'   },
  { value: 'event',    label: 'Events'      },
  { value: 'policy',   label: 'Policy'      },
]

const CAT_COLORS: Record<Exclude<Category, 'all'>, string> = {
  deadline: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300',
  meeting:  'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  circular: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  event:    'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  policy:   'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

export function TeacherNotices() {
  const [notices, setNotices] = useState<Notice[]>(INITIAL_NOTICES)
  const [category, setCategory] = useState<Category>('all')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = notices.filter(n => {
    const matchCat = category === 'all' || n.category === category
    const matchSearch = !search || n.title.toLowerCase().includes(search.toLowerCase()) || n.body.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  const unreadCount = notices.filter(n => !n.read).length

  function markRead(id: string) {
    setNotices(prev => prev.map(n => n.id === id ? { ...n, read: true } : n))
  }

  function markAllRead() {
    setNotices(prev => prev.map(n => ({ ...n, read: true })))
  }

  function toggleExpand(id: string) {
    setExpandedId(prev => prev === id ? null : id)
    markRead(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            Staff Noticeboard
            {unreadCount > 0 && (
              <span className="text-sm font-normal bg-red-500 text-white px-2 py-0.5 rounded-full">{unreadCount} new</span>
            )}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Circulars, meetings, deadlines and announcements from school management</p>
        </div>
        {unreadCount > 0 && (
          <button onClick={markAllRead} className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline">
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search notices…"
            className="field pl-9"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <div className="relative">
          <select
            className="field pr-8 appearance-none"
            value={category}
            onChange={e => setCategory(e.target.value as Category)}
          >
            {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Category chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map(c => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={`text-xs px-3 py-1.5 rounded-full font-medium transition-colors ${category === c.value ? 'bg-emerald-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'}`}
          >
            {c.label}
            {c.value !== 'all' && <span className="ml-1 text-gray-400">{notices.filter(n => n.category === c.value).length}</span>}
          </button>
        ))}
      </div>

      {/* Notice List */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <Bell className="w-8 h-8 mx-auto mb-3 opacity-40" />
            <p>No notices found</p>
          </div>
        )}
        {filtered.map(notice => {
          const isExpanded = expandedId === notice.id
          return (
            <GlassCard
              key={notice.id}
              className={`overflow-hidden transition-all ${!notice.read ? 'border-l-4 border-l-emerald-500' : ''}`}
            >
              <button
                className="w-full text-left p-5 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                onClick={() => toggleExpand(notice.id)}
              >
                <div className="flex items-start gap-3">
                  {!notice.read && <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0 mt-1.5" />}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CAT_COLORS[notice.category]}`}>
                        {notice.category.charAt(0).toUpperCase() + notice.category.slice(1)}
                      </span>
                      {notice.priority === 'high' && (
                        <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          High Priority
                        </span>
                      )}
                      {notice.attachment && (
                        <span className="text-xs flex items-center gap-1 text-gray-400">
                          <Paperclip className="w-3 h-3" /> Attachment
                        </span>
                      )}
                    </div>
                    <p className={`text-sm font-semibold ${notice.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                      {notice.title}
                    </p>
                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-2">
                      <span>{notice.from}</span>
                      <span>·</span>
                      <Calendar className="w-3 h-3" />
                      <span>{notice.date}</span>
                    </p>
                    {!isExpanded && (
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{notice.body}</p>
                    )}
                  </div>
                  <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
              </button>

              {isExpanded && (
                <div className="px-5 pb-5 border-t border-gray-100 dark:border-gray-700 pt-4">
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{notice.body}</p>
                  {notice.attachment && (
                    <div className="mt-4">
                      <button className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 hover:underline bg-emerald-50 dark:bg-emerald-900/20 px-3 py-2 rounded-lg">
                        <Paperclip className="w-4 h-4" /> {notice.attachment}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
