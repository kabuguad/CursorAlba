import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Link } from 'react-router-dom'
import { Button } from '../components/ui/Button'

const FACILITIES = [
  {
    id: 'classrooms',
    name: 'Smart Classrooms',
    icon: '🖥️',
    desc: '86 air-conditioned smart classrooms with interactive whiteboards, high-speed Wi-Fi, and ergonomic furniture designed for CBC and IGCSE learning.',
    img: 'https://picsum.photos/seed/facility-classroom/800/600',
    highlights: ['Interactive whiteboards', 'High-speed fibre internet', 'Air-conditioned', 'CCTV monitored'],
  },
  {
    id: 'music',
    name: 'Music Studio',
    icon: '🎵',
    desc: 'Professional music studios with Steinway-ready piano rooms, acoustic-treated recording booths, ensemble rehearsal halls, and an ABRSM examination centre.',
    img: 'https://picsum.photos/seed/facility-music/800/600',
    highlights: ['Piano rooms', 'Recording booth', 'Ensemble hall', 'ABRSM centre'],
  },
  {
    id: 'dance',
    name: 'Dance Studio',
    icon: '🩰',
    desc: 'Full-wall mirrors, sprung wooden floors, professional lighting rigs, and 4K capture systems for portfolio development and performance recording.',
    img: 'https://picsum.photos/seed/facility-dance/800/600',
    highlights: ['Sprung floors', 'Full-wall mirrors', 'Professional lighting', '4K recording'],
  },
  {
    id: 'sports',
    name: 'Sports Complex',
    icon: '🏟️',
    desc: 'Premium sports complex with two football pitches, basketball and volleyball courts, 25m swimming pool, 400m athletics track, and a fully equipped gym.',
    img: 'https://picsum.photos/seed/facility-sports/800/600',
    highlights: ['25m swimming pool', 'Football pitches', 'Athletics track', 'Fully equipped gym'],
  },
  {
    id: 'library',
    name: 'Digital Library',
    icon: '📚',
    desc: 'A 10,000-volume library with digital cataloguing, quiet study rooms, a maker space, and access to global online databases and journals.',
    img: 'https://picsum.photos/seed/facility-library/800/600',
    highlights: ['10,000+ volumes', 'Digital catalogue', 'Study rooms', 'Online database access'],
  },
  {
    id: 'dining',
    name: 'Dining Hall',
    icon: '🍽️',
    desc: 'Spacious dining hall serving 600 students per sitting. Balanced, nutritionist-approved menus with halal, vegetarian, and allergy-aware options.',
    img: 'https://picsum.photos/seed/facility-dining/800/600',
    highlights: ['600-seat capacity', 'Nutritionist menus', 'Halal & vegetarian', 'Allergy-aware'],
  },
  {
    id: 'buses',
    name: 'School Buses',
    icon: '🚌',
    desc: 'Eight modern, GPS-tracked school buses covering Kutus, Kerugoya, Sagana, Kagio, Kagumo, Kianyaga, Mutira, and Ngariama routes.',
    img: 'https://picsum.photos/seed/facility-buses/800/600',
    highlights: ['8 buses', 'GPS tracked', '8 routes', 'Licensed drivers'],
  },
  {
    id: 'science',
    name: 'Science Laboratories',
    icon: '🔬',
    desc: 'Four dedicated labs — Biology, Chemistry, Physics, and Computer Science — equipped for KNEC and Cambridge IGCSE practical examinations.',
    img: 'https://picsum.photos/seed/facility-science/800/600',
    highlights: ['Biology lab', 'Chemistry lab', 'Physics lab', 'Computer science lab'],
  },
]

export function Facilities() {
  const [selected, setSelected] = useState<string | null>(null)
  const active = FACILITIES.find((f) => f.id === selected)

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">Facilities</h1>
        <p className="mx-auto max-w-2xl text-muted">World-class infrastructure designed for modern learning — click any facility to explore.</p>
      </ScrollReveal>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FACILITIES.map((f, i) => (
          <ScrollReveal key={f.id} delay={i * 0.06}>
            <button
              onClick={() => setSelected(selected === f.id ? null : f.id)}
              className={`w-full text-left transition-all hover:scale-105 ${selected === f.id ? 'ring-2 ring-gold rounded-3xl' : ''}`}
            >
              <GlassCard className="overflow-hidden p-0">
                <div className="relative h-40 overflow-hidden">
                  <img src={f.img} alt={f.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <span className="absolute bottom-3 left-3 text-3xl">{f.icon}</span>
                </div>
                <div className="p-4">
                  <h3 className="font-bold">{f.name}</h3>
                  <p className="mt-1 text-xs text-muted line-clamp-2">{f.desc}</p>
                </div>
              </GlassCard>
            </button>
          </ScrollReveal>
        ))}
      </div>

      {active && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[120] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="glass glass-border relative flex h-full max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-surface-elevated text-foreground lg:flex-row"
            >
              <button
                onClick={() => setSelected(null)}
                className="absolute top-4 right-4 z-10 rounded-xl p-2 hover:bg-primary/10"
              >
                <X className="h-6 w-6" />
              </button>
              <img
                src={active.img}
                alt={active.name}
                className="h-64 w-full object-cover lg:h-auto lg:w-1/2"
              />
              <div className="flex-1 overflow-y-auto p-8 lg:w-1/2">
                <span className="text-4xl">{active.icon}</span>
                <h2 className="mt-4 text-3xl font-bold text-primary dark:text-gold">{active.name}</h2>
                <p className="mt-4 text-muted leading-relaxed">{active.desc}</p>
                <div className="mt-6 flex flex-wrap gap-2">
                  {active.highlights.map((h) => (
                    <span key={h} className="rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-medium">
                      {h}
                    </span>
                  ))}
                </div>
                <div className="mt-8">
                  <Link to="/admissions" onClick={() => setSelected(null)}>
                    <Button variant="primary">Apply for Admission</Button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>
      )}

      <ScrollReveal className="mt-16 text-center">
        <GlassCard className="p-10">
          <h2 className="mb-4 text-3xl font-bold">Experience It In Person</h2>
          <p className="mb-8 text-muted">Book a campus tour and see our facilities first-hand. Adjacent to the Governor's Offices, Kutus.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/contact">
              <Button variant="primary">Book a Campus Tour</Button>
            </Link>
            <Link to="/admissions">
              <Button variant="outline">Apply Online</Button>
            </Link>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  )
}
