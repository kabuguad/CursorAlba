import { useState } from 'react'
import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'

const SCHOOL_LEVELS = [
  {
    id: 'playgroup',
    name: 'Playgroup',
    ages: 'Ages 2 – 3',
    icon: '🧸',
    color: 'from-pink-500/20 to-rose-500/10',
    border: 'border-pink-400/30',
    desc: 'A warm, nurturing environment that sparks curiosity through play. Children develop social, emotional, and early language skills in our purpose-built Playgroup centre.',
    highlights: ['Play-based learning', 'Structured routines', 'Creative exploration', 'Social development', 'Music & movement', 'Early number sense'],
  },
  {
    id: 'ecde',
    name: 'ECDE',
    ages: 'PP1 & PP2 · Ages 4 – 5',
    icon: '🌱',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-400/30',
    desc: 'Early Childhood Development Education aligned to the CBC framework. PP1 and PP2 build foundational literacy, numeracy, and environmental awareness through structured activities.',
    highlights: ['Language Activities', 'Mathematical Activities', 'Environmental Activities', 'Psychomotor & Creative Arts', 'Religious Education', 'Music'],
  },
  {
    id: 'lower-primary',
    name: 'Lower Primary',
    ages: 'Grades 1 – 3 · Ages 6 – 8',
    icon: '📚',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-400/30',
    desc: 'Building core competencies in literacy and numeracy. Learners engage through integrated, activity-based units that connect learning to real-life contexts in Kirinyaga and beyond.',
    highlights: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Religious Education', 'Creative Arts', 'Physical Education'],
  },
  {
    id: 'upper-primary',
    name: 'Upper Primary',
    ages: 'Grades 4 – 6 · Ages 9 – 11',
    icon: '🔬',
    color: 'from-violet-500/20 to-purple-500/10',
    border: 'border-violet-400/30',
    desc: 'Deepening competencies across all learning areas. Learners begin exploring Agriculture and are assessed through Continuous Assessment Tests (CATs) each term.',
    highlights: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Agriculture', 'Creative Arts', 'Physical Education', 'Religious Education'],
  },
  {
    id: 'junior',
    name: 'Junior School',
    ages: 'Grades 7 – 9 · Ages 12 – 14',
    icon: '🎯',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-400/30',
    desc: "Junior Secondary School introduces career-based learning pathways. Learners in Grade 9 sit the Kenya Junior School Education Assessment (KJSEA) — Kenya's national transition exam.",
    highlights: ['English', 'Kiswahili', 'Mathematics', 'Integrated Science', 'Social Studies', 'Business Studies', 'Agriculture', 'Pre-Technical Studies', 'Creative Arts', 'Life Skills'],
  },
  {
    id: 'senior',
    name: 'Senior School',
    ages: 'Grades 10 – 12 · Ages 15 – 17',
    icon: '🎓',
    color: 'from-teal-500/20 to-cyan-500/10',
    border: 'border-teal-400/30',
    desc: "Senior School offers specialised pathways in Sciences, Humanities, STEM, and Arts & Sports. Learners sit the Kenya Certificate of Secondary Education (KCSE) at the end of Grade 12.",
    highlights: ['English', 'Kiswahili', 'Mathematics', 'Sciences (Biology/Chemistry/Physics)', 'Social Studies', 'Business Studies', 'Computer Science', 'Agriculture', 'Creative Arts & Design', 'Physical Education'],
  },
]

const COMPETENCIES = [
  {
    icon: '🗣️',
    title: 'Communication & Collaboration',
    desc: 'Learners express ideas clearly, listen actively, and work effectively in teams — skills essential in every career and community.',
  },
  {
    icon: '🧠',
    title: 'Critical Thinking & Problem Solving',
    desc: 'Structured inquiry, analysis, and creative problem-solving are woven into every subject so learners tackle real challenges with confidence.',
  },
  {
    icon: '💡',
    title: 'Creativity & Imagination',
    desc: 'From arts to STEM, learners are challenged to generate original ideas, experiment boldly, and appreciate diverse forms of expression.',
  },
  {
    icon: '🌍',
    title: 'Citizenship',
    desc: 'Understanding rights, duties, and active community participation builds responsible, patriotic, and globally aware young Kenyans.',
  },
  {
    icon: '💻',
    title: 'Digital Literacy',
    desc: 'ICT is a cross-cutting element at Alber — from responsible internet use and data privacy to coding and digital content creation.',
  },
  {
    icon: '📖',
    title: 'Learning to Learn',
    desc: 'Learners develop metacognitive skills — reflection, self-regulation, and adaptability — so they grow continuously throughout life.',
  },
  {
    icon: '💪',
    title: 'Self-Efficacy',
    desc: 'Building self-confidence, resilience, and a growth mindset ensures every learner believes in their ability to overcome obstacles.',
  },
]

