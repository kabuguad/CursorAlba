import { useState } from 'react'
import { Save, BookOpen, Users, CalendarDays, Layers, Plus, Trash2, Edit2, Check, X, ChevronUp, ChevronDown } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'
import { usePillars } from '../../../contexts/PillarsContext'
import { GRADIENT_MAP, type Pillar } from '../../../data/pillars'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TABS = [
  { id: 'grades',     label: 'Grade Entry',       icon: BookOpen  },
  { id: 'attendance', label: 'Attendance',         icon: Users     },
  { id: 'calendar',   label: 'Academic Calendar',  icon: CalendarDays },
  { id: 'pillars',    label: 'Teaching Pillars',   icon: Layers    },
]

const SUBJECTS = ['Mathematics', 'English', 'Kiswahili', 'Science', 'Social Studies', 'CRE', 'Creative Arts', 'Physical Education']
const CLASSES_LIST = ['Grade 4 Gold', 'Grade 5 Ruby', 'Grade 6 Sapphire', 'Grade 7 Emerald', 'Grade 8 Pearl', 'Form 2 Jade', 'Form 3 Topaz', 'Form 4 Onyx']
const STUDENT_NAMES = ['Amani Kariuki', 'Baraka Muthoni', 'Cherono Oduor', 'Daudi Wairimu', 'Eunice Kipchoge', 'Farida Nyambura', 'Gitonga Odhiambo', 'Hannah Wanjala']

const TERMS = ['Term 1 2026', 'Term 2 2026', 'Term 3 2026']
const CALENDAR = [
  { term: 'Term 1', open: '2026-01-06', close: '2026-04-04', exams: '2026-03-23 – 2026-04-04' },
  { term: 'Term 2', open: '2026-04-27', close: '2026-08-07', exams: '2026-07-27 – 2026-08-07' },
  { term: 'Term 3', open: '2026-09-07', close: '2026-11-27', exams: '2026-11-16 – 2026-11-27' },
]

function gradeColor(g: number) {
  if (g >= 80) return 'text-green-600 dark:text-green-400'
  if (g >= 60) return 'text-blue-600 dark:text-blue-400'
  if (g >= 40) return 'text-yellow-600 dark:text-yellow-500'
  return 'text-red-600 dark:text-red-400'
}

function gradeLabel(g: number) {
  if (g >= 80) return 'A'
  if (g >= 70) return 'B+'
  if (g >= 60) return 'B'
  if (g >= 50) return 'C+'
  if (g >= 40) return 'C'
  return 'D'
}

const BLANK_PILLAR: Omit<Pillar, 'id'> = { icon: '📌', title: '', desc: '', gradient: 'green' }

