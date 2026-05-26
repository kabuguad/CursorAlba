import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'
import { Phone, Mail, MapPin, MessageCircle } from 'lucide-react'

const CONTACT_CARDS = [
  {
    icon: Phone,
    label: 'Phone',
    value: '+254 712 345 678',
    sub: '+254 734 567 890',
    href: 'tel:+254712345678',
    color: 'text-primary dark:text-gold',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'info@alberschool.ke',
    sub: 'admissions@alberschool.ke',
    href: 'mailto:info@alberschool.ke',
    color: 'text-primary dark:text-gold',
  },
  {
    icon: MessageCircle,
    label: 'WhatsApp',
    value: '+254 712 345 678',
    sub: 'Mon–Sat 8:00 AM–6:00 PM',
    href: 'https://wa.me/254712345678?text=Hello%2C%20I%27m%20interested%20in%20Alber%20School',
    color: 'text-green-600 dark:text-green-400',
  },
  {
    icon: MapPin,
    label: 'Address',
    value: 'Adjacent to Governor\'s Offices',
    sub: 'Kutus Town, Kirinyaga County',
    href: 'https://maps.google.com/?q=Kutus,Kirinyaga,Kenya',
    color: 'text-primary dark:text-gold',
  },
]

export function Contact() {
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

  return (
    <div className="mx-auto max-w-7xl px-4 py-12">
      <ScrollReveal>
        <h1 className="text-5xl font-bold md:text-7xl">Contact Us</h1>
        <p className="mt-4 max-w-2xl text-muted">Adjacent to the Governor's Offices, Kutus — Kirinyaga County. We're here to help.</p>
      </ScrollReveal>

      <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {CONTACT_CARDS.map((card, i) => (
          <ScrollReveal key={card.label} delay={i * 0.08}>
            <a href={card.href} target="_blank" rel="noreferrer" className="block h-full">
              <GlassCard className="flex h-full flex-col gap-3 p-6 transition hover:border-gold/50 hover:scale-105">
                <card.icon className={`h-7 w-7 ${card.color}`} />
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-muted">{card.label}</p>
                  <p className="font-bold text-foreground">{card.value}</p>
                  <p className="text-sm text-muted">{card.sub}</p>
                </div>
              </GlassCard>
            </a>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <ScrollReveal>
          <GlassCard className="overflow-hidden p-0 h-[400px]">
            <iframe
              title="Alber School Location — Kutus, Kirinyaga County"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d37.285!3d-0.518!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1828bf2f9c72a4a1%3A0x4a6d4f5e1b3c2d8e!2sKutus%2C%20Kirinyaga!5e0!3m2!1sen!2ske!4v1"
              className="h-full w-full border-0 grayscale contrast-125"
              loading="lazy"
            />
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <GlassCard className="p-8">
            <h2 className="mb-6 text-2xl font-bold">Send a Message</h2>
            <form onSubmit={submit} className="space-y-4">
              <div>
                <input name="name" placeholder="Your Full Name" className="field" />
                {errors.name && <p className="text-xs text-gold mt-1">{errors.name}</p>}
              </div>
              <div>
                <input name="email" type="email" placeholder="Email Address" className="field" />
                {errors.email && <p className="text-xs text-gold mt-1">{errors.email}</p>}
              </div>
              <div>
                <input name="phone" placeholder="Phone / WhatsApp (optional)" className="field" />
              </div>
              <div>
                <textarea name="message" rows={5} placeholder="Your message..." className="field resize-none" />
                {errors.message && <p className="text-xs text-gold mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" variant="primary" className="w-full">Send Message</Button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>

      <ScrollReveal className="mt-12">
        <GlassCard className="p-6 text-center">
          <p className="text-sm text-muted">
            <span className="font-semibold text-foreground">Office Hours:</span> Monday – Friday 7:30 AM – 5:00 PM · Saturday 8:00 AM – 1:00 PM
          </p>
          <p className="mt-1 text-sm text-muted">
            For urgent matters outside office hours, please use WhatsApp.
          </p>
        </GlassCard>
      </ScrollReveal>

      <a
        href="https://wa.me/254712345678?text=Hello%2C%20I%27m%20interested%20in%20Alber%20School"
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
