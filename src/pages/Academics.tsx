import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { cn } from '../lib/utils'

const CURRICULA = [
  {
    id: 'cbc',
    name: 'CBC',
    fullName: 'Competency-Based Curriculum',
    desc: "Kenya's national curriculum framework — learner-centred, project-based, and career-oriented from Grade 1 to Grade 9.",
    levels: ['PP1 – PP2 (Early Years)', 'Grade 1 – Grade 6 (Primary)', 'Grade 7 – Grade 9 (Junior Secondary)'],
    features: [
      'Continuous Assessment Tests (CATs) each term',
      'Kenya National Examinations Council (KNEC) aligned',
      'Portfolio-based learning evidence',
      'Integrated career pathways from Grade 7',
      'National values and citizenship integrated',
      'Project-based interdisciplinary units',
    ],
  },
  {
    id: 'igcse',
    name: 'IGCSE',
    fullName: 'Cambridge International General Certificate',
    desc: 'Internationally recognised Cambridge qualification — rigorous external assessment preparing students for global university entry.',
    levels: ['Grade 10 – Grade 11 (IGCSE)', 'Grade 12 (A-Level / Pre-University)'],
    features: [
      'Cambridge Assessment International Education (CAIE)',
      'Globally recognised by 10,000+ universities',
      'Rigorous external examinations twice yearly',
      'Broad subject range across five curriculum areas',
      'University counselling and UCAS guidance',
      'Extended Project Qualification (EPQ) option',
    ],
  },
]

const GRADING = [
  { grade: 'A+', range: '90–100%', desc: 'Exceptional — exceeds all expectations' },
  { grade: 'A', range: '80–89%', desc: 'Excellent — meets all learning outcomes' },
  { grade: 'B+', range: '70–79%', desc: 'Very Good — exceeds most expectations' },
  { grade: 'B', range: '60–69%', desc: 'Good — meets most learning outcomes' },
  { grade: 'C+', range: '50–59%', desc: 'Above Average — meets core outcomes' },
  { grade: 'C', range: '40–49%', desc: 'Average — meets minimum outcomes' },
  { grade: 'D', range: '30–39%', desc: 'Below Average — needs improvement' },
  { grade: 'E', range: '0–29%', desc: 'Fail — does not meet outcomes' },
]

const CALENDAR = [
  { term: 'Term 1', start: '8 January 2026', end: '28 March 2026', exams: '16–27 March 2026', holiday: '28 March – 26 April 2026' },
  { term: 'Term 2', start: '27 April 2026', end: '3 July 2026', exams: '22 June – 3 July 2026', holiday: '4 July – 2 August 2026' },
  { term: 'Term 3', start: '3 August 2026', end: '6 November 2026', exams: '19 Oct – 6 November 2026', holiday: 'December – January' },
]

const SUBJECTS_BY_LEVEL: Record<string, string[]> = {
  'PP1 – PP2': ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor & Creative Arts', 'Religious Education', 'Music'],
  'Grade 1–6': ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Religious Education', 'Creative Arts', 'Physical Education'],
  'Grade 7–9': ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Business Studies', 'Agriculture', 'Creative Arts', 'Physical Education', 'Life Skills'],
  'Grade 10–12 (IGCSE)': ['English Language', 'Mathematics', 'Additional Mathematics', 'Sciences (Biology/Chemistry/Physics)', 'Business Studies', 'Geography', 'History', 'Computer Science', 'Art & Design', 'French'],
}