const PILLARS = [
  {
    icon: '🌱',
    title: 'Holistic Development',
    desc: 'CBC goes beyond rote learning. Lessons and projects integrate knowledge with life skills, fostering creativity, teamwork, and self-confidence alongside academic excellence.',
    color: 'from-green-500/15 to-emerald-500/5',
    border: 'border-green-400/30',
  },
  {
    icon: '🎯',
    title: 'Learner-Centred Teaching',
    desc: 'Teachers at Alber act as facilitators and mentors — guiding learners through project-based and inquiry-based experiences rather than passive content delivery.',
    color: 'from-blue-500/15 to-cyan-500/5',
    border: 'border-blue-400/30',
  },
  {
    icon: '📊',
    title: 'Continuous Assessment',
    desc: 'Formative and summative assessments throughout each term replace high-stakes cramming, rewarding skill mastery and reducing exam pressure for every learner.',
    color: 'from-amber-500/15 to-orange-500/5',
    border: 'border-amber-400/30',
  },
  {
    icon: '🤝',
    title: 'Parent & Community Engagement',
    desc: "CBC actively involves parents and the wider Kirinyaga community. Learning extends beyond the classroom — reinforced at home and through community service projects.",
    color: 'from-purple-500/15 to-violet-500/5',
    border: 'border-purple-400/30',
  },
]

