import { GlassCard } from '../../../components/ui/GlassCard'
import { Music, Trophy, BookOpen, Palette, Star, Clock, User } from 'lucide-react'

interface Activity {
  id: number
  name: string
  category: string
  icon: React.ElementType
  iconBg: string
  iconColor: string
  coach: string
  venue: string
  schedule: string
  status: 'Active' | 'Completed' | 'On Hold'
  performance: string
  performanceColor: string
  description: string
  achievements: string[]
  upcomingEvent?: string
}

const ACTIVITIES: Activity[] = [
  {
    id: 1,
    name: 'Drama Club',
    category: 'Arts & Culture',
    icon: Star,
    iconBg: 'bg-purple-100 dark:bg-purple-900/30',
    iconColor: 'text-purple-700 dark:text-purple-400',
    coach: 'Ms. Beatrice Chebet',
    venue: 'Theatre Studio',
    schedule: 'Wednesday & Friday, 4:00–6:00 PM',
    status: 'Active',
    performance: 'Excellent',
    performanceColor: 'text-green-600 dark:text-green-400',
    description: 'Amani is an enthusiastic member of the Drama Club. She has taken lead roles in two productions this term and demonstrates strong stage presence.',
    achievements: [
      'Lead role in "The River Speaks" — Term 1 2026',
      'Best Actress nomination — School Drama Festival 2025',
      'Completed voice projection workshop — Jan 2026',
    ],
    upcomingEvent: 'Inter-School Drama Festival — 3 Jul 2026',
  },
  {
    id: 2,
    name: 'Athletics (Track)',
    category: 'Sports',
    icon: Trophy,
    iconBg: 'bg-green-100 dark:bg-green-900/30',
    iconColor: 'text-green-700 dark:text-green-400',
    coach: 'Mr. Samuel Mutua',
    venue: 'School Sports Complex',
    schedule: 'Monday, Wednesday & Friday, 5:00–6:30 AM',
    status: 'Active',
    performance: 'Good',
    performanceColor: 'text-blue-600 dark:text-blue-400',
    description: 'Amani runs the 400m and 4×100m relay. She has shown consistent improvement in her personal best times and good team spirit.',
    achievements: [
      '4×100m relay — 2nd place, Zonal Championships 2025',
      '400m — 3rd place, Inter-House Sports Day 2025',
      'Personal best: 400m in 68.4 seconds (Feb 2026)',
    ],
    upcomingEvent: 'Inter-House Sports Day — 15 Jun 2026',
  },
  {
    id: 3,
    name: 'Piano Lessons',
    category: 'Music',
    icon: Music,
    iconBg: 'bg-yellow-100 dark:bg-yellow-900/30',
    iconColor: 'text-yellow-700 dark:text-yellow-400',
    coach: 'Ms. Carolyne Waweru',
    venue: 'Music Room',
    schedule: 'Tuesday & Thursday, 3:30–4:30 PM',
    status: 'Active',
    performance: 'Excellent',
    performanceColor: 'text-green-600 dark:text-green-400',
    description: 'Amani is currently at Grade 3 ABRSM level. She practices diligently and her sight-reading has improved significantly this term.',
    achievements: [
      'ABRSM Grade 2 — Pass with Merit (Nov 2025)',
      'Solo performance — Annual Music Concert, Dec 2025',
      'Now preparing for ABRSM Grade 3 exam — Aug 2026',
    ],
    upcomingEvent: 'Annual Music Concert — Aug 2026',
  },
  {
    id: 4,
    name: 'Science & Robotics Club',
    category: 'STEM',
    icon: BookOpen,
    iconBg: 'bg-blue-100 dark:bg-blue-900/30',
    iconColor: 'text-blue-700 dark:text-blue-400',
    coach: 'Mr. Eric Kamau',
    venue: 'Science Lab / ICT Room',
    schedule: 'Thursday, 4:00–6:00 PM',
    status: 'Active',
    performance: 'Good',
    performanceColor: 'text-blue-600 dark:text-blue-400',
    description: 'Amani is part of a 4-member team building a solar-powered water pump for the regional STEM expo. She handles programming using block-based coding.',
    achievements: [
      'Participated in Regional STEM Expo 2025',
      'Completed Arduino basics course — Mar 2026',
    ],
    upcomingEvent: 'Regional STEM Expo — Sep 2026',
  },
  {
    id: 5,
    name: 'Creative Arts Club',
    category: 'Arts',
    icon: Palette,
    iconBg: 'bg-orange-100 dark:bg-orange-900/30',
    iconColor: 'text-orange-700 dark:text-orange-400',
    coach: 'Ms. Faith Chebet',
    venue: 'Art Studio',
    schedule: 'Friday, 3:30–5:00 PM',
    status: 'On Hold',
    performance: 'Fair',
    performanceColor: 'text-yellow-600 dark:text-yellow-400',
    description: 'Amani joined this club in Term 1. Attendance has been irregular due to overlapping Drama Club commitments. Resuming next term.',
    achievements: [
      'Submitted artwork to the school gallery — Feb 2026',
    ],
  },
]

