import { useState } from 'react'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Users, Search, Phone, Mail, AlertCircle } from 'lucide-react'
import { useTeacherProfile, useTeacherClasses, useClassStudents, useClassAttendance } from '../../../hooks/useTeacherData'

export function TeacherClass() {
  const { data: staff }   = useTeacherProfile()
  const { data: classes } = useTeacherClasses(staff?.id)
  const [classId, setClassId] = useState<string | null>(null)
  const [search, setSearch]   = useState('')

  const activeClassId     = classId ?? classes?.[0]?.id
  const { data: students } = useClassStudents(activeClassId)
  const { data: attData }  = useClassAttendance(activeClassId)

  const selectedCls = (classes ?? []).find(c => c.id === activeClassId)

  const filtered = (students ?? []).filter(s =>
    s.fullName.toLowerCase().includes(search.toLowerCase()) ||
    s.admNo.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Class</h1>
          <p className="text-sm text-gray-400 mt-0.5">Student roster and profiles</p>
        </div>
      </div>

      {/* Class selector */}
      <div className="flex gap-2 flex-wrap">
        {(classes ?? []).map(c => (
          <button key={c.id} onClick={() => setClassId(c.id)}
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition ${activeClassId === c.id ? 'bg-blue-700 text-white' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {c.grade} {c.stream} · {c.studentCount} students
          </button>
        ))}
      </div>

      {/* Stats */}
      {selectedCls && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label:'Enrolled',    value: selectedCls.studentCount },
            { label:'Present Today', value: (attData ?? []).filter(s => s.todayStatus === 'present').length },
            { label:'Absent Today',  value: (attData ?? []).filter(s => s.todayStatus === 'absent').length },
            { label:'Not Marked',    value: (attData ?? []).filter(s => !s.todayStatus).length },
          ].map(s => (
            <GlassCard key={s.label} className="p-4 text-center">
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            </GlassCard>
          ))}
        </div>
      )}

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by name or admission number…"
          className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      {/* Student cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <Users className="mx-auto h-12 w-12 text-gray-200 dark:text-gray-700 mb-3" />
            <p className="text-gray-400">{search ? 'No students match your search' : 'No students in this class'}</p>
          </div>
        ) : filtered.map(s => {
          const att   = attData?.find(a => a.studentId === s.id)
          const pct   = att?.totalDays ? Math.round((att.totalPresent / att.totalDays) * 100) : null
          const today = att?.todayStatus
          return (
            <GlassCard key={s.id} className="p-5">
              <div className="flex items-start gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-base">
                  {s.fullName.split(' ').map((n: string) => n[0]).slice(0,2).join('')}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white truncate">{s.fullName}</p>
                  <p className="text-xs text-gray-400">{s.admNo} · {s.gender}</p>
                  <div className="mt-2 flex items-center gap-2 flex-wrap">
                    {today && (
                      <span className={`text-xs rounded-full px-2 py-0.5 font-semibold
                        ${today === 'present' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                          : today === 'absent' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                          : today === 'late' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                          : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'}`}>
                        Today: {today}
                      </span>
                    )}
                    {pct !== null && (
                      <span className={`text-xs rounded-full px-2 py-0.5 font-semibold
                        ${pct >= 90 ? 'bg-green-50 text-green-600 dark:text-green-400' : pct >= 75 ? 'bg-amber-50 text-amber-600' : 'bg-red-50 text-red-500'}`}>
                        {pct}% attendance
                      </span>
                    )}
                  </div>
                </div>
              </div>
              {s.medicalNotes && (
                <div className="mt-3 flex items-start gap-1.5 rounded-lg bg-amber-50 dark:bg-amber-900/20 p-2">
                  <AlertCircle className="h-3.5 w-3.5 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 dark:text-amber-300">{s.medicalNotes}</p>
                </div>
              )}
              <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 flex gap-3 text-xs text-gray-400">
                <span>DOB: {new Date(s.dob).toLocaleDateString('en-KE', { day:'numeric', month:'short', year:'numeric' })}</span>
                {s.emergencyContact?.phone && (
                  <span className="flex items-center gap-1">
                    <Phone className="h-3 w-3" />{s.emergencyContact.phone}
                  </span>
                )}
              </div>
            </GlassCard>
          )
        })}
      </div>
    </div>
  )
}
