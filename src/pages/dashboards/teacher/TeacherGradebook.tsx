import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useToast } from '../../../contexts/ToastContext'
import { Save, Download, Lock, Unlock, ChevronDown, CheckCircle2 } from 'lucide-react'

type Term = 'Term 1' | 'Term 2' | 'Term 3'

interface Student {
  id: string
  name: string
  admNo: string
}

interface Scores {
  cat1: string
  cat2: string
  midterm: string
  endterm: string
  practical: string
}

const CLASSES = ['Grade 4 Red', 'Grade 5 Gold', 'Grade 5 Blue', 'Grade 6 Silver', 'Grade 7 Green']

const STUDENTS: Record<string, Student[]> = {
  'Grade 4 Red':    [
    { id: 'g4r1', name: 'Aisha Kamau',      admNo: 'ALB-2021-041' },
    { id: 'g4r2', name: 'Boniface Njoro',   admNo: 'ALB-2021-042' },
    { id: 'g4r3', name: 'Cynthia Muriuki',  admNo: 'ALB-2021-043' },
    { id: 'g4r4', name: 'David Karuri',     admNo: 'ALB-2021-044' },
    { id: 'g4r5', name: 'Esther Wambua',    admNo: 'ALB-2021-045' },
    { id: 'g4r6', name: 'Fatuma Hassan',    admNo: 'ALB-2021-046' },
    { id: 'g4r7', name: 'George Kimani',    admNo: 'ALB-2021-047' },
    { id: 'g4r8', name: 'Hannah Nyambura',  admNo: 'ALB-2021-048' },
  ],
  'Grade 5 Gold':   [
    { id: 'g5g1', name: 'Kevin Mwangi',     admNo: 'ALB-2020-051' },
    { id: 'g5g2', name: 'Lillian Weru',     admNo: 'ALB-2020-052' },
    { id: 'g5g3', name: 'Martin Ngugi',     admNo: 'ALB-2020-053' },
    { id: 'g5g4', name: 'Nancy Wanjiku',    admNo: 'ALB-2020-054' },
    { id: 'g5g5', name: 'Oscar Mungai',     admNo: 'ALB-2020-055' },
    { id: 'g5g6', name: 'Priscilla Njeri',  admNo: 'ALB-2020-056' },
    { id: 'g5g7', name: 'Quentin Odhiambo', admNo: 'ALB-2020-057' },
    { id: 'g5g8', name: 'Rose Wathoni',     admNo: 'ALB-2020-058' },
    { id: 'g5g9', name: 'Samuel Kuria',     admNo: 'ALB-2020-059' },
    { id: 'g5g10', name: 'Tabitha Njagi',   admNo: 'ALB-2020-060' },
  ],
  'Grade 5 Blue':  [
    { id: 'g5b1', name: 'Brian Otieno',     admNo: 'ALB-2020-061' },
    { id: 'g5b2', name: 'Carol Wambui',     admNo: 'ALB-2020-062' },
    { id: 'g5b3', name: 'Dennis Kariuki',   admNo: 'ALB-2020-063' },
    { id: 'g5b4', name: 'Elizabeth Ndiiri', admNo: 'ALB-2020-064' },
    { id: 'g5b5', name: 'Felix Muriithi',   admNo: 'ALB-2020-065' },
    { id: 'g5b6', name: 'Grace Nyawira',    admNo: 'ALB-2020-066' },
  ],
  'Grade 6 Silver': [
    { id: 'g6s1', name: 'Amina Said',       admNo: 'ALB-2019-071' },
    { id: 'g6s2', name: 'Bernard Kamau',    admNo: 'ALB-2019-072' },
    { id: 'g6s3', name: 'Clara Muthoni',    admNo: 'ALB-2019-073' },
    { id: 'g6s4', name: 'Daniel Ndung\'u',  admNo: 'ALB-2019-074' },
    { id: 'g6s5', name: 'Emily Wairimu',    admNo: 'ALB-2019-075' },
    { id: 'g6s6', name: 'Francis Gitau',    admNo: 'ALB-2019-076' },
    { id: 'g6s7', name: 'Gladys Nyambura',  admNo: 'ALB-2019-077' },
    { id: 'g6s8', name: 'Hassan Mwangi',    admNo: 'ALB-2019-078' },
  ],
  'Grade 7 Green': [
    { id: 'g7n1', name: 'Ivy Wanjiku',      admNo: 'ALB-2018-081' },
    { id: 'g7n2', name: 'James Kariuki',    admNo: 'ALB-2018-082' },
    { id: 'g7n3', name: 'Khadija Omar',     admNo: 'ALB-2018-083' },
    { id: 'g7n4', name: 'Levi Mutua',       admNo: 'ALB-2018-084' },
    { id: 'g7n5', name: 'Miriam Njeri',     admNo: 'ALB-2018-085' },
  ],
}