const STATUS_STYLES: Record<string, string> = {
  'Active':    'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'Completed': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'On Hold':   'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
}

export function ParentCoCurricular() {
  const active = ACTIVITIES.filter(a => a.status === 'Active').length

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Co-Curricular Activities</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Amani Kariuki · {ACTIVITIES.length} activities enrolled · {active} currently active
        </p>
      </div>

      {/* Summary row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Enrolled', value: ACTIVITIES.length, color: 'text-gray-900 dark:text-white' },
          { label: 'Active',  value: ACTIVITIES.filter(a => a.status === 'Active').length,    color: 'text-green-600 dark:text-green-400' },
          { label: 'On Hold', value: ACTIVITIES.filter(a => a.status === 'On Hold').length,   color: 'text-yellow-600 dark:text-yellow-400' },
          { label: 'Achievements', value: ACTIVITIES.reduce((n, a) => n + a.achievements.length, 0), color: 'text-purple-600 dark:text-purple-400' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4 text-center">
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{s.label}</p>
          </GlassCard>
        ))}
      </div>

      {/* Activity cards */}
      <div className="space-y-4">
        {ACTIVITIES.map(act => {
          const Icon = act.icon
          return (
            <GlassCard key={act.id} className="p-6">
              <div className="flex flex-wrap gap-4 items-start">
                {/* Icon */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${act.iconBg}`}>
                  <Icon className={`h-6 w-6 ${act.iconColor}`} />
                </div>

                {/* Main content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h2 className="font-bold text-gray-900 dark:text-white">{act.name}</h2>
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[act.status]}`}>
                      {act.status}
                    </span>
                    <span className="rounded-full bg-gray-100 dark:bg-gray-800 px-2.5 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {act.category}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 mb-3">{act.description}</p>

                  {/* Meta */}
                  <div className="flex flex-wrap gap-4 text-xs text-gray-500 dark:text-gray-400 mb-4">
                    <span className="flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5" />
                      {act.coach}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      {act.schedule}
                    </span>
                    <span>📍 {act.venue}</span>
                    <span>
                      Performance:{' '}
                      <span className={`font-semibold ${act.performanceColor}`}>{act.performance}</span>
                    </span>
                  </div>

                  {/* Achievements */}
                  {act.achievements.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 mb-1.5">Achievements</p>
                      <ul className="space-y-1">
                        {act.achievements.map((ach, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-gray-700 dark:text-gray-300">
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[#E8B84B]" />
                            {ach}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Upcoming event */}
                  {act.upcomingEvent && (
                    <div className="flex items-center gap-2 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/40 px-3 py-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shrink-0" />
                      <span className="text-xs font-medium text-green-700 dark:text-green-400">
                        Next event: {act.upcomingEvent}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
