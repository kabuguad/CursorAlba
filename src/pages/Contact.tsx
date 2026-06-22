import { useState } from 'react'
import { motion } from 'framer-motion'
import { GlassCard } from '../components/ui/GlassCard'
import { useToast } from '../contexts/ToastContext'
import { Phone, Mail, MapPin, MessageCircle, ArrowRight, Clock } from 'lucide-react'
import { useCmsBlocks } from '../hooks/useCmsData'

function useCms() {
  const { data: blocks = [] } = useCmsBlocks('pg-contact')
  return (key: string, fallback: string) => blocks.find(b => b.key === key)?.value || fallback
}

function FadeIn({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay }}>
      {children}
    </motion.div>
  )
}

const FIELD = 'w-full rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 px-4 py-3 text-sm text-foreground placeholder-muted outline-none transition focus:border-gold focus:ring-2 focus:ring-gold/20'

export function Contact() {
  const get = useCms()
  const { showToast } = useToast()
  const [errors, setErrors] = useState<Record<string, string>>({})

  const validate = (fd: FormData) => {
    const e: Record<string, string> = {}
    if (!fd.get('name')) e.name = 'Name is required'
    if (!fd.get('email') || !String(fd.get('email')).includes('@')) e.email = 'Valid email required'
    if (!fd.get('message') || String(fd.get('message')).length < 10) e.message = 'Message must be at least 10 characters'
    return e
  }

  const submit = (ev: React.FormEvent<HTMLFormElement>) => {
    ev.preventDefault()
    const fd = new FormData(ev.currentTarget)
    const e = validate(fd)
    setErrors(e)
    if (Object.keys(e).length === 0) {
      showToast('Message sent! We will respond within 24 hours.')
      ev.currentTarget.reset()
    }
  }

  const phonePrimary   = get('phone.primary',   '+254 712 345 678')
  const phoneSecondary = get('phone.secondary',  '+254 734 567 890')
  const emailPrimary   = get('email.primary',   'info@alberschool.ke')
  const emailSecondary = get('email.secondary', 'admissions@alberschool.ke')
  const whatsapp       = get('whatsapp',         '254712345678')
  const addressLine1   = get('address.line1',   "Adjacent to Governor's Offices")
  const addressLine2   = get('address.line2',   'Kutus Town, Kirinyaga County')
  const hours          = get('hours',            'Monday – Friday 7:30 AM – 5:00 PM · Saturday 8:00 AM – 1:00 PM')

  const CONTACT_CARDS = [
    { icon: Phone,         label: 'Phone',    value: phonePrimary,  sub: phoneSecondary,   href: `tel:${phonePrimary.replace(/\s/g, '')}`,  color: 'text-blue-500',   bg: 'bg-blue-500/10',   ring: 'ring-blue-400/20' },
    { icon: Mail,          label: 'Email',    value: emailPrimary,  sub: emailSecondary,   href: `mailto:${emailPrimary}`,                   color: 'text-purple-500', bg: 'bg-purple-500/10', ring: 'ring-purple-400/20' },
    { icon: MessageCircle, label: 'WhatsApp', value: phonePrimary,  sub: 'Mon–Sat 8AM–6PM',href: `https://wa.me/${whatsapp}?text=Hello%2C%20I%27m%20interested%20in%20Alber%20School`, color: 'text-green-500', bg: 'bg-green-500/10', ring: 'ring-green-400/20' },
    { icon: MapPin,        label: 'Address',  value: addressLine1,  sub: addressLine2,     href: 'https://maps.google.com/?q=Kutus,Kirinyaga,Kenya', color: 'text-gold', bg: 'bg-gold/10', ring: 'ring-gold/20' },
  ]

  return (
    <div className="overflow-hidden">

      {/* ── Hero ── */}
      <section
        className="relative flex min-h-[68vh] items-end justify-center overflow-hidden"
        style={{ clipPath: 'polygon(0 0, 100% 0, 100% 90%, 0 100%)' }}
      >
        <img
          src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80"
          alt=""
          aria-hidden
          className="ken-burns absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/92 via-black/60 to-black/20" />
        <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-gold via-gold/60 to-transparent" />
        <div className="relative z-10 mx-auto max-w-3xl px-6 pb-20 pt-40 text-center">
          <motion.div initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/40 bg-black/30 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-gold backdrop-blur-sm">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-gold" />Get In Touch
            </span>
            <h1 className="mt-4 text-5xl font-extrabold leading-tight text-white md:text-7xl [text-shadow:_0_4px_32px_rgba(0,0,0,0.6)]">{get('hero.headline', 'Contact Us')}</h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/75">{get('hero.subheadline', "Adjacent to the Governor's Offices, Kutus — Kirinyaga County. We're here to help.")}</p>
          </motion.div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-20">

        {/* ── Contact Cards ── */}
        <div className="mb-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {CONTACT_CARDS.map((card, i) => (
            <FadeIn key={card.label} delay={i * 0.08}>
              <a href={card.href} target="_blank" rel="noreferrer" className="group block h-full">
                <div className={`h-full rounded-2xl border p-6 transition-all duration-300 hover:scale-[1.04] hover:shadow-xl ${card.ring} ring-1 bg-white dark:bg-[#111] hover:ring-2`}>
                  <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${card.bg} ${card.ring} ring-1 transition-transform group-hover:scale-110`}>
                    <card.icon className={`h-6 w-6 ${card.color}`} />
                  </div>
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-muted">{card.label}</p>
                  <p className={`font-bold ${card.color}`}>{card.value}</p>
                  <p className="mt-0.5 text-sm text-muted">{card.sub}</p>
                  <span className={`mt-3 inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-widest ${card.color} opacity-0 group-hover:opacity-100 transition-opacity`}>
                    Contact <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </a>
            </FadeIn>
          ))}
        </div>

        {/* ── Map + Form ── */}
        <div className="grid gap-8 lg:grid-cols-2">
          <FadeIn>
            <GlassCard className="overflow-hidden p-0 h-[440px]">
              <iframe
                title="Alber School Location — Kutus, Kirinyaga County"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d37.285!3d-0.518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828bf2f9c72a4a1%3A0x4a6d4f5e1b3c2d8e!2sKutus%2C%20Kirinyaga!5e0!3m2!1sen!2ske!4v1"
                className="h-full w-full border-0 grayscale contrast-125"
                loading="lazy"
              />
            </GlassCard>
          </FadeIn>

          <FadeIn delay={0.1}>
            <div className="rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] p-8 shadow-sm">
              <h2 className="mb-6 text-2xl font-bold">Send a Message</h2>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <input name="name" placeholder="Your Full Name" className={FIELD} />
                  {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <input name="email" type="email" placeholder="Email Address" className={FIELD} />
                    {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
                  </div>
                  <input name="phone" placeholder="Phone / WhatsApp" className={FIELD} />
                </div>
                <div>
                  <select name="subject" className={FIELD}>
                    <option value="">Subject</option>
                    <option>Admissions Enquiry</option>
                    <option>Campus Tour Request</option>
                    <option>Fee Structure</option>
                    <option>General Enquiry</option>
                  </select>
                </div>
                <div>
                  <textarea name="message" rows={5} placeholder="Your message..." className={`${FIELD} resize-none`} />
                  {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message}</p>}
                </div>
                <button type="submit" className="w-full rounded-xl bg-primary px-6 py-3.5 font-bold text-white transition hover:bg-primary/90 hover:scale-[1.01] dark:bg-gold dark:text-black dark:hover:bg-yellow-400">
                  Send Message <ArrowRight className="inline h-4 w-4 ml-1" />
                </button>
              </form>
            </div>
          </FadeIn>
        </div>

        {/* ── Office Hours ── */}
        <FadeIn className="mt-8" delay={0.1}>
          <div className="flex flex-col items-center gap-2 rounded-2xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#111] p-6 text-center sm:flex-row sm:text-left">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gold/10 text-gold">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Office Hours</p>
              <p className="text-sm text-muted">{hours}</p>
            </div>
            <div className="sm:ml-auto text-sm text-muted">For urgent matters outside office hours, please use WhatsApp.</div>
          </div>
        </FadeIn>
      </div>

      {/* ── Floating WhatsApp ── */}
      <a
        href={`https://wa.me/${whatsapp}?text=Hello%2C%20I%27m%20interested%20in%20Alber%20School`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-green-500 text-white shadow-xl transition hover:scale-110 hover:bg-green-600"
        aria-label="WhatsApp"
      >
        <MessageCircle className="h-7 w-7" />
      </a>
    </div>
  )
}