const SEED: Record<string, Scores> = {
  'g5g1': { cat1: '28', cat2: '24', midterm: '31', endterm: '', practical: '' },
  'g5g2': { cat1: '35', cat2: '37', midterm: '40', endterm: '', practical: '' },
  'g5g3': { cat1: '22', cat2: '25', midterm: '29', endterm: '', practical: '' },
  'g5g4': { cat1: '38', cat2: '40', midterm: '39', endterm: '', practical: '' },
  'g5g5': { cat1: '30', cat2: '28', midterm: '33', endterm: '', practical: '' },
}

const MAX = { cat1: 40, cat2: 40, midterm: 60, endterm: 100, practical: 20 }
const WEIGHTS = { cat1: 10, cat2: 10, midterm: 30, endterm: 40, practical: 10 }

function letterGrade(pct: number) {
  if (pct >= 80) return { letter: 'A',  color: 'text-emerald-600 dark:text-emerald-400' }
  if (pct >= 70) return { letter: 'B+', color: 'text-blue-600 dark:text-blue-400'     }
  if (pct >= 60) return { letter: 'B',  color: 'text-blue-500 dark:text-blue-300'     }
  if (pct >= 50) return { letter: 'C+', color: 'text-amber-600 dark:text-amber-400'   }
  if (pct >= 40) return { letter: 'C',  color: 'text-amber-500 dark:text-amber-300'   }
  if (pct >= 30) return { letter: 'D',  color: 'text-orange-600 dark:text-orange-400' }
  return                { letter: 'E',  color: 'text-red-600 dark:text-red-400'       }
}

function calcTotal(s: Scores): number | null {
  const vals = [
    s.cat1    ? (parseFloat(s.cat1)    / MAX.cat1)    * WEIGHTS.cat1    : null,
    s.cat2    ? (parseFloat(s.cat2)    / MAX.cat2)    * WEIGHTS.cat2    : null,
    s.midterm ? (parseFloat(s.midterm) / MAX.midterm) * WEIGHTS.midterm : null,
    s.endterm ? (parseFloat(s.endterm) / MAX.endterm) * WEIGHTS.endterm : null,
    s.practical && MAX.practical ? (parseFloat(s.practical) / MAX.practical) * WEIGHTS.practical : null,
  ]
  if (vals.every(v => v === null)) return null
  return vals.reduce<number>((acc, v) => acc + (v ?? 0), 0)
}

