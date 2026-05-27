import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Plus, Pencil, Trash2, X, Save } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const CLASSES = ['Grade 4 Gold', 'Grade 5 Ruby', 'Grade 6 Sapphire', 'Grade 7 Emerald', 'Grade 8 Pearl', 'Form 1 Jade', 'Form 2 Topaz', 'Form 3 Onyx', 'Form 4 Diamond']
const SUBJECTS = ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE', 'Creative Arts', 'Physical Education', 'Music', 'Drama', 'History', 'Geography', 'Chemistry', 'Biology', 'Physics']
const TEACHERS = ['Mr. Ochieng', 'Mrs. Wanjiku', 'Mr. Kamau', 'Ms. Akinyi', 'Mr. Njoroge', 'Ms. Chebet', 'Mr. Gitonga', 'Mr. Mutua', 'Ms. Waweru', 'Mr. Kariuki', 'Mrs. Muthoni']
const TIME_SLOTS = ['7:30–8:30', '8:30–9:30', '9:30–10:00 (Break)', '10:00–11:00', '11:00–12:00', '12:00–13:00 (Lunch)', '13:00–14:00', '14:00–15:00', '15:00–15:30 (Prep)']
const ROOMS = ['Room 01', 'Room 02', 'Room 03', 'Room 04', 'Room 05', 'Room 06', 'Room 07', 'Room 08', 'Room 09', 'Room 10', 'Room 11', 'Room 12', 'Room 14', 'Room 18', 'Lab 1', 'Lab 2', 'Lab 3', 'Art Studio', 'Music Room', 'Drama Studio', 'Field', 'Gymnasium']

interface Slot {
  id: string
  day: string
  time: string
  subject: string
  teacher: string
  room: string
}

// Exam timetable
interface ExamEntry {
  id: string
  date: string
  time: string
  subject: string
  class_: string
  duration: string
  venue: string
}

