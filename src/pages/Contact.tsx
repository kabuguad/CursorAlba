import { useState } from 'react'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { ScrollReveal } from '../components/ui/ScrollReveal'
import { useToast } from '../contexts/ToastContext'

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
      </ScrollReveal>

      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <ScrollReveal>
          <GlassCard className="overflow-hidden p-0 h-[400px]">
            <iframe
              title="Alber School Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3989.5!2d37.3!3d-0.5!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zS3V0dXMsIEtpcmlueWFnYQ!5e0!3m2!1sen!2ske!4v1"
              className="h-full w-full border-0 grayscale contrast-125"
              loading="lazy"
            />
          </GlassCard>
        </ScrollReveal>

        <ScrollReveal delay={0.1}>
          <GlassCard className="p-8">
            <form onSubmit={submit} className="space-y-4">
              <div>
                <input name="name" placeholder="Your Name" className="field" />
                {errors.name && <p className="text-xs text-gold mt-1">{errors.name}</p>}
              </div>
              <div>
                <input name="email" type="email" placeholder="Email" className="field" />
                {errors.email && <p className="text-xs text-gold mt-1">{errors.email}</p>}
              </div>
              <div>
                <textarea name="message" rows={5} placeholder="Message" className="field resize-none" />
                {errors.message && <p className="text-xs text-gold mt-1">{errors.message}</p>}
              </div>
              <Button type="submit" variant="primary" className="w-full">Send Message</Button>
            </form>
          </GlassCard>
        </ScrollReveal>
      </div>

    </div>
  )
}