export function TeacherGradebook() {
  const { showToast } = useToast()
  const [selectedClass, setSelectedClass] = useState('Grade 5 Gold')
  const [term, setTerm] = useState<Term>('Term 2')
  const [locked, setLocked] = useState(false)
  const [saved, setSaved] = useState(false)
  const [scores, setScores] = useState<Record<string, Scores>>(() => {
    const init: Record<string, Scores> = {}
    CLASSES.forEach(c => STUDENTS[c].forEach(s => {
      init[s.id] = SEED[s.id] ?? { cat1: '', cat2: '', midterm: '', endterm: '', practical: '' }
    }))
    return init
  })

  const students = STUDENTS[selectedClass] ?? []
  const entered = students.filter(s => {
    const sc = scores[s.id]
    return sc && Object.values(sc).some(v => v !== '')
  }).length

  function setScore(sid: string, col: keyof Scores, val: string) {
    if (locked) return
    const max = MAX[col]
    const n = parseFloat(val)
    if (val !== '' && (isNaN(n) || n < 0 || n > max)) return
    setScores(prev => ({ ...prev, [sid]: { ...prev[sid], [col]: val } }))
    setSaved(false)
  }

  function handleSave() {
    setSaved(true)
    showToast('Grades saved successfully', 'success')
  }

  function handlePublish() {
    setLocked(true)
    showToast('Grades published — parents and students can now view results', 'success')
  }

  const totals = students.map(s => calcTotal(scores[s.id])).filter(t => t !== null) as number[]
  const classAvg = totals.length ? (totals.reduce((a, b) => a + b, 0) / totals.length).toFixed(1) : '—'

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gradebook</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Subject: Mathematics · {selectedClass} · {term}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {locked
            ? <Button variant="outline" size="sm" onClick={() => setLocked(false)} className="flex items-center gap-2 text-amber-600 border-amber-300"><Unlock className="w-4 h-4" /> Unlock for Editing</Button>
            : <Button variant="outline" size="sm" onClick={handlePublish} className="flex items-center gap-2"><Lock className="w-4 h-4" /> Publish Grades</Button>
          }
          <Button size="sm" onClick={handleSave} className="flex items-center gap-2">
            {saved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saved ? 'Saved' : 'Save'}
          </Button>
          <Button variant="outline" size="sm" className="flex items-center gap-2"><Download className="w-4 h-4" /> Export</Button>
        </div>
      </div>

      {/* Filters */}
      <GlassCard className="p-4">
        <div className="flex flex-wrap gap-4">
          <div>
            <label className="label">Class</label>
            <div className="relative">
              <select className="field pr-8 appearance-none" value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                {CLASSES.map(c => <option key={c}>{c}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div>
            <label className="label">Term</label>
            <div className="relative">
              <select className="field pr-8 appearance-none" value={term} onChange={e => setTerm(e.target.value as Term)}>
                <option>Term 1</option><option>Term 2</option><option>Term 3</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
          </div>
          <div className="flex items-end gap-4 ml-auto">
            <div className="text-center">
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{classAvg}%</p>
              <p className="text-xs text-gray-500">Class Average</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700 dark:text-gray-300">{entered}/{students.length}</p>
              <p className="text-xs text-gray-500">Scores Entered</p>
            </div>
          </div>
        </div>
      </GlassCard>

      {locked && (
        <div className="flex items-center gap-2 px-4 py-2.5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-xl text-sm text-amber-700 dark:text-amber-300">
          <Lock className="w-4 h-4" /> Grades are published and locked. Click "Unlock for Editing" to make changes.
        </div>
      )}

      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-8">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide min-w-[160px]">Student</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Adm No.</th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">CAT 1 <span className="text-gray-400 normal-case font-normal">/{MAX.cat1}</span></th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">CAT 2 <span className="text-gray-400 normal-case font-normal">/{MAX.cat2}</span></th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">Mid-Term <span className="text-gray-400 normal-case font-normal">/{MAX.midterm}</span></th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-28">End-Term <span className="text-gray-400 normal-case font-normal">/{MAX.endterm}</span></th>
                <th className="text-center px-2 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-24">Practical <span className="text-gray-400 normal-case font-normal">/{MAX.practical}</span></th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-20">Total%</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide w-16">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {students.map((s, i) => {
                const sc = scores[s.id]
                const total = calcTotal(sc)
                const grade = total !== null ? letterGrade(total) : null
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">
                    <td className="px-4 py-2 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-2 font-medium text-gray-800 dark:text-white whitespace-nowrap">{s.name}</td>
                    <td className="px-4 py-2 text-xs text-gray-400 font-mono">{s.admNo}</td>
                    {(['cat1','cat2','midterm','endterm','practical'] as (keyof Scores)[]).map(col => (
                      <td key={col} className="px-2 py-1.5 text-center">
                        <input
                          type="number"
                          min={0}
                          max={MAX[col]}
                          disabled={locked}
                          value={sc?.[col] ?? ''}
                          onChange={e => setScore(s.id, col, e.target.value)}
                          className="w-full text-center text-sm border border-gray-200 dark:border-gray-700 rounded-md px-1 py-1 bg-white dark:bg-gray-900 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-400 disabled:bg-gray-50 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                          placeholder="—"
                        />
                      </td>
                    ))}
                    <td className="px-4 py-2 text-center font-bold text-gray-800 dark:text-white">
                      {total !== null ? `${total.toFixed(1)}%` : '—'}
                    </td>
                    <td className={`px-4 py-2 text-center font-bold ${grade?.color ?? 'text-gray-400'}`}>
                      {grade?.letter ?? '—'}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>

      <div className="text-xs text-gray-400 dark:text-gray-500 px-1">
        Weights: CAT 1 = {WEIGHTS.cat1}% · CAT 2 = {WEIGHTS.cat2}% · Mid-Term = {WEIGHTS.midterm}% · End-Term = {WEIGHTS.endterm}% · Practical = {WEIGHTS.practical}%
      </div>
    </div>
  )
}