const SEED_SLOTS: Slot[] = [
  { id: 's1', day: 'Monday',    time: '7:30–8:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
  { id: 's2', day: 'Monday',    time: '8:30–9:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08' },
  { id: 's3', day: 'Monday',    time: '10:00–11:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'   },
  { id: 's4', day: 'Monday',    time: '11:00–12:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05' },
  { id: 's5', day: 'Tuesday',   time: '7:30–8:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10' },
  { id: 's6', day: 'Tuesday',   time: '8:30–9:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
  { id: 's7', day: 'Wednesday', time: '7:30–8:30',   subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'   },
  { id: 's8', day: 'Wednesday', time: '10:00–11:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12' },
  { id: 's9', day: 'Thursday',  time: '7:30–8:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08' },
  { id: 's10',day: 'Friday',    time: '13:00–14:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'   },
]

const SEED_EXAMS: ExamEntry[] = [
  { id: 'e1', date: '2026-07-27', time: '8:00–10:00',  subject: 'Mathematics',    class_: 'Grade 5 Ruby',  duration: '2 hrs',   venue: 'Exam Hall A' },
  { id: 'e2', date: '2026-07-27', time: '11:00–13:00', subject: 'English',        class_: 'Grade 5 Ruby',  duration: '2 hrs',   venue: 'Exam Hall B' },
  { id: 'e3', date: '2026-07-28', time: '8:00–10:00',  subject: 'Kiswahili',      class_: 'Grade 5 Ruby',  duration: '2 hrs',   venue: 'Exam Hall A' },
  { id: 'e4', date: '2026-07-28', time: '11:00–12:30', subject: 'Science',        class_: 'Grade 5 Ruby',  duration: '1.5 hrs', venue: 'Lab 1'       },
  { id: 'e5', date: '2026-07-29', time: '8:00–10:00',  subject: 'Social Studies', class_: 'Grade 5 Ruby',  duration: '2 hrs',   venue: 'Exam Hall A' },
  { id: 'e6', date: '2026-07-30', time: '8:00–9:30',   subject: 'CRE',            class_: 'Grade 5 Ruby',  duration: '1.5 hrs', venue: 'Exam Hall B' },
  { id: 'e7', date: '2026-07-30', time: '11:00–12:00', subject: 'Creative Arts',  class_: 'Grade 5 Ruby',  duration: '1 hr',    venue: 'Art Studio'  },
  { id: 'e8', date: '2026-08-01', time: '8:00–10:00',  subject: 'Mathematics',    class_: 'Form 3 Onyx',   duration: '2 hrs',   venue: 'Exam Hall A' },
  { id: 'e9', date: '2026-08-01', time: '11:00–13:00', subject: 'Physics',        class_: 'Form 3 Onyx',   duration: '2 hrs',   venue: 'Lab 1'       },
  { id: 'e10',date: '2026-08-02', time: '8:00–10:00',  subject: 'Chemistry',      class_: 'Form 3 Onyx',   duration: '2 hrs',   venue: 'Lab 2'       },
]

const BLANK_SLOT: Omit<Slot, 'id'> = { day: 'Monday', time: '7:30–8:30', subject: 'Mathematics', teacher: 'Mr. Ochieng', room: 'Room 12' }
const BLANK_EXAM: Omit<ExamEntry, 'id'> = { date: '', time: '8:00–10:00', subject: 'Mathematics', class_: 'Grade 5 Ruby', duration: '2 hrs', venue: 'Exam Hall A' }

function Modal({ open, onClose, title, children }: { open: boolean; onClose: () => void; title: string; children: React.ReactNode }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white dark:bg-gray-800 shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 px-6 py-4">
          <h3 className="font-bold text-gray-900 dark:text-white">{title}</h3>
          <button onClick={onClose} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700"><X className="h-4 w-4" /></button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>,
    document.body,
  )
}

export function TimetableManager() {
  const { showToast } = useToast()
  const [mainTab, setMainTab] = useState<'class' | 'exam'>('class')
  const [selectedClass, setSelectedClass] = useState(CLASSES[0])
  const [selectedDay, setSelectedDay] = useState('Monday')
  const [slots, setSlots] = useState<Slot[]>(SEED_SLOTS)
  const [exams, setExams] = useState<ExamEntry[]>(SEED_EXAMS)

  const [slotModal, setSlotModal] = useState(false)
  const [examModal, setExamModal] = useState(false)
  const [slotDraft, setSlotDraft] = useState<Omit<Slot, 'id'>>(BLANK_SLOT)
  const [examDraft, setExamDraft] = useState<Omit<ExamEntry, 'id'>>(BLANK_EXAM)
  const [editSlotId, setEditSlotId] = useState<string | null>(null)
  const [editExamId, setEditExamId] = useState<string | null>(null)

  const daySlots = slots.filter(s => s.day === selectedDay)

  const saveSlot = () => {
    if (editSlotId) {
      setSlots(prev => prev.map(s => s.id === editSlotId ? { ...slotDraft, id: s.id } : s))
      showToast('Slot updated ✓')
    } else {
      setSlots(prev => [...prev, { ...slotDraft, id: `s-${Date.now()}` }])
      showToast('Slot added ✓')
    }
    setSlotModal(false)
    setEditSlotId(null)
    setSlotDraft(BLANK_SLOT)
  }

  const deleteSlot = (id: string) => {
    setSlots(prev => prev.filter(s => s.id !== id))
    showToast('Slot removed')
  }

  const openEditSlot = (s: Slot) => {
    setSlotDraft({ day: s.day, time: s.time, subject: s.subject, teacher: s.teacher, room: s.room })
    setEditSlotId(s.id)
    setSlotModal(true)
  }

  const saveExam = () => {
    if (!examDraft.date || !examDraft.subject) return showToast('Fill required fields')
    if (editExamId) {
      setExams(prev => prev.map(e => e.id === editExamId ? { ...examDraft, id: e.id } : e))
      showToast('Exam entry updated ✓')
    } else {
      setExams(prev => [...prev, { ...examDraft, id: `ex-${Date.now()}` }])
      showToast('Exam entry added ✓')
    }
    setExamModal(false)
    setEditExamId(null)
    setExamDraft(BLANK_EXAM)
  }

  const deleteExam = (id: string) => {
    setExams(prev => prev.filter(e => e.id !== id))
    showToast('Exam entry removed')
  }

  const openEditExam = (e: ExamEntry) => {
    setExamDraft({ date: e.date, time: e.time, subject: e.subject, class_: e.class_, duration: e.duration, venue: e.venue })
    setEditExamId(e.id)
    setExamModal(true)
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Timetable Manager</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Class schedules and examination timetables</p>
        </div>
        <button
          onClick={() => showToast('Timetable saved ✓')}
          className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition"
        >
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>

      {/* Main tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1 w-fit">
        {[{ id: 'class', label: 'Class Timetable' }, { id: 'exam', label: 'Exam Timetable' }].map(t => (
          <button
            key={t.id}
            onClick={() => setMainTab(t.id as 'class' | 'exam')}
            className={`rounded-lg px-5 py-2 text-sm font-medium transition ${mainTab === t.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── CLASS TIMETABLE ── */}
      {mainTab === 'class' && (
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <select className={`${INP} w-auto`} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {CLASSES.map(c => <option key={c}>{c}</option>)}
            </select>
            <div className="flex gap-1 overflow-x-auto">
              {DAYS.map(d => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`shrink-0 rounded-xl px-4 py-2 text-sm font-medium transition ${
                    selectedDay === d
                      ? 'bg-[#0d1b0d] text-white dark:bg-[#E8B84B] dark:text-[#0d1b0d]'
                      : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <button
              onClick={() => { setSlotDraft({ ...BLANK_SLOT, day: selectedDay }); setEditSlotId(null); setSlotModal(true) }}
              className="ml-auto flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]"
            >
              <Plus className="h-4 w-4" /> Add Slot
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    {['Time', 'Subject', 'Teacher', 'Room', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {daySlots.length === 0 ? (
                    <tr><td colSpan={5} className="px-5 py-12 text-center text-gray-400">No slots for {selectedDay} — click "Add Slot" to begin</td></tr>
                  ) : daySlots.sort((a, b) => a.time.localeCompare(b.time)).map(s => (
                    <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-5 py-3.5 font-mono text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{s.time}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{s.subject}</td>
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{s.teacher}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{s.room}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEditSlot(s)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => deleteSlot(s.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── EXAM TIMETABLE ── */}
      {mainTab === 'exam' && (
        <div>
          <div className="mb-4 flex justify-end">
            <button
              onClick={() => { setExamDraft(BLANK_EXAM); setEditExamId(null); setExamModal(true) }}
              className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]"
            >
              <Plus className="h-4 w-4" /> Add Exam
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    {['Date', 'Time', 'Subject', 'Class', 'Duration', 'Venue', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {exams.sort((a, b) => a.date.localeCompare(b.date)).map(e => (
                    <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                      <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300 whitespace-nowrap">{e.date}</td>
                      <td className="px-5 py-3.5 font-mono text-sm text-gray-600 dark:text-gray-300 whitespace-nowrap">{e.time}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900 dark:text-white">{e.subject}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{e.class_}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{e.duration}</td>
                      <td className="px-5 py-3.5 text-gray-500 dark:text-gray-400">{e.venue}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          <button onClick={() => openEditExam(e)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600"><Pencil className="h-4 w-4" /></button>
                          <button onClick={() => deleteExam(e.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {exams.length === 0 && (
                    <tr><td colSpan={7} className="px-5 py-12 text-center text-gray-400">No exam entries — click "Add Exam" to begin</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Slot Modal */}
      <Modal open={slotModal} onClose={() => setSlotModal(false)} title={editSlotId ? 'Edit Slot' : 'Add Timetable Slot'}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Day</label>
              <select className={INP} value={slotDraft.day} onChange={e => setSlotDraft({ ...slotDraft, day: e.target.value })}>
                {DAYS.map(d => <option key={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Time Slot</label>
              <select className={INP} value={slotDraft.time} onChange={e => setSlotDraft({ ...slotDraft, time: e.target.value })}>
                {TIME_SLOTS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Subject *</label>
              <select className={INP} value={slotDraft.subject} onChange={e => setSlotDraft({ ...slotDraft, subject: e.target.value })}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Teacher</label>
              <select className={INP} value={slotDraft.teacher} onChange={e => setSlotDraft({ ...slotDraft, teacher: e.target.value })}>
                {TEACHERS.map(t => <option key={t}>{t}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Room</label>
              <select className={INP} value={slotDraft.room} onChange={e => setSlotDraft({ ...slotDraft, room: e.target.value })}>
                {ROOMS.map(r => <option key={r}>{r}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setSlotModal(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveSlot} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{editSlotId ? 'Update' : 'Add Slot'}</button>
          </div>
        </div>
      </Modal>

      {/* Exam Modal */}
      <Modal open={examModal} onClose={() => setExamModal(false)} title={editExamId ? 'Edit Exam Entry' : 'Add Exam Entry'}>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className={LABEL}>Date *</label>
              <input type="date" className={INP} value={examDraft.date} onChange={e => setExamDraft({ ...examDraft, date: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Time</label>
              <input className={INP} placeholder="e.g. 8:00–10:00" value={examDraft.time} onChange={e => setExamDraft({ ...examDraft, time: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Subject *</label>
              <select className={INP} value={examDraft.subject} onChange={e => setExamDraft({ ...examDraft, subject: e.target.value })}>
                {SUBJECTS.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Class</label>
              <select className={INP} value={examDraft.class_} onChange={e => setExamDraft({ ...examDraft, class_: e.target.value })}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={LABEL}>Duration</label>
              <input className={INP} placeholder="e.g. 2 hrs" value={examDraft.duration} onChange={e => setExamDraft({ ...examDraft, duration: e.target.value })} />
            </div>
            <div>
              <label className={LABEL}>Venue</label>
              <input className={INP} placeholder="e.g. Exam Hall A" value={examDraft.venue} onChange={e => setExamDraft({ ...examDraft, venue: e.target.value })} />
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <button onClick={() => setExamModal(false)} className="rounded-lg px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
            <button onClick={saveExam} className="rounded-xl bg-[#E8B84B] px-5 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">{editExamId ? 'Update' : 'Add Entry'}</button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