function PillarForm({ draft, onChange }: { draft: Omit<Pillar, 'id'>; onChange: (d: Omit<Pillar, 'id'>) => void }) {
  const selectedGradient = GRADIENT_MAP[draft.gradient] ?? GRADIENT_MAP.green
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className={LABEL}>Icon (emoji)</label>
          <input className={INP} value={draft.icon} onChange={e => onChange({ ...draft, icon: e.target.value })} placeholder="🌱" style={{ fontSize: 20 }} />
          <p className="mt-1 text-[10px] text-gray-400">Paste or type any emoji</p>
        </div>
        <div>
          <label className={LABEL}>Title *</label>
          <input className={INP} value={draft.title} onChange={e => onChange({ ...draft, title: e.target.value })} placeholder="e.g. Holistic Development" />
        </div>
      </div>
      <div>
        <label className={LABEL}>Description</label>
        <textarea rows={3} className={`${INP} resize-none`} value={draft.desc} onChange={e => onChange({ ...draft, desc: e.target.value })} placeholder="Describe what this pillar means for learners…" />
      </div>
      <div>
        <label className={LABEL}>Card Gradient Colour</label>
        <div className="flex flex-wrap gap-2 mt-1">
          {Object.entries(GRADIENT_MAP).map(([key, g]) => (
            <button key={key} type="button" onClick={() => onChange({ ...draft, gradient: key })} title={g.label}
              className={`flex items-center gap-1.5 rounded-lg border-2 px-3 py-1.5 text-xs font-semibold transition ${draft.gradient === key ? 'border-gray-800 dark:border-white scale-105 shadow-sm' : 'border-transparent hover:border-gray-300 dark:hover:border-gray-500'}`}>
              <span className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ backgroundColor: g.preview }} />
              {g.label}
            </button>
          ))}
        </div>
        <div className={`mt-3 flex items-start gap-4 rounded-2xl border bg-gradient-to-br p-5 ${selectedGradient.color} ${selectedGradient.border}`}>
          <span className="text-3xl">{draft.icon || '📌'}</span>
          <div>
            <p className="font-bold text-gray-900 dark:text-white">{draft.title || 'Pillar Title'}</p>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{draft.desc || 'Pillar description will appear here.'}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function PillarsTab() {
  const { showToast } = useToast()
  const { pillars, updatePillars } = usePillars()
  const [editing, setEditing] = useState<string | 'new' | null>(null)
  const [draft, setDraft] = useState<Omit<Pillar, 'id'>>(BLANK_PILLAR)

  const openEdit = (p: Pillar) => { setDraft({ icon: p.icon, title: p.title, desc: p.desc, gradient: p.gradient }); setEditing(p.id) }
  const openNew  = () => { setDraft({ ...BLANK_PILLAR }); setEditing('new') }
  const close    = () => setEditing(null)

  const save = () => {
    if (!draft.title.trim()) return showToast('Title is required')
    const next = editing === 'new'
      ? [...pillars, { ...draft, id: `p-${Date.now()}` }]
      : pillars.map(p => p.id === editing ? { ...draft, id: p.id } : p)
    updatePillars(next)
    showToast(editing === 'new' ? 'Pillar added ✓' : 'Pillar updated ✓')
    close()
  }

  const del = (id: string) => {
    if (!confirm('Delete this pillar?')) return
    updatePillars(pillars.filter(p => p.id !== id))
    showToast('Pillar deleted')
  }

  const move = (id: string, dir: -1 | 1) => {
    const idx = pillars.findIndex(p => p.id === id)
    const next = [...pillars]
    const swap = idx + dir
    if (swap < 0 || swap >= next.length) return
    ;[next[idx], next[swap]] = [next[swap], next[idx]]
    updatePillars(next)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {pillars.length} pillar{pillars.length !== 1 ? 's' : ''} · changes save instantly to the public Academics page.
        </p>
        {editing === null && (
          <button onClick={openNew} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
            <Plus className="h-4 w-4" /> Add Pillar
          </button>
        )}
      </div>

      {pillars.map((p, i) => {
        const g = GRADIENT_MAP[p.gradient] ?? GRADIENT_MAP.green
        return (
          <div key={p.id} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            {editing === p.id ? (
              <div className="p-6">
                <PillarForm draft={draft} onChange={setDraft} />
                <div className="mt-4 flex gap-2">
                  <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
                    <Check className="h-3.5 w-3.5" /> Save
                  </button>
                  <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="flex items-start gap-4 p-5">
                <div className={`flex-shrink-0 flex h-14 w-14 items-center justify-center rounded-xl border bg-gradient-to-br text-3xl ${g.color} ${g.border}`}>{p.icon}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900 dark:text-white">{p.title}</h3>
                    <span className="inline-block h-2.5 w-2.5 rounded-full ring-1 ring-black/10 flex-shrink-0" style={{ backgroundColor: GRADIENT_MAP[p.gradient]?.preview }} title={GRADIENT_MAP[p.gradient]?.label} />
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{p.desc}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button onClick={() => move(p.id, -1)} disabled={i === 0} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition" title="Move up"><ChevronUp className="h-4 w-4" /></button>
                  <button onClick={() => move(p.id, 1)} disabled={i === pillars.length - 1} className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-30 transition" title="Move down"><ChevronDown className="h-4 w-4" /></button>
                  <button onClick={() => openEdit(p)} className="rounded-lg p-1.5 text-gray-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 transition"><Edit2 className="h-4 w-4" /></button>
                  <button onClick={() => del(p.id)} className="rounded-lg p-1.5 text-gray-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500 transition"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            )}
          </div>
        )
      })}

      {editing === 'new' && (
        <div className="rounded-2xl border-2 border-dashed border-[#E8B84B]/50 bg-[#E8B84B]/5 p-6 space-y-4">
          <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
            <Layers className="h-4 w-4 text-[#E8B84B]" /> New Teaching Pillar
          </p>
          <PillarForm draft={draft} onChange={setDraft} />
          <div className="flex gap-2 pt-1">
            <button onClick={save} className="flex items-center gap-1.5 rounded-lg bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
              <Plus className="h-3.5 w-3.5" /> Add Pillar
            </button>
            <button onClick={close} className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700 transition">Cancel</button>
          </div>
        </div>
      )}

      {pillars.length === 0 && editing === null && (
        <button onClick={openNew} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-gray-300 dark:border-gray-600 py-8 text-sm font-medium text-gray-500 hover:border-[#E8B84B] hover:text-[#E8B84B] transition">
          <Plus className="h-4 w-4" /> Add your first teaching pillar
        </button>
      )}
    </div>
  )
}

export function AcademicsManager() {
  const { showToast } = useToast()
  const [tab, setTab]         = useState('grades')
  const [cls, setCls]         = useState(CLASSES_LIST[0])
  const [term, setTerm]       = useState(TERMS[0])
  const [calendar, setCalendar] = useState(CALENDAR.map(c => ({ ...c })))

  const [grades, setGrades] = useState<number[][]>(
    STUDENT_NAMES.map(() => SUBJECTS.map(() => Math.floor(Math.random() * 41 + 55))),
  )

  const [attendance, setAttendance] = useState<number[]>(
    STUDENT_NAMES.map(() => Math.floor(Math.random() * 11 + 50)),
  )

  const TOTAL_DAYS = 60

  const setGrade = (si: number, sj: number, val: number) => {
    setGrades(prev => {
      const copy = prev.map(r => [...r])
      copy[si][sj] = Math.max(0, Math.min(100, val))
      return copy
    })
  }

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academics</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Grade entry, attendance tracking, academic calendar, and teaching pillars</p>
      </div>

      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── GRADES ── */}
      {tab === 'grades' && (
        <div>
          <div className="mb-4 flex flex-wrap gap-3">
            <select className={`${INP} w-auto`} value={cls} onChange={e => setCls(e.target.value)}>
              {CLASSES_LIST.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className={`${INP} w-auto`} value={term} onChange={e => setTerm(e.target.value)}>
              {TERMS.map(t => <option key={t}>{t}</option>)}
            </select>
            <button onClick={() => showToast('Grades saved ✓')} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
              <Save className="h-4 w-4" /> Save Grades
            </button>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Student</th>
                    {SUBJECTS.map(s => <th key={s} className="px-3 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 whitespace-nowrap">{s.slice(0, 4)}</th>)}
                    <th className="px-5 py-3 text-center text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">Avg</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {STUDENT_NAMES.map((name, si) => {
                    const avg = Math.round(grades[si].reduce((a, b) => a + b, 0) / grades[si].length)
                    return (
                      <tr key={si} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-5 py-2.5 font-medium text-gray-900 dark:text-white whitespace-nowrap">{name}</td>
                        {SUBJECTS.map((_, sj) => (
                          <td key={sj} className="px-2 py-2.5 text-center">
                            <input type="number" min={0} max={100}
                              className="w-14 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-1.5 py-1 text-center text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                              value={grades[si][sj]}
                              onChange={e => setGrade(si, sj, +e.target.value)} />
                          </td>
                        ))}
                        <td className="px-5 py-2.5 text-center">
                          <span className={`font-bold ${gradeColor(avg)}`}>{avg} <span className="text-xs">({gradeLabel(avg)})</span></span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── ATTENDANCE ── */}
      {tab === 'attendance' && (
        <div>
          <div className="mb-4 flex gap-3">
            <select className={`${INP} w-auto`} value={cls} onChange={e => setCls(e.target.value)}>
              {CLASSES_LIST.map(c => <option key={c}>{c}</option>)}
            </select>
            <select className={`${INP} w-auto`} value={term} onChange={e => setTerm(e.target.value)}>
              {TERMS.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px] text-sm">
                <thead className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/30">
                  <tr>
                    {['Student', 'Days Present', 'Days Absent', 'Rate', 'Update'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-700/50">
                  {STUDENT_NAMES.map((name, si) => {
                    const rate = Math.round((attendance[si] / TOTAL_DAYS) * 100)
                    return (
                      <tr key={si} className="hover:bg-gray-50 dark:hover:bg-gray-700/30">
                        <td className="px-5 py-3.5 font-medium text-gray-900 dark:text-white">{name}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{attendance[si]}</td>
                        <td className="px-5 py-3.5 text-gray-600 dark:text-gray-300">{TOTAL_DAYS - attendance[si]}</td>
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-24 rounded-full bg-gray-100 dark:bg-gray-700 h-2 overflow-hidden">
                              <div className={`h-full rounded-full ${rate >= 90 ? 'bg-green-500' : rate >= 75 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${rate}%` }} />
                            </div>
                            <span className={`text-xs font-bold ${rate >= 90 ? 'text-green-600 dark:text-green-400' : rate >= 75 ? 'text-yellow-600 dark:text-yellow-500' : 'text-red-600 dark:text-red-400'}`}>{rate}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <input type="number" min={0} max={TOTAL_DAYS}
                            className="w-20 rounded-lg border border-gray-200 dark:border-gray-700 bg-transparent px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-yellow-400/50"
                            value={attendance[si]}
                            onChange={e => setAttendance(prev => { const a = [...prev]; a[si] = Math.max(0, Math.min(TOTAL_DAYS, +e.target.value)); return a })} />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ── CALENDAR ── */}
      {tab === 'calendar' && (
        <div className="space-y-4">
          {calendar.map((c, i) => (
            <div key={c.term} className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-6">
              <h3 className="mb-4 font-semibold text-gray-900 dark:text-white">{c.term}</h3>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className={LABEL}>Opening Date</label>
                  <input type="date" className={INP} value={c.open}
                    onChange={e => setCalendar(prev => { const nc = [...prev]; nc[i] = { ...c, open: e.target.value }; return nc })} />
                </div>
                <div>
                  <label className={LABEL}>Closing Date</label>
                  <input type="date" className={INP} value={c.close}
                    onChange={e => setCalendar(prev => { const nc = [...prev]; nc[i] = { ...c, close: e.target.value }; return nc })} />
                </div>
                <div>
                  <label className={LABEL}>Exam Week(s)</label>
                  <input className={INP} value={c.exams}
                    onChange={e => setCalendar(prev => { const nc = [...prev]; nc[i] = { ...c, exams: e.target.value }; return nc })} />
                </div>
              </div>
            </div>
          ))}
          <button onClick={() => showToast('Academic calendar saved ✓')} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-5 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a]">
            <Save className="h-4 w-4" /> Save Calendar
          </button>
        </div>
      )}

      {/* ── TEACHING PILLARS ── */}
      {tab === 'pillars' && <PillarsTab />}
    </div>
  )
}
