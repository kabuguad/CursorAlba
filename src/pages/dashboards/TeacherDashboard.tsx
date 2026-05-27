import { useState } from 'react'
import { BookOpen, Users, ClipboardList, CalendarDays, MessageSquare } from 'lucide-react'
import { GlassCard } from '../../components/ui/GlassCard'
import { Button } from '../../components/ui/Button'
import { useToast } from '../../contexts/ToastContext'
import { useAuth } from '../../contexts/AuthContext'
import { useStudents } from '../../hooks/useStudents'
import { useSubmitGrade } from '../../hooks/useGrades'
import { useSubmitAttendance } from '../../hooks/useAttendance'

const SUBJECTS = ['Mathematics', 'English', 'Science', 'Kiswahili', 'Social Studies', 'Creative Arts']

const TABS = [
  { id: 'grades',      label: 'Input Grades',    icon: BookOpen       },
  { id: 'attendance',  label: 'Attendance',      icon: CalendarDays   },
  { id: 'homework',    label: 'Assignments',     icon: ClipboardList  },
  { id: 'myclass',     label: 'My Class',        icon: Users          },
  { id: 'timetable',   label: 'My Timetable',    icon: CalendarDays   },
  { id: 'messages',    label: 'Parent Messages', icon: MessageSquare  },
]

const MY_CLASS = [
  { id: 1, name: 'Amani Kariuki',      avg: 88, attendance: 94, status: 'Active' },
  { id: 2, name: 'Baraka Muthoni',     avg: 72, attendance: 88, status: 'Active' },
  { id: 3, name: 'Cherono Oduor',      avg: 91, attendance: 97, status: 'Active' },
  { id: 4, name: 'Daudi Wairimu',      avg: 65, attendance: 80, status: 'Active' },
  { id: 5, name: 'Eunice Kipchoge',    avg: 84, attendance: 92, status: 'Active' },
  { id: 6, name: 'Farida Nyambura',    avg: 79, attendance: 85, status: 'Active' },
  { id: 7, name: 'Gitonga Odhiambo',   avg: 55, attendance: 70, status: 'At Risk' },
  { id: 8, name: 'Hannah Wanjala',     avg: 93, attendance: 98, status: 'Active' },
  { id: 9, name: 'Ibrahim Mwenda',     avg: 76, attendance: 90, status: 'Active' },
  { id: 10, name: 'Joyce Kamau',        avg: 88, attendance: 95, status: 'Active' },
  { id: 11, name: 'Kelvin Ndirangu',   avg: 48, attendance: 65, status: 'At Risk' },
  { id: 12, name: 'Lydia Otieno',      avg: 82, attendance: 93, status: 'Active' },
]

const POSTED_ASSIGNMENTS = [
  { id: 1, title: 'Algebra Practice — Quadratic Equations',    subject: 'Mathematics',    class: 'Grade 5 Gold',  due: '2026-05-30', submitted: 10, total: 12 },
  { id: 2, title: 'Essay: "My Future Career"',                 subject: 'English',        class: 'Grade 5 Gold',  due: '2026-06-02', submitted: 7,  total: 12 },
  { id: 3, title: 'Lab Report — Photosynthesis Experiment',    subject: 'Science',        class: 'Grade 5 Gold',  due: '2026-05-28', submitted: 12, total: 12 },
  { id: 4, title: 'Map Reading Assignment — Kirinyaga County', subject: 'Social Studies', class: 'Grade 5 Gold',  due: '2026-06-05', submitted: 4,  total: 12 },
]

