import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import {
  Users, TrendingUp, TrendingDown, MessageSquare,
  AlertTriangle, Award, Search, ChevronDown, X,
} from 'lucide-react'
import { Link } from 'react-router-dom'

interface StudentRecord {
  id: string
  name: string
  admNo: string
  gender: 'M' | 'F'
  avg: number
  prevAvg: number
  attendance: number
  hwCompletion: number
  status: 'excellent' | 'good' | 'average' | 'at-risk'
  notes: string
}

const CLASS_DATA: Record<string, StudentRecord[]> = {
  'Grade 5 Gold': [
    { id: 'g5g1',  name: 'Kevin Mwangi',     admNo: 'ALB-2020-051', gender: 'M', avg: 34, prevAvg: 38, attendance: 88, hwCompletion: 60, status: 'at-risk',  notes: 'Struggling with fractions. Parents informed on 20 May.' },
    { id: 'g5g2',  name: 'Lillian Weru',      admNo: 'ALB-2020-052', gender: 'F', avg: 91, prevAvg: 87, attendance: 98, hwCompletion: 100, status: 'excellent', notes: '' },
    { id: 'g5g3',  name: 'Martin Ngugi',      admNo: 'ALB-2020-053', gender: 'M', avg: 62, prevAvg: 59, attendance: 92, hwCompletion: 85, status: 'good',      notes: '' },
    { id: 'g5g4',  name: 'Nancy Wanjiku',     admNo: 'ALB-2020-054', gender: 'F', avg: 94, prevAvg: 91, attendance: 99, hwCompletion: 100, status: 'excellent', notes: 'Class top student. Nominated for maths Olympiad.' },
    { id: 'g5g5',  name: 'Oscar Mungai',      admNo: 'ALB-2020-055', gender: 'M', avg: 68, prevAvg: 70, attendance: 90, hwCompletion: 80, status: 'good',      notes: '' },
    { id: 'g5g6',  name: 'Priscilla Njeri',   admNo: 'ALB-2020-056', gender: 'F', avg: 55, prevAvg: 52, attendance: 88, hwCompletion: 75, status: 'average',   notes: '' },
    { id: 'g5g7',  name: 'Quentin Odhiambo',  admNo: 'ALB-2020-057', gender: 'M', avg: 72, prevAvg: 68, attendance: 95, hwCompletion: 90, status: 'good',      notes: '' },
    { id: 'g5g8',  name: 'Rose Wathoni',      admNo: 'ALB-2020-058', gender: 'F', avg: 88, prevAvg: 82, attendance: 97, hwCompletion: 95, status: 'excellent', notes: '' },
    { id: 'g5g9',  name: 'Samuel Kuria',      admNo: 'ALB-2020-059', gender: 'M', avg: 48, prevAvg: 51, attendance: 85, hwCompletion: 65, status: 'average',   notes: 'Missing 2 assignments.' },
    { id: 'g5g10', name: 'Tabitha Njagi',     admNo: 'ALB-2020-060', gender: 'F', avg: 79, prevAvg: 75, attendance: 93, hwCompletion: 88, status: 'good',      notes: '' },
  ],
  'Grade 6 Silver': [
    { id: 'g6s1', name: 'Amina Said',      admNo: 'ALB-2019-071', gender: 'F', avg: 49, prevAvg: 53, attendance: 61, hwCompletion: 70, status: 'at-risk',  notes: 'Attendance concern — 5 unexplained absences.' },
    { id: 'g6s2', name: 'Bernard Kamau',   admNo: 'ALB-2019-072', gender: 'M', avg: 66, prevAvg: 62, attendance: 92, hwCompletion: 85, status: 'good',      notes: '' },
    { id: 'g6s3', name: 'Clara Muthoni',   admNo: 'ALB-2019-073', gender: 'F', avg: 85, prevAvg: 80, attendance: 96, hwCompletion: 98, status: 'excellent', notes: '' },
    { id: 'g6s4', name: "Daniel Ndung'u",  admNo: 'ALB-2019-074', gender: 'M', avg: 58, prevAvg: 55, attendance: 89, hwCompletion: 78, status: 'average',   notes: '' },
    { id: 'g6s5', name: 'Emily Wairimu',   admNo: 'ALB-2019-075', gender: 'F', avg: 88, prevAvg: 84, attendance: 98, hwCompletion: 100, status: 'excellent', notes: '' },
    { id: 'g6s6', name: 'Francis Gitau',   admNo: 'ALB-2019-076', gender: 'M', avg: 71, prevAvg: 69, attendance: 94, hwCompletion: 88, status: 'good',      notes: '' },
    { id: 'g6s7', name: 'Gladys Nyambura', admNo: 'ALB-2019-077', gender: 'F', avg: 63, prevAvg: 60, attendance: 90, hwCompletion: 82, status: 'good',      notes: '' },
    { id: 'g6s8', name: 'Hassan Mwangi',   admNo: 'ALB-2019-078', gender: 'M', avg: 77, prevAvg: 73, attendance: 93, hwCompletion: 91, status: 'good',      notes: '' },
  ],
  'Grade 5 Blue': [
    { id: 'g5b1', name: 'Brian Otieno',     admNo: 'ALB-2020-061', gender: 'M', avg: 38, prevAvg: 42, attendance: 79, hwCompletion: 55, status: 'at-risk',  notes: 'Missing 3 assignments. At risk — counsellor referred.' },
    { id: 'g5b2', name: 'Carol Wambui',     admNo: 'ALB-2020-062', gender: 'F', avg: 74, prevAvg: 70, attendance: 93, hwCompletion: 90, status: 'good',      notes: '' },
    { id: 'g5b3', name: 'Dennis Kariuki',   admNo: 'ALB-2020-063', gender: 'M', avg: 60, prevAvg: 58, attendance: 88, hwCompletion: 78, status: 'average',   notes: '' },
    { id: 'g5b4', name: 'Elizabeth Ndiiri', admNo: 'ALB-2020-064', gender: 'F', avg: 82, prevAvg: 79, attendance: 96, hwCompletion: 95, status: 'excellent', notes: '' },
    { id: 'g5b5', name: 'Felix Muriithi',   admNo: 'ALB-2020-065', gender: 'M', avg: 55, prevAvg: 53, attendance: 85, hwCompletion: 72, status: 'average',   notes: '' },
    { id: 'g5b6', name: 'Grace Nyawira',    admNo: 'ALB-2020-066', gender: 'F', avg: 69, prevAvg: 65, attendance: 91, hwCompletion: 84, status: 'good',      notes: '' },
  ],
  'Grade 4 Red': [
    { id: 'g4r1', name: 'Aisha Kamau',     admNo: 'ALB-2021-041', gender: 'F', avg: 87, prevAvg: 83, attendance: 97, hwCompletion: 100, status: 'excellent', notes: '' },
    { id: 'g4r2', name: 'Boniface Njoro',  admNo: 'ALB-2021-042', gender: 'M', avg: 72, prevAvg: 70, attendance: 91, hwCompletion: 88, status: 'good',      notes: '' },
    { id: 'g4r3', name: 'Cynthia Muriuki', admNo: 'ALB-2021-043', gender: 'F', avg: 65, prevAvg: 63, attendance: 89, hwCompletion: 82, status: 'good',      notes: '' },
    { id: 'g4r4', name: 'David Karuri',    admNo: 'ALB-2021-044', gender: 'M', avg: 78, prevAvg: 75, attendance: 94, hwCompletion: 90, status: 'good',      notes: '' },
    { id: 'g4r5', name: 'Esther Wambua',   admNo: 'ALB-2021-045', gender: 'F', avg: 56, prevAvg: 54, attendance: 86, hwCompletion: 75, status: 'average',   notes: '' },
    { id: 'g4r6', name: 'Fatuma Hassan',   admNo: 'ALB-2021-046', gender: 'F', avg: 44, prevAvg: 48, attendance: 52, hwCompletion: 65, status: 'at-risk',  notes: 'Absent 5 consecutive days. Parent contacted.' },
    { id: 'g4r7', name: 'George Kimani',   admNo: 'ALB-2021-047', gender: 'M', avg: 83, prevAvg: 79, attendance: 95, hwCompletion: 93, status: 'excellent', notes: '' },
    { id: 'g4r8', name: 'Hannah Nyambura', admNo: 'ALB-2021-048', gender: 'F', avg: 71, prevAvg: 68, attendance: 92, hwCompletion: 87, status: 'good',      notes: '' },
  ],
  'Grade 7 Green': [
    { id: 'g7n1', name: 'Ivy Wanjiku',    admNo: 'ALB-2018-081', gender: 'F', avg: 76, prevAvg: 72, attendance: 93, hwCompletion: 90, status: 'good',      notes: '' },
    { id: 'g7n2', name: 'James Kariuki',  admNo: 'ALB-2018-082', gender: 'M', avg: 62, prevAvg: 60, attendance: 88, hwCompletion: 80, status: 'good',      notes: '' },
    { id: 'g7n3', name: 'Khadija Omar',   admNo: 'ALB-2018-083', gender: 'F', avg: 81, prevAvg: 78, attendance: 95, hwCompletion: 95, status: 'excellent', notes: '' },
    { id: 'g7n4', name: 'Levi Mutua',     admNo: 'ALB-2018-084', gender: 'M', avg: 53, prevAvg: 57, attendance: 83, hwCompletion: 70, status: 'average',   notes: '' },
    { id: 'g7n5', name: 'Miriam Njeri',   admNo: 'ALB-2018-085', gender: 'F', avg: 69, prevAvg: 66, attendance: 90, hwCompletion: 85, status: 'good',      notes: '' },
  ],
}