export function Academics() {
  const [curriculum, setCurriculum] = useState<'cbc' | 'igcse'>('cbc')
  const [level, setLevel] = useState(Object.keys(SUBJECTS_BY_LEVEL)[0])

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal>
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">Academics</h1>
        <p className="mb-16 max-w-2xl text-muted">Dual curriculum excellence — CBC and Cambridge IGCSE — designed to open every door.</p>
      </ScrollReveal>

      <ScrollReveal>
        <h2 className="mb-6 text-3xl font-bold">Curriculum Pathways</h2>
        <div className="mb-4 flex gap-3">
          {(['cbc', 'igcse'] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCurriculum(c)}
              className={cn(
                'rounded-2xl px-6 py-3 font-semibold transition-all hover:scale-105',
                curriculum === c ? 'bg-primary text-white dark:bg-gold dark:text-dark' : 'glass glass-border',
              )}
            >
              {c.toUpperCase()}
            </button>
          ))}
        </div>
      </ScrollReveal>

      {CURRICULA.filter((c) => c.id === curriculum).map((cur) => (
        <ScrollReveal key={cur.id} delay={0.05}>
          <GlassCard className="mb-16 p-8">
            <h3 className="mb-1 text-2xl font-bold text-primary dark:text-gold">{cur.fullName}</h3>
            <p className="mb-6 text-muted">{cur.desc}</p>
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="mb-3 font-semibold">Levels Covered</p>
                <ul className="space-y-2">
                  {cur.levels.map((l) => (
                    <li key={l} className="flex items-center gap-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-gold flex-shrink-0" />
                      {l}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-3 font-semibold">Key Features</p>
                <ul className="space-y-2">
                  {cur.features.map((f) => (
                    <li key={f} className="flex items-center gap-3 text-sm">
                      <span className="h-2 w-2 rounded-full bg-primary dark:bg-gold flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </GlassCard>
        </ScrollReveal>
      ))}

      <ScrollReveal>
        <h2 className="mb-6 text-3xl font-bold">Subjects by Level</h2>
        <div className="mb-4 flex flex-wrap gap-2">
          {Object.keys(SUBJECTS_BY_LEVEL).map((lv) => (
            <button
              key={lv}
              onClick={() => setLevel(lv)}
              className={cn(
                'rounded-xl px-4 py-2 text-sm font-medium transition-all hover:scale-105',
                level === lv ? 'bg-primary text-white dark:bg-gold dark:text-dark' : 'glass glass-border',
              )}
            >
              {lv}
            </button>
          ))}
        </div>
        <GlassCard className="mb-16 p-8">
          <div className="flex flex-wrap gap-3">
            {SUBJECTS_BY_LEVEL[level].map((sub) => (
              <span key={sub} className="rounded-full border border-gold/40 bg-gold/10 px-4 py-2 text-sm font-medium">
                {sub}
              </span>
            ))}
          </div>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal>
        <h2 className="mb-6 text-3xl font-bold">Grading System</h2>
        <GlassCard className="mb-16 overflow-x-auto p-0">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-4">Grade</th>
                <th className="p-4">Score Range</th>
                <th className="p-4">Description</th>
              </tr>
            </thead>
            <tbody>
              {GRADING.map((g) => (
                <tr key={g.grade} className="border-b border-theme/50 transition hover:bg-tint/40 dark:hover:bg-dark-card">
                  <td className="p-4 font-bold text-primary dark:text-gold">{g.grade}</td>
                  <td className="p-4">{g.range}</td>
                  <td className="p-4 text-muted">{g.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal>
        <h2 className="mb-6 text-3xl font-bold">Academic Calendar 2026</h2>
        <div className="grid gap-6 md:grid-cols-3">
          {CALENDAR.map((t, i) => (
            <ScrollReveal key={t.term} delay={i * 0.1}>
              <GlassCard className="p-6">
                <h3 className="mb-4 text-lg font-bold text-primary dark:text-gold">{t.term}</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted">Opens</span>
                    <span className="font-medium">{t.start}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Closes</span>
                    <span className="font-medium">{t.end}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Exams</span>
                    <span className="font-medium text-gold">{t.exams}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted">Holiday</span>
                    <span className="font-medium">{t.holiday}</span>
                  </div>
                </div>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>
    </div>
  )
}
