import { GlassCard } from '../../../components/ui/GlassCard'

const ANNOUNCEMENTS = [
  { id: 1, title: 'Term 2 Examination Timetable Released',    date: '2026-05-26', category: 'Academic',      body: "The Term 2 examination timetable has been released. Exams begin 27 July 2026. Please collect your child's admit card from the school office." },
  { id: 2, title: 'Drama Festival Rehearsals',                date: '2026-05-24', category: 'Co-curricular', body: 'Students selected for the Inter-School Drama Festival must attend rehearsals every Wednesday 4–6 PM in the Theatre Studio.' },
  { id: 3, title: 'School Fees Reminder — Term 2',            date: '2026-05-20', category: 'Finance',       body: 'Term 2 fees are due by 15 June 2026. Kindly clear any outstanding balances. M-Pesa Paybill: 522522.' },
  { id: 4, title: 'Sports Day — Inter-House Championships',   date: '2026-06-15', category: 'Sports',        body: 'Annual inter-house athletics will be held on 15 June at the Sports Complex. Students should wear house colours.' },
  { id: 5, title: 'Parent-Teacher Conference Scheduled',      date: '2026-05-15', category: 'Meeting',       body: 'The Term 2 Parent-Teacher conference is scheduled for 22 June 2026. Please book your slot via the school office or call 0712-345-678.' },
]

const CAT_STYLES: Record<string, string> = {
  Academic:        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Co-curricular': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Finance:         'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Sports:          'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  Meeting:         'bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  General:         'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

export function ParentNotices() {
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
