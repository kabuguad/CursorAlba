import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { Button } from '../components/ui/Button'
import { cn } from '../lib/utils'

const CATEGORIES = [
  {
    id: 'sports',
    label: 'Sports & Physical',
    icon: '🏆',
    color: 'from-green-500/20 to-emerald-500/10',
    border: 'border-green-500/30',
    heading: 'Sports & Physical Activities',
    intro: 'Physical Education is offered to all learners. Senior School students may pursue specialised sports pathways alongside competitive inter-school and national programmes.',
    activities: [
      { name: 'Athletics', icon: '🏃', desc: '400m track, field events, relay teams and cross-country competing at county and national level.' },
      { name: 'Ball Games', icon: '⚽', desc: 'Football, basketball, volleyball and netball — structured leagues, coaching and inter-school fixtures.' },
      { name: 'Gymnastics', icon: '🤸', desc: 'Floor work, apparatus and rhythmic gymnastics offered through our Physical Education programme.' },
      { name: 'Martial Arts', icon: '🥋', desc: 'Taekwondo and karate offered as both fitness training and competitive discipline.' },
      { name: 'Boxing', icon: '🥊', desc: 'Supervised boxing and fitness boxing under certified coaches in our dedicated ring.' },
      { name: 'Indoor Sports', icon: '🏓', desc: 'Table tennis, chess, scrabble, and badminton available for all year groups.' },
      { name: 'Water Sports', icon: '🏊', desc: '25m heated pool for competitive swimming, water polo and synchronized swimming.' },
      { name: 'Outdoor Pursuits', icon: '⛰️', desc: "Hiking, orienteering, camping, and environmental trail activities in Kirinyaga's rolling hills." },
    ],
    link: { to: '/sports', label: 'View Sports Page' },
  },
  {
    id: 'arts',
    label: 'Creative & Performing Arts',
    icon: '🎭',
    color: 'from-purple-500/20 to-pink-500/10',
    border: 'border-purple-500/30',
    heading: 'Creative & Performing Arts',
    intro: 'Music, dance, drama and visual arts are central to learner development at Alber. Artistic and aesthetic competencies are assessed formally as part of the CBC framework.',
    activities: [
      { name: 'Music', icon: '🎵', desc: 'Piano, violin, guitar, brass, woodwind, drums and choir. ABRSM examination centre on campus.' },
      { name: 'Dance', icon: '💃', desc: 'Ballet, contemporary, African dance and hip-hop taught in our sprung-floor dance studios.' },
      { name: 'Drama & Theatre', icon: '🎭', desc: 'Annual productions, script writing, stage craft, lighting design and performance portfolios.' },
      { name: 'Elocution', icon: '🎤', desc: 'Public speaking, debate, poetry recitation and oratory — internal and national competitions.' },
      { name: 'Fine Arts', icon: '🎨', desc: 'Painting, drawing, sculpture and mixed media across all levels with exhibition opportunities.' },
      { name: 'Applied Arts', icon: '✂️', desc: 'Textile design, ceramics, graphic design and craft with real-world application.' },
      { name: 'Visual Arts', icon: '📷', desc: 'Photography, videography and digital media explored through the lens of creative storytelling.' },
      { name: 'Time-Based Media', icon: '🎬', desc: 'Film-making, animation and multimedia production for Senior School learners.' },
    ],
    links: [
      { to: '/music', label: 'Music Academy' },
      { to: '/drama-dance', label: 'Drama & Dance' },
    ],
  },
  {
    id: 'community',
    label: 'Social & Community',
    icon: '🤝',
    color: 'from-blue-500/20 to-cyan-500/10',
    border: 'border-blue-500/30',
    heading: 'Social, Cultural & Community Activities',
    intro: 'Community Service Learning (CSL) builds ethical, moral and civic values. Learners engage with their community and Kenya\'s rich cultural heritage through structured programmes.',
    activities: [
      { name: 'Community Service Learning', icon: '❤️', desc: 'Structured CSL projects in Kutus and Kirinyaga County — environmental, health and education initiatives.' },
      { name: 'Kenya National Music Festival', icon: '🎼', desc: 'Annual participation exposes learners to diverse cultural instruments and musical traditions from across Kenya.' },
      { name: 'Cultural Festivals', icon: '🪘', desc: 'Celebrating Kenyan heritage through food, costume, language, song and storytelling.' },
      { name: 'Debate & Model UN', icon: '🌍', desc: 'Critical thinking, diplomacy and global awareness through inter-school debate and Model UN simulations.' },
      { name: 'Environmental Clubs', icon: '🌱', desc: 'Sustainability projects including tree planting, recycling drives and solar energy education.' },
      { name: 'Student Council', icon: '🗳️', desc: 'Elected student leadership developing governance, advocacy and civic responsibility skills.' },
      { name: 'Peer Counselling', icon: '🤲', desc: 'Trained student peer supporters promoting mental wellbeing and positive school culture.' },
      { name: 'Inter-House Competitions', icon: '🏅', desc: 'Cross-disciplinary house competitions in academics, sports, arts and community engagement.' },
    ],
  },
  {
    id: 'cts',
    label: 'Career & Technical',
    icon: '⚙️',
    color: 'from-amber-500/20 to-orange-500/10',
    border: 'border-amber-500/30',
    heading: 'Integrated Career & Technical Activities (CTS)',
    intro: 'At Senior School level (Grades 10–12), learners engage in practical and vocational options aligned to their interests and potential career paths — fully integrated into the CBC framework.',
    activities: [
      { name: 'Tourism & Hospitality', icon: '🏨', desc: 'Front office operations, tour guiding, event management and customer service fundamentals.' },
      { name: 'Culinary Arts', icon: '👨‍🍳', desc: 'Food preparation, nutrition, kitchen management and catering for school and community events.' },
      { name: 'Hairdressing & Beauty', icon: '💇', desc: 'Salon skills, cosmetology basics and entrepreneurship for the beauty industry.' },
      { name: 'Welding & Metalwork', icon: '🔩', desc: 'Fabrication, welding techniques and basic engineering for technical career pathways.' },
      { name: 'Photography', icon: '📸', desc: 'Digital photography, darkroom techniques, editing and commercial photography practice.' },
      { name: 'Carpentry & Woodwork', icon: '🪚', desc: 'Joinery, furniture making and woodwork design with an entrepreneurship focus.' },
      { name: 'Agriculture', icon: '🌾', desc: 'Crop farming, animal husbandry, agribusiness and sustainable food systems aligned to Kirinyaga\'s context.' },
      { name: 'ICT & Digital Projects', icon: '💻', desc: 'Web development, coding, data management, app design and digital entrepreneurship projects.' },
    ],
  },
]