const CLASSES = Object.keys(CLASS_DATA)

const STATUS_CFG = {
  excellent: { label: 'Excellent', color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300' },
  good:      { label: 'Good',      color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300'             },
  average:   { label: 'Average',   color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300'         },
  'at-risk': { label: 'At Risk',   color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300'                 },
}

export function TeacherClass() {
  const [selectedClass, setSelectedClass] = useState('Grade 5 Gold')
  const [search, setSearch]               = useState('')
  const [profileId, setProfileId]         = useState<string | null>(null)
  const [noteId, setNoteId]               = useState<string | null>(null)
  const [noteText, setNoteText]           = useState('')

  const students = CLASS_DATA[selectedClass] ?? []
  const filtered = students.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.admNo.includes(search)
  )

  const profile = students.find(s => s.id === profileId)

  const classAvg = students.length ? Math.round(students.reduce((a, s) => a + s.avg, 0) / students.length) : 0
  const atRisk   = students.filter(s => s.status === 'at-risk').length
  const top      = students.reduce((best, s) => s.avg > (best?.avg ?? 0) ? s : best, students[0])

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Classes</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Mathematics · Term 2, 2025</p>
        </div>
        <div className="relative">
          <select className="field pr-8 appearance-none" value={selectedClass} onChange={e => { setSelectedClass(e.target.value); setProfileId(null) }}>
            {CLASSES.map(c => <option key={c}>{c}</option>)}
          </select>
          <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Class Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <GlassCard className="p-4 text-center">
          <Users className="w-5 h-5 text-emerald-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{students.length}</p>
          <p className="text-xs text-gray-500">Students</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <TrendingUp className="w-5 h-5 text-blue-600 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{classAvg}%</p>
          <p className="text-xs text-gray-500">Class Average</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <Award className="w-5 h-5 text-amber-500 mx-auto mb-1" />
          <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{top?.name.split(' ')[0] ?? '—'}</p>
          <p className="text-xs text-gray-500">Top Student ({top?.avg ?? 0}%)</p>
        </GlassCard>
        <GlassCard className="p-4 text-center">
          <AlertTriangle className="w-5 h-5 text-red-500 mx-auto mb-1" />
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{atRisk}</p>
          <p className="text-xs text-gray-500">At-Risk Students</p>
        </GlassCard>
      </div>

      {/* Student Profile Side Panel */}
      {profile && (
        <GlassCard className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-lg font-bold text-emerald-700 dark:text-emerald-300">
                {profile.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{profile.name}</h3>
                <p className="text-xs text-gray-500">{profile.admNo} · {profile.gender === 'M' ? 'Male' : 'Female'} · {selectedClass}</p>
              </div>
            </div>
            <button onClick={() => setProfileId(null)} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700">
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
            {[
              { label: 'Term Avg', value: `${profile.avg}%`, trend: profile.avg >= profile.prevAvg },
              { label: 'Attendance', value: `${profile.attendance}%`, trend: profile.attendance >= 80 },
              { label: 'HW Completion', value: `${profile.hwCompletion}%`, trend: profile.hwCompletion >= 70 },
              { label: 'vs Last Term', value: `${profile.avg >= profile.prevAvg ? '+' : ''}${profile.avg - profile.prevAvg}%`, trend: profile.avg >= profile.prevAvg },
            ].map(stat => (
              <div key={stat.label} className="text-center p-3 bg-gray-50 dark:bg-gray-800/60 rounded-xl">
                <p className="text-xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                <p className="text-xs text-gray-500 mt-0.5 flex items-center justify-center gap-1">
                  {stat.trend ? <TrendingUp className="w-3 h-3 text-emerald-500" /> : <TrendingDown className="w-3 h-3 text-red-500" />}
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
          {profile.notes && (
            <div className="mb-4 p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-700 rounded-lg">
              <p className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-1">Teacher Notes</p>
              <p className="text-sm text-amber-800 dark:text-amber-200">{profile.notes}</p>
            </div>
          )}
          <div className="flex flex-wrap gap-2">
            <Link to="/dashboard/teacher/messages" className="flex items-center gap-1 text-xs text-violet-600 dark:text-violet-400 border border-violet-200 dark:border-violet-700 px-3 py-1.5 rounded-lg hover:bg-violet-50 dark:hover:bg-violet-900/20 transition-colors">
              <MessageSquare className="w-3.5 h-3.5" /> Message Parent
            </Link>
            <button
              onClick={() => { setNoteId(profile.id); setNoteText(profile.notes) }}
              className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-3 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              Add / Edit Note
            </button>
          </div>
          {noteId === profile.id && (
            <div className="mt-4">
              <textarea rows={2} className="field resize-none text-sm w-full" value={noteText} onChange={e => setNoteText(e.target.value)} placeholder="Add a pastoral note about this student…" />
              <div className="flex gap-2 mt-2">
                <button
                  className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors"
                  onClick={() => { setNoteId(null); }}
                >
                  Save Note
                </button>
                <button className="text-xs text-gray-500 px-3 py-1.5 hover:underline" onClick={() => setNoteId(null)}>Cancel</button>
              </div>
            </div>
          )}
        </GlassCard>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input type="text" placeholder="Search by name or admission number…" className="field pl-9" value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Student Table */}
      <GlassCard className="p-0 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 dark:bg-gray-800/60">
              <tr>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">#</th>
                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Student</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Avg</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Attendance</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">HW</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Trend</th>
                <th className="text-center px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="px-4 py-3 w-10" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {filtered.map((s, i) => {
                const delta = s.avg - s.prevAvg
                const st = STATUS_CFG[s.status]
                return (
                  <tr key={s.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors cursor-pointer" onClick={() => setProfileId(s.id === profileId ? null : s.id)}>
                    <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center text-xs font-bold text-emerald-700 dark:text-emerald-300 shrink-0">
                          {s.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">{s.name}</p>
                          <p className="text-xs text-gray-400 font-mono hidden sm:block">{s.admNo}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`font-bold ${s.avg >= 70 ? 'text-emerald-600' : s.avg >= 40 ? 'text-amber-600' : 'text-red-600'}`}>{s.avg}%</span>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={s.attendance >= 80 ? 'text-emerald-600' : 'text-red-600'}>{s.attendance}%</span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-400 hidden sm:table-cell">{s.hwCompletion}%</td>
                    <td className="px-4 py-3 text-center">
                      {delta >= 0
                        ? <span className="flex items-center justify-center gap-0.5 text-emerald-600 text-xs"><TrendingUp className="w-3.5 h-3.5" />+{delta}%</span>
                        : <span className="flex items-center justify-center gap-0.5 text-red-500 text-xs"><TrendingDown className="w-3.5 h-3.5" />{delta}%</span>
                      }
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${st.color}`}>{st.label}</span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline whitespace-nowrap">View</button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  )
}
