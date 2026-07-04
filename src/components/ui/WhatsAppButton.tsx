import { MessageCircle } from 'lucide-react'

export function WhatsAppButton() {
  return (
    <a
      href="https://wa.me/254712345678?text=Hello%20Demo%20School"
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-[0_0_30px_rgba(37,211,102,0.6)] pulse-glow"
      aria-label="Contact on WhatsApp"
    >
      <MessageCircle className="h-7 w-7" />
    </a>
  )
}
