import { useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine,
  LineChart, Line,
} from 'recharts'
import { TrendingUp, TrendingDown, Minus, Award, BookOpen } from 'lucide-react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../../../components/ui/GlassCard'
import { Button } from '../../../components/ui/Button'
import { useStudentGradesHistory } from '../../../hooks/useStudentData'

const GRADE_BADGE: Record<string, string> = {
  A:  'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'B+': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  B:  'bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300',
  'C+': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  C:  'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  D:  'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  E:  'bg-red-200 text-red-800 dark:bg-red-900/40 dark:text-red-300',
}

function MiniBar({ val }: { val: number | null }) {
  if (val === null) return <span className="text-xs text-gray-300 dark:text-gray-600">—</span>
  const pct = Math.round(val)
  const color = pct >= 80 ? 'bg-green-500' : pct >= 65 ? 'bg-blue-500' : pct >= 50 ? 'bg-amber-400' : 'bg-red-400'
  return (
    <div className="flex items-center justify-center gap-1.5">
      <span className="w-6 text-right text-xs font-medium text-gray-700 dark:text-gray-300">{val}</span>
      <div className="h-1.5 w-14 rounded-full bg-gray-100 dark:bg-gray-700">
        <div className={`h-1.5 rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

const TTip = ({ active, payload, label }: any) =>
  active && payload?.length ? (
    <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 shadow-xl px-3 py-2 text-xs">
      <p className="font-bold text-gray-800 dark:text-gray-100 mb-1">{label}</p>
      {payload.map((p: any) => <p key={p.name} style={{ color: p.color }}>{p.name}: {p.value}%</p>)}
    </div>
  ) : null

export function StudentGrades() {
  const { data: history, isLoading } = useStudentGradesHistory()
  const [selYear, setSelYear]   = useState<string | null>(null)
  const [selTerm, setSelTerm]   = useState<string | null>(null)

  if (isLoading) {
    return <div className="mx-auto max-w-7xl px-4 py-8 space-y-4">
      {[1,2,3].map(i => <div key={i} className="h-32 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-800" />)}
    </div>
  }

  const years      = history ?? []
  const activeYear = years.find(y => y.yearId === selYear) ?? years[0]
  const terms      = activeYear?.terms ?? []
  const activeTerm = terms.find(t => t.termId === selTerm) ?? terms.find(t => t.isCurrent) ?? terms[0]
  const grades     = activeTerm?.grades ?? []
  const finished   = grades.filter(g => g.total !== null)
  const avg        = finished.length ? Math.round(finished.reduce((s, g) => s + (g.total ?? 0), 0) / finished.length) : null
  const ongoing    = grades.filter(g => g.total === null).length

  const prevIdx  = terms.findIndex(t => t.termId === activeTerm?.termId) - 1
  const prevAvg  = prevIdx >= 0 ? terms[prevIdx]?.average : null
  const trendDir = avg !== null && prevAvg !== null ? (avg > prevAvg ? 'up' : avg < prevAvg ? 'down' : 'same') : 'same'

  const trendData = years.flatMap(y =>
    y.terms.map(t => ({ label: `T${t.termLabel.match(/\d/)?.[0] ?? '?'} ${y.yearLabel}`, avg: t.average ?? 0 }))
  ).filter(d => d.avg > 0)

  const barData = finished.map(g => ({ subject: (g.subjectName ?? '').split(' ')[0].slice(0, 6), score: g.total ?? 0 }))

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Academic Grades</h1>
          <p className="text-sm text-gray-400 mt-0.5">Full multi-year grade history</p>
        </div>
        <Link to="/dashboard/student/report-card">
          <Button variant="outline" className="gap-1.5 text-sm"><BookOpen className="h-4 w-4" /> Report Card</Button>
        </Link>
      </div>

      {/* Year selector */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {years.map(y => (
          <button key={y.yearId} onClick={() => { setSelYear(y.yearId); setSelTerm(null) }}
            className={`shrink-0 rounded-xl px-4 py-2 text-sm font-semibold transition ${activeYear?.yearId === y.yearId ? 'bg-green-700 text-white shadow' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
            {y.yearLabel}{y.isCurrent ? ' (current)' : ''}
          </button>
        ))}
      </div>

      {/* Term tabs */}
      {terms.length > 0 && (
        <div className="flex gap-2">
          {terms.map(t => (
            <button key={t.termId} onClick={() => setSelTerm(t.termId)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition ${activeTerm?.termId === t.termId ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow' : 'border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800'}`}>
              {t.termLabel}{t.isCurrent ? ' · ongoing' : ''}
            </button>
          ))}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label:'Term Average', value: avg !== null ? `${avg}%` : '—', sub: ongoing > 0 ? `${ongoing} pending` : 'Completed', icon: <Award className="h-5 w-5"/>, c:'text-green-600 dark:text-green-400' },
          { label:'Subjects',     value: String(grades.length), sub:`${finished.length} completed`, icon:<BookOpen className="h-5 w-5"/>, c:'text-blue-600 dark:text-blue-400' },
          { label:'vs Prev Term', value: avg !== null && prevAvg !== null ? `${trendDir==='up'?'+':''}${Math.abs(avg-prevAvg)}%` : '—',
            sub: trendDir==='up'?'Improving':trendDir==='down'?'Below prev':'No change',
            icon: trendDir==='up'?<TrendingUp className="h-5 w-5"/>:trendDir==='down'?<TrendingDown className="h-5 w-5"/>:<Minus className="h-5 w-5"/>,
            c: trendDir==='up'?'text-green-600 dark:text-green-400':trendDir==='down'?'text-red-500':'text-gray-400' },
          { label:'Best Subject', value: finished.length ? (finished.sort((a,b)=>(b.total??0)-(a.total??0))[0]?.subjectName?.split(' ')[0]??'—') : '—',
            sub: finished.length ? `${Math.max(...finished.map(g=>g.total??0))}%` : '', icon:<Award className="h-5 w-5"/>, c:'text-amber-600 dark:text-amber-400' },
        ].map(s => (
          <GlassCard key={s.label} className="p-4">
            <div className={`mb-1 ${s.c}`}>{s.icon}</div>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{s.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
            <p className="text-xs text-gray-400">{s.sub}</p>
          </GlassCard>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard className="p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4">Subject Scores — {activeTerm?.termLabel}</h2>
          {barData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={barData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="subject" tick={{ fontSize: 10 }} />
                <YAxis domain={[0,100]} tick={{ fontSize: 10 }} />
                <Tooltip content={<TTip/>} />
                <ReferenceLine y={50} stroke="rgba(239,68,68,0.3)" strokeDasharray="4 4" />
                <Bar dataKey="score" name="Score" fill="#15803d" radius={[6,6,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="h-56 flex items-center justify-center text-gray-400 text-sm">No completed grades yet</div>}
        </GlassCard>
        <GlassCard className="p-6">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" /> Overall Trend
          </h2>
          {trendData.length > 1 ? (
            <ResponsiveContainer width="100%" height={240}>
              <LineChart data={trendData} margin={{ left:-20, bottom:10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" />
                <XAxis dataKey="label" tick={{ fontSize:9 }} angle={-25} textAnchor="end" height={45} interval={0} />
                <YAxis domain={[50,100]} tick={{ fontSize:10 }} />
                <Tooltip content={<TTip/>} />
                <Line type="monotone" dataKey="avg" name="Avg %" stroke="#15803d" strokeWidth={2.5} dot={{ r:4, fill:'#15803d' }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="h-56 flex items-center justify-center text-gray-400 text-sm">Need 2+ terms for trend</div>}
        </GlassCard>
      </div>

      {/* Table */}
      <GlassCard className="overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <h2 className="font-bold text-gray-900 dark:text-white">
            Subject Breakdown — {activeTerm?.termLabel} {activeYear?.yearLabel}
          </h2>
          {ongoing > 0 && (
            <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full">
              {ongoing} in progress
            </span>
          )}
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                {['Subject','CAT 1 (20%)','CAT 2 (20%)','End Term (60%)','Total','Grade'].map(h => (
                  <th key={h} className={`py-3 px-4 text-xs font-semibold uppercase tracking-wide text-gray-400 ${h==='Subject'?'text-left':'text-center'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {grades.length === 0 ? (
                <tr><td colSpan={6} className="py-10 text-center text-gray-400 text-sm">No grade data for this term</td></tr>
              ) : grades.map((g, i) => (
                <tr key={g.subjectName} className={`border-b border-gray-50 dark:border-gray-800/50 ${i%2===1?'bg-gray-50/50 dark:bg-gray-800/20':''}`}>
                  <td className="px-4 py-3 font-medium text-gray-800 dark:text-gray-200">{g.subjectName}</td>
                  <td className="px-4 py-3"><MiniBar val={g.cat1} /></td>
                  <td className="px-4 py-3"><MiniBar val={g.cat2} /></td>
                  <td className="px-4 py-3">
                    {g.endterm !== null ? <MiniBar val={g.endterm} />
                      : <span className="flex justify-center"><span className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-400 px-2 py-0.5 rounded-full">Pending</span></span>}
                  </td>
                  <td className="px-4 py-3 text-center font-bold text-gray-900 dark:text-white">
                    {g.total !== null ? `${g.total}%` : '—'}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {g.grade
                      ? <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${GRADE_BADGE[g.grade]??'bg-gray-100 text-gray-600'}`}>{g.grade}</span>
                      : <span className="text-xs text-gray-300">—</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {avg !== null && (
          <div className="px-5 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Term Average</span>
            <span className="text-sm font-extrabold text-green-700 dark:text-green-400">{avg}%</span>
          </div>
        )}
      </GlassCard>
    </div>
  )
}