const TIMETABLE: Record<string, { time: string; subject: string; class_: string; room: string }[]> = {
  Monday:    [
    { time: '7:30–8:30',   subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '9:00–10:00',  subject: 'Mathematics', class_: 'Grade 4 Ruby',  room: 'Room 09' },
    { time: '11:00–12:00', subject: 'Mathematics', class_: 'Grade 6 Jade',  room: 'Room 14' },
  ],
  Tuesday:   [
    { time: '7:30–8:30',   subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '10:00–11:00', subject: 'Mathematics', class_: 'Grade 7 Pearl', room: 'Room 18' },
  ],
  Wednesday: [
    { time: '10:00–11:00', subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '11:00–12:00', subject: 'Mathematics', class_: 'Grade 4 Ruby',  room: 'Room 09' },
    { time: '13:00–14:00', subject: 'Mathematics', class_: 'Grade 6 Jade',  room: 'Room 14' },
  ],
  Thursday:  [
    { time: '13:00–14:00', subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '14:00–15:00', subject: 'Mathematics', class_: 'Grade 7 Pearl', room: 'Room 18' },
  ],
  Friday:    [
    { time: '13:00–14:00', subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '14:00–15:00', subject: 'Mathematics', class_: 'Grade 6 Jade',  room: 'Room 14' },
  ],
}

const MESSAGES = [
  { id: 1, parent: 'Grace Njeri',      student: 'Amani Kariuki',    time: '09:14',  date: '2026-05-27', text: 'Good morning. I wanted to check on Amani\'s progress in Mathematics this term.', read: false },
  { id: 2, parent: 'Peter Muthoni',    student: 'Baraka Muthoni',   time: '08:30',  date: '2026-05-26', text: 'Baraka was unwell last week. Please update his attendance accordingly.', read: true  },
  { id: 3, parent: 'Susan Kipchoge',   student: 'Eunice Kipchoge',  time: '15:45',  date: '2026-05-25', text: 'Thank you for the positive report on Eunice. She is very motivated this term!', read: true  },
  { id: 4, parent: 'John Odhiambo',    student: 'Gitonga Odhiambo', time: '07:55',  date: '2026-05-24', text: 'I am concerned about Gitonga\'s recent grades. Can we schedule a meeting?', read: false },
]

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

function gradeColor(s: number) {
  if (s >= 80) return 'text-green-600 dark:text-green-400'
  if (s >= 60) return 'text-blue-600 dark:text-blue-400'
  if (s >= 40) return 'text-yellow-600 dark:text-yellow-500'
  return 'text-red-600 dark:text-red-400'
}