const VALUES = [
  { value: 'Responsibility', icon: '⚖️' },
  { value: 'Respect', icon: '🙏' },
  { value: 'Unity', icon: '🤝' },
  { value: 'Integrity', icon: '🌟' },
  { value: 'Patriotism', icon: '🇰🇪' },
  { value: 'Care', icon: '❤️' },
  { value: 'Compassion', icon: '🌸' },
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

const KEY_ASSESSMENTS = [
  { level: 'PP1 & PP2', exam: 'Continuous Portfolio Assessment', body: 'Internal', note: 'Play-based formative assessment each term' },
  { level: 'Grades 1 – 6', exam: 'Continuous Assessment Tests (CATs)', body: 'Internal / KNEC', note: '3 CATs per term + end-of-year school exams' },
  { level: 'Grade 9', exam: 'Kenya Junior School Education Assessment (KJSEA)', body: 'KNEC', note: 'National exam — gateway to Senior School' },
  { level: 'Grade 12', exam: 'Kenya Certificate of Secondary Education (KCSE)', body: 'KNEC', note: 'National final examination — university entry' },
]

export function Academics() {
  const [active, setActive] = useState('playgroup')
  const current = SCHOOL_LEVELS.find((l) => l.id === active)!

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">Programs & Academics</h1>
        <p className="mx-auto max-w-2xl text-muted">
          From Playgroup through Senior School — a seamless CBC journey that develops the whole learner across six structured levels.
        </p>
      </ScrollReveal>

      <ScrollReveal className="mb-16">
        <div className="rounded-3xl glass glass-border p-6 text-center">
          <p className="mb-4 text-xs font-bold uppercase tracking-widest text-muted">School Structure</p>
          <div className="flex overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center gap-2">
            {SCHOOL_LEVELS.map((lv) => (
              <button
                key={lv.id}
                onClick={() => setActive(lv.id)}
                className={cn(
                  'flex flex-col flex-shrink-0 rounded-2xl px-4 py-3 text-center transition-all hover:scale-105 min-w-[100px]',
                  active === lv.id
                    ? 'bg-primary text-white dark:bg-gold dark:text-dark'
                    : 'glass glass-border',
                )}
              >
                <span className="text-lg">{lv.icon}</span>
                <span className="mt-1 text-sm font-bold leading-tight">{lv.name}</span>
                <span className={cn('text-[10px]', active === lv.id ? 'text-white/70 dark:text-dark/70' : 'text-muted')}>{lv.ages}</span>
              </button>
            ))}
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal key={active} delay={0.05} className="mb-16">
        <div className={cn('rounded-3xl border bg-gradient-to-br p-8', current.color, current.border)}>
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-10">
            <div className="flex-1">
              <div className="mb-2 flex items-center gap-3">
                <span className="text-5xl">{current.icon}</span>
                <div>
                  <h2 className="text-3xl font-bold">{current.name}</h2>
                  <p className="text-sm text-muted">{current.ages}</p>
                </div>
              </div>
              <p className="mt-4 max-w-xl text-muted leading-relaxed">{current.desc}</p>
            </div>
            <div className="md:w-80">
              <p className="mb-3 text-sm font-bold uppercase tracking-wider">Learning Areas</p>
              <div className="flex flex-wrap gap-2">
                {current.highlights.map((h) => (
                  <span key={h} className="rounded-xl border border-gold/30 bg-gold/10 px-3 py-1.5 text-xs font-medium">
                    {h}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mb-16">
        <div className="mb-10 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">Our Approach</p>
          <h2 className="text-4xl font-bold">The CBC Difference</h2>
          <p className="mx-auto mt-3 max-w-2xl text-muted">
            Kenya's Competency-Based Curriculum moves beyond exams to develop seven core competencies that equip every learner for life, work, and active citizenship.
          </p>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {COMPETENCIES.slice(0, 6).map((c, i) => (
            <ScrollReveal key={c.title} delay={i * 0.07}>
              <GlassCard className="flex h-full flex-col gap-3 p-6">
                <span className="text-4xl">{c.icon}</span>
                <h3 className="font-bold leading-snug">{c.title}</h3>
                <p className="text-sm leading-relaxed text-muted">{c.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
          <ScrollReveal delay={0.42} className="sm:col-span-2 lg:col-span-1 xl:col-span-2">
            <GlassCard className="flex h-full flex-col gap-3 bg-gradient-to-br from-primary/10 to-gold/10 p-6">
              <span className="text-4xl">{COMPETENCIES[6].icon}</span>
              <h3 className="font-bold leading-snug">{COMPETENCIES[6].title}</h3>
              <p className="text-sm leading-relaxed text-muted">{COMPETENCIES[6].desc}</p>
            </GlassCard>
          </ScrollReveal>
        </div>
      </ScrollReveal>

      <ScrollReveal className="mb-16">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">How We Teach</p>
          <h2 className="text-4xl font-bold">Our Four Pillars</h2>
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          {PILLARS.map((p, i) => (
            <ScrollReveal key={p.title} delay={i * 0.1}>
              <div className={cn('h-full rounded-3xl border bg-gradient-to-br p-7', p.color, p.border)}>
                <span className="mb-4 block text-4xl">{p.icon}</span>
                <h3 className="mb-2 text-xl font-bold">{p.title}</h3>
                <p className="leading-relaxed text-muted">{p.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mb-16">
        <div className="mb-8 text-center">
          <p className="mb-2 text-sm font-bold uppercase tracking-widest text-gold">Character Formation</p>
          <h2 className="text-4xl font-bold">Values We Instil</h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            CBC integrates core societal values into every lesson and interaction — shaping citizens of character alongside scholars of merit.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {VALUES.map((v, i) => (
            <ScrollReveal key={v.value} delay={i * 0.06}>
              <GlassCard className="flex items-center gap-3 px-6 py-4">
                <span className="text-2xl">{v.icon}</span>
                <span className="text-base font-semibold">{v.value}</span>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold">Key National Assessments</h2>
        <GlassCard className="overflow-x-auto p-0">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-theme">
                <th className="p-4">Level</th>
                <th className="p-4">Assessment</th>
                <th className="p-4">Body</th>
                <th className="p-4">Note</th>
              </tr>
            </thead>
            <tbody>
              {KEY_ASSESSMENTS.map((a) => (
                <tr key={a.level} className="border-b border-theme/50 transition hover:bg-tint/40 dark:hover:bg-dark-card">
                  <td className="p-4 font-semibold text-primary dark:text-gold">{a.level}</td>
                  <td className="p-4 font-medium">{a.exam}</td>
                  <td className="p-4">
                    <span className="rounded-full bg-gold/20 px-2 py-1 text-xs font-bold text-primary dark:text-gold">{a.body}</span>
                  </td>
                  <td className="p-4 text-muted">{a.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </GlassCard>
      </ScrollReveal>

      <ScrollReveal className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold">Grading System</h2>
        <GlassCard className="overflow-x-auto p-0">
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

      <ScrollReveal className="mb-16">
        <h2 className="mb-6 text-center text-3xl font-bold">Academic Calendar 2026</h2>
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

      <ScrollReveal>
        <GlassCard className="p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Ready to Enrol?</h2>
          <p className="mb-8 max-w-xl mx-auto text-muted">
            Applications are open for the 2026 intake across all levels — from Playgroup to Grade 12. Limited spaces remain.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions"><Button variant="primary">Apply Now</Button></Link>
            <Link to="/contact"><Button variant="outline">Speak to an Advisor</Button></Link>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  )
}