export function CoCurricular() {
  const location = useLocation()
  const [active, setActive] = useState(() => {
    const hash = location.hash.slice(1)
    return CATEGORIES.some((c) => c.id === hash) ? hash : 'sports'
  })

  useEffect(() => {
    const hash = location.hash.slice(1)
    if (CATEGORIES.some((c) => c.id === hash)) {
      setActive(hash)
    }
  }, [location.hash])

  const setTab = (id: string) => {
    setActive(id)
    window.history.replaceState(null, '', `#${id}`)
  }

  const current = CATEGORIES.find((c) => c.id === active)!

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal className="mb-16 text-center">
        <h1 className="mb-4 text-5xl font-bold md:text-7xl">Co-Curricular</h1>
        <p className="mx-auto max-w-2xl text-muted">
          Beyond the classroom — four pillars of holistic development aligned to Kenya's CBC framework and Alber School's vision of whole-learner excellence.
        </p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="mb-10 flex overflow-x-auto pb-2 scrollbar-hide justify-start md:justify-center gap-3">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setTab(cat.id)}
              className={cn(
                'flex items-center flex-shrink-0 gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition-all hover:scale-105 whitespace-nowrap',
                active === cat.id
                  ? 'bg-primary text-white dark:bg-gold dark:text-dark'
                  : 'glass glass-border',
              )}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal key={active} delay={0.05}>
        <div className={cn('mb-10 rounded-3xl border bg-gradient-to-br p-8', current.color, current.border)}>
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-5xl">{current.icon}</span>
            <div>
              <h2 className="text-3xl font-bold">{current.heading}</h2>
              <p className="mx-auto mt-2 max-w-3xl text-muted">{current.intro}</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {current.activities.map((act, i) => (
            <ScrollReveal key={act.name} delay={i * 0.05}>
              <GlassCard className="h-full p-5">
                <span className="mb-3 block text-4xl">{act.icon}</span>
                <h3 className="mb-1 font-bold text-primary dark:text-gold">{act.name}</h3>
                <p className="text-xs text-muted leading-relaxed">{act.desc}</p>
              </GlassCard>
            </ScrollReveal>
          ))}
        </div>

        {'links' in current && Array.isArray((current as typeof CATEGORIES[1]).links) && (
          <div className="mt-8 flex flex-wrap gap-3">
            {(current as typeof CATEGORIES[1]).links.map((l) => (
              <Link key={l.to} to={l.to}>
                <Button variant="primary">{l.label} →</Button>
              </Link>
            ))}
          </div>
        )}
        {'link' in current && (current as typeof CATEGORIES[0]).link && (
          <div className="mt-8">
            <Link to={(current as typeof CATEGORIES[0]).link.to}>
              <Button variant="primary">{(current as typeof CATEGORIES[0]).link.label} →</Button>
            </Link>
          </div>
        )}
      </ScrollReveal>

      <ScrollReveal className="mt-20">
        <GlassCard className="p-8 text-center">
          <h2 className="mb-4 text-3xl font-bold">Enrich Your Child's Journey</h2>
          <p className="mb-8 text-muted max-w-2xl mx-auto">
            Every learner at Alber participates in co-curricular activities as part of their holistic CBC assessment. Talk to us about pathways that match your child's passions.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/admissions"><Button variant="primary">Apply for Admission</Button></Link>
            <Link to="/contact"><Button variant="outline">Speak to an Advisor</Button></Link>
          </div>
        </GlassCard>
      </ScrollReveal>
    </div>
  )
}