export function TeacherDashboard() {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [tab, setTab] = useState('grades')
  const [day, setDay] = useState('Monday')

  const { data: students, isLoading: studentsLoading } = useStudents()

  const [gradeForm, setGradeForm] = useState({ studentId: '', subject: 'Mathematics', score: '' })
  const [attendanceMap, setAttendanceMap] = useState<Record<string, boolean>>({})
  const [homework, setHomework] = useState({ title: '', due: '', className: '', subject: 'Mathematics' })
  const [replyMap, setReplyMap] = useState<Record<number, string>>({})

  const { mutate: submitGrade, isPending: gradePending } = useSubmitGrade()
  const { mutate: submitAttendance, isPending: attendancePending } = useSubmitAttendance()

  const visibleStudents = students?.slice(0, 15) ?? []

  const handleGradeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitGrade({ studentId: gradeForm.studentId, subject: gradeForm.subject, score: Number(gradeForm.score) })
    setGradeForm({ ...gradeForm, score: '' })
  }

  const handleAttendanceSubmit = () => {
    const records = visibleStudents.map((s) => ({ studentId: s.id, present: attendanceMap[s.id] ?? true }))
    submitAttendance({ classId: 'cls-grade5-gold', date: new Date().toISOString().split('T')[0], records })
  }

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    showToast(`Assignment "${homework.title}" posted to ${homework.className}`)
    setHomework({ title: '', due: '', className: '', subject: 'Mathematics' })
  }

  const handleReply = (id: number) => {
    if (!replyMap[id]?.trim()) return
    showToast('Message sent to parent')
    setReplyMap(prev => ({ ...prev, [id]: '' }))
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Teacher Portal — {user?.name}</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade 5 Gold · Mathematics · Term 2 2026</p>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
        {TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition whitespace-nowrap ${
              tab === t.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
            }`}
          >
            <t.icon className="h-4 w-4" />
            {t.label}
            {t.id === 'messages' && MESSAGES.filter(m => !m.read).length > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {MESSAGES.filter(m => !m.read).length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <GlassCard className="p-6 max-w-lg">
          <h2 className="mb-4 font-bold text-primary dark:text-gold">Input Grades</h2>
          <form onSubmit={handleGradeSubmit} className="space-y-3">
            {studentsLoading ? (
              <div className="h-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />
            ) : (
              <select required value={gradeForm.studentId} onChange={(e) => setGradeForm({ ...gradeForm, studentId: e.target.value })} className="field">
                <option value="">Select Student</option>
                {students?.map((s) => <option key={s.id} value={s.id}>{s.name} — {s.className}</option>)}
              </select>
            )}
            <select value={gradeForm.subject} onChange={(e) => setGradeForm({ ...gradeForm, subject: e.target.value })} className="field">
              {SUBJECTS.map((sub) => <option key={sub} value={sub}>{sub}</option>)}
            </select>
            <input
              type="number" min={0} max={100} required placeholder="Score (0–100)"
              value={gradeForm.score} onChange={(e) => setGradeForm({ ...gradeForm, score: e.target.value })} className="field"
            />
            <Button type="submit" variant="primary" className="w-full" disabled={gradePending}>
              {gradePending ? 'Saving...' : 'Save Grade'}
            </Button>
          </form>
        </GlassCard>
      )}

      {/* ── ATTENDANCE ── */}
      {tab === 'attendance' && (
        <GlassCard className="p-6">
          <h2 className="mb-4 font-bold">Mark Attendance — {new Date().toLocaleDateString('en-KE', { weekday: 'long', day: 'numeric', month: 'long' })}</h2>
          {studentsLoading ? (
            <div className="space-y-2">
              {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-10 animate-pulse rounded-xl bg-neutral-200 dark:bg-neutral-700" />)}
            </div>
          ) : (
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {visibleStudents.map((s) => (
                <label key={s.id} className="flex items-center gap-3 rounded-xl p-2.5 hover:bg-tint/30 dark:hover:bg-dark-card cursor-pointer border border-transparent hover:border-gray-200 dark:hover:border-gray-700">
                  <input type="checkbox" checked={attendanceMap[s.id] ?? true} onChange={(e) => setAttendanceMap({ ...attendanceMap, [s.id]: e.target.checked })} className="h-5 w-5 accent-primary" />
                  <span className="text-sm font-medium">{s.name}</span>
                  <span className="text-xs text-muted ml-auto">{s.className}</span>
                </label>
              ))}
            </div>
          )}
          <Button variant="gold" className="mt-4" onClick={handleAttendanceSubmit} disabled={attendancePending || studentsLoading}>
            {attendancePending ? 'Saving...' : 'Submit Attendance'}
          </Button>
        </GlassCard>
      )}

      {/* ── HOMEWORK ── */}
      {tab === 'homework' && (
        <div className="space-y-6">
          <GlassCard className="p-6">
            <h2 className="mb-4 font-bold text-primary dark:text-gold">Post New Assignment</h2>
            <form onSubmit={handleHomeworkSubmit} className="grid gap-3 md:grid-cols-2">
              <input required placeholder="Assignment Title" value={homework.title} onChange={(e) => setHomework({ ...homework, title: e.target.value })} className="field md:col-span-2" />
              <select value={homework.subject} onChange={(e) => setHomework({ ...homework, subject: e.target.value })} className="field">
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
              <input required placeholder="Class (e.g. Grade 5 Gold)" value={homework.className} onChange={(e) => setHomework({ ...homework, className: e.target.value })} className="field" />
              <input required type="date" value={homework.due} onChange={(e) => setHomework({ ...homework, due: e.target.value })} className="field" />
              <Button type="submit" variant="primary">Post Assignment</Button>
            </form>
          </GlassCard>

          <GlassCard className="p-6">
            <h2 className="mb-4 font-bold">Posted Assignments</h2>
            <div className="space-y-3">
              {POSTED_ASSIGNMENTS.map(a => (
                <div key={a.id} className="flex flex-wrap items-center gap-4 rounded-xl border border-gray-100 dark:border-gray-700 p-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white">{a.title}</p>
                    <p className="text-xs text-gray-400">{a.subject} · {a.class_} · Due {a.due}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-gray-900 dark:text-white">{a.submitted}/{a.total}</p>
                    <p className="text-xs text-gray-400">submitted</p>
                  </div>
                  <div className="w-24 overflow-hidden rounded-full bg-gray-100 dark:bg-gray-700 h-2">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((a.submitted / a.total) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      )}

      {/* ── MY CLASS ── */}
      {tab === 'myclass' && (
        <div>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">Grade 5 Gold — {MY_CLASS.length} Students</h2>
            <span className="text-sm text-gray-400">{MY_CLASS.filter(s => s.status === 'At Risk').length} at risk</span>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[540px] text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    {['Student', 'Term Average', 'Attendance', 'Status'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {MY_CLASS.map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
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
                            <div className="h-full rounded-full bg-primary" style={{ width: `${s.avg}%` }} />
                          </div>
                          <span className={`text-sm font-bold ${gradeColor(s.avg)}`}>{s.avg}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`text-sm font-semibold ${s.attendance >= 90 ? 'text-green-600 dark:text-green-400' : s.attendance >= 75 ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-600 dark:text-red-400'}`}>{s.attendance}%</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${s.status === 'Active' ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400'}`}>{s.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── TIMETABLE ── */}
      {tab === 'timetable' && (
        <div>
          <div className="mb-4 flex gap-2 overflow-x-auto">
            {DAYS.map(d => (
              <button
                key={d}
                onClick={() => setDay(d)}
                className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                  day === d
                    ? 'bg-primary text-white dark:bg-gold dark:text-dark'
                    : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          {TIMETABLE[day].length === 0 ? (
            <GlassCard className="p-12 text-center text-gray-400">No classes scheduled on {day}</GlassCard>
          ) : (
            <div className="space-y-3">
              {TIMETABLE[day].map((p, i) => (
                <GlassCard key={i} className="p-4">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold font-bold text-lg">{i + 1}</div>
                    <div className="flex-1 grid sm:grid-cols-3 gap-1">
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white">{p.subject}</p>
                        <p className="text-xs text-gray-400">{p.class_}</p>
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5" />
                        {p.time}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{p.room}</div>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ── MESSAGES ── */}
      {tab === 'messages' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900 dark:text-white">Parent Messages</h2>
            <span className="text-sm text-gray-400">{MESSAGES.filter(m => !m.read).length} unread</span>
          </div>
          {MESSAGES.map(m => (
            <GlassCard key={m.id} className={`p-5 ${!m.read ? 'ring-2 ring-primary/20 dark:ring-gold/20' : ''}`}>
              <div className="flex items-start gap-3 mb-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary dark:bg-gold/10 dark:text-gold font-bold text-sm">
                  {m.parent.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-gray-900 dark:text-white">{m.parent}</p>
                    {!m.read && <span className="h-2 w-2 rounded-full bg-primary dark:bg-gold" />}
                  </div>
                  <p className="text-xs text-gray-400">Re: {m.student} · {m.date} {m.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">{m.text}</p>
              <div className="flex gap-2">
                <input
                  placeholder="Reply to parent…"
                  value={replyMap[m.id] ?? ''}
                  onChange={e => setReplyMap(prev => ({ ...prev, [m.id]: e.target.value }))}
                  className="field flex-1 text-sm"
                />
                <Button variant="primary" onClick={() => handleReply(m.id)} className="shrink-0">Reply</Button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  )
}
