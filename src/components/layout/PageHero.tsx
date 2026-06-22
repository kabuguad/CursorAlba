import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

type Overlay = 'dark' | 'green' | 'blue' | 'purple' | 'amber' | 'teal' | 'indigo' | 'rose'
type Variant = 'parallax' | 'cinematic' | 'split'
type Height  = 'sm' | 'md' | 'lg' | 'xl'
type Align   = 'center' | 'left'

const OVERLAY: Record<Overlay, string> = {
  dark:   'from-black/90 via-black/65 to-black/20',
  green:  'from-[#071007]/92 via-[#0d1b0d]/65 to-[#0d1b0d]/10',
  blue:   'from-blue-950/92 via-blue-900/65 to-blue-800/10',
  purple: 'from-purple-950/92 via-purple-900/65 to-purple-800/10',
  amber:  'from-amber-950/92 via-amber-900/65 to-amber-800/10',
  teal:   'from-teal-950/92 via-teal-900/65 to-teal-800/10',
  indigo: 'from-indigo-950/92 via-indigo-900/65 to-indigo-800/10',
  rose:   'from-rose-950/92 via-rose-900/65 to-rose-800/10',
}

const HEIGHT: Record<Height, string> = {
  sm: 'min-h-[45vh]',
  md: 'min-h-[55vh]',
  lg: 'min-h-[65vh]',
  xl: 'min-h-[80vh]',
}

interface PageHeroProps {
  title: string
  subtitle?: string
  badge?: string
  image: string
  variant?: Variant
  overlay?: Overlay
  height?: Height
  align?: Align
  children?: ReactNode
}

export function PageHero({
  title,
  subtitle,
  badge,
  image,
  variant = 'cinematic',
  overlay = 'dark',
  height = 'lg',
  align = 'center',
  children,
}: PageHeroProps) {
  const ovClass = OVERLAY[overlay]
  const htClass = HEIGHT[height]
  const centered = align === 'center'

  /* ── PARALLAX (fixed bg attachment) ─────────────────────────────────── */
  if (variant === 'parallax') {
    return (
      <section className={`relative flex ${htClass} items-center justify-center overflow-hidden`}>
        <img
          src={image}
          alt=""
          aria-hidden
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div className={`absolute inset-0 bg-gradient-to-t ${ovClass}`} />
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-gold via-gold/50 to-transparent" />
        <div className={`relative z-10 mx-auto max-w-4xl px-6 py-20 ${centered ? 'text-center' : ''}`}>
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            {badge && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-gold" />
                {badge}
              </span>
            )}
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_24px_rgba(0,0,0,0.5)]">
              {title}
            </h1>
            {subtitle && (
              <p className={`mt-6 text-lg leading-relaxed text-white/75 ${centered ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
                {subtitle}
              </p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
        </div>
      </section>
    )
  }

  /* ── SPLIT (image right, content left) ──────────────────────────────── */
  if (variant === 'split') {
    return (
      <section className={`relative grid overflow-hidden md:grid-cols-2 ${htClass}`}>
        <div
          className={`flex flex-col justify-center bg-gradient-to-br ${
            overlay === 'green' ? 'from-[#0d1b0d] to-[#152015]' :
            overlay === 'purple' ? 'from-purple-950 to-purple-900' :
            overlay === 'amber' ? 'from-amber-950 to-amber-900' :
            'from-gray-950 to-gray-900'
          } px-8 py-20 md:px-16`}
        >
          <motion.div initial={{ opacity: 0, x: -32 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            {badge && (
              <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
                {badge}
              </span>
            )}
            <h1 className="mt-3 text-4xl font-extrabold leading-tight text-white md:text-6xl [text-shadow:_0_4px_24px_rgba(0,0,0,0.4)]">
              {title}
            </h1>
            {subtitle && (
              <p className="mt-5 max-w-lg text-lg leading-relaxed text-white/75">{subtitle}</p>
            )}
            {children && <div className="mt-8">{children}</div>}
          </motion.div>
        </div>
        <div className="relative min-h-[300px] overflow-hidden">
          <img
            src={image}
            alt=""
            aria-hidden
            className="ken-burns absolute inset-0 h-full w-full object-cover"
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${ovClass} from-transparent`} />
        </div>
      </section>
    )
  }

  /* ── CINEMATIC (default — angled bottom clip) ────────────────────────── */
  return (
    <section
      className={`relative flex ${htClass} items-end overflow-hidden`}
      style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
    >
      <img
        src={image}
        alt=""
        aria-hidden
        className="ken-burns absolute inset-0 h-full w-full object-cover"
      />
      <div className={`absolute inset-0 bg-gradient-to-t ${ovClass}`} />
      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold via-gold/60 to-transparent" />

      <div className={`relative z-10 mx-auto w-full max-w-6xl px-8 pb-24 ${centered ? 'text-center' : ''}`}>
        <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          {badge && (
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />
              {badge}
            </span>
          )}
          <h1
            className={`mt-3 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_32px_rgba(0,0,0,0.7)] ${centered ? '' : 'max-w-3xl'}`}
          >
            {title}
          </h1>
          {subtitle && (
            <p className={`mt-5 text-lg leading-relaxed text-white/80 ${centered ? 'mx-auto max-w-2xl' : 'max-w-xl'}`}>
              {subtitle}
            </p>
          )}
          {children && <div className="mt-7">{children}</div>}
        </motion.div>
      </div>
    </section>
  )
}
