export interface Pillar {
  id: string
  icon: string
  title: string
  desc: string
  gradient: string
}

export const GRADIENT_MAP: Record<string, { color: string; border: string; label: string; preview: string }> = {
  green:  { color: 'from-green-500/15 to-emerald-500/5',  border: 'border-green-400/30',  label: 'Green',  preview: '#22c55e' },
  blue:   { color: 'from-blue-500/15 to-cyan-500/5',      border: 'border-blue-400/30',   label: 'Blue',   preview: '#3b82f6' },
  amber:  { color: 'from-amber-500/15 to-orange-500/5',   border: 'border-amber-400/30',  label: 'Amber',  preview: '#f59e0b' },
  purple: { color: 'from-purple-500/15 to-violet-500/5',  border: 'border-purple-400/30', label: 'Purple', preview: '#a855f7' },
  red:    { color: 'from-red-500/15 to-rose-500/5',       border: 'border-red-400/30',    label: 'Red',    preview: '#ef4444' },
  teal:   { color: 'from-teal-500/15 to-cyan-500/5',      border: 'border-teal-400/30',   label: 'Teal',   preview: '#14b8a6' },
  indigo: { color: 'from-indigo-500/15 to-blue-500/5',    border: 'border-indigo-400/30', label: 'Indigo', preview: '#6366f1' },
  pink:   { color: 'from-pink-500/15 to-rose-500/5',      border: 'border-pink-400/30',   label: 'Pink',   preview: '#ec4899' },
  gold:   { color: 'from-yellow-500/15 to-amber-500/5',   border: 'border-yellow-400/30', label: 'Gold',   preview: '#eab308' },
  slate:  { color: 'from-slate-500/15 to-gray-500/5',     border: 'border-slate-400/30',  label: 'Slate',  preview: '#64748b' },
}

export const DEFAULT_PILLARS: Pillar[] = [
  {
    id: 'p1',
    icon: '🌱',
    title: 'Holistic Development',
    desc: 'CBC goes beyond rote learning. Lessons and projects integrate knowledge with life skills, fostering creativity, teamwork, and self-confidence alongside academic excellence.',
    gradient: 'green',
  },
  {
    id: 'p2',
    icon: '🎯',
    title: 'Learner-Centred Teaching',
    desc: 'Teachers at Alber act as facilitators and mentors — guiding learners through project-based and inquiry-based experiences rather than passive content delivery.',
    gradient: 'blue',
  },
  {
    id: 'p3',
    icon: '📊',
    title: 'Continuous Assessment',
    desc: 'Formative and summative assessments throughout each term replace high-stakes cramming, rewarding skill mastery and reducing exam pressure for every learner.',
    gradient: 'amber',
  },
  {
    id: 'p4',
    icon: '🤝',
    title: 'Parent & Community Engagement',
    desc: 'CBC actively involves parents and the wider Kirinyaga community. Learning extends beyond the classroom — reinforced at home and through community service projects.',
    gradient: 'purple',
  },
]
