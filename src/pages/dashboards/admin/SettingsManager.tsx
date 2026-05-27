import { useState } from 'react'
import { Save, School, Phone, Globe, Link2, Map } from 'lucide-react'
import { useToast } from '../../../contexts/ToastContext'

const INP = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40'
const LABEL = 'mb-1 block text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider'

const TABS = [
  { id: 'school',  label: 'School Info', icon: School },
  { id: 'contact', label: 'Contact',     icon: Phone  },
  { id: 'social',  label: 'Social Media',icon: Globe  },
  { id: 'virtual', label: 'Virtual Tour',icon: Link2  },
]

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
      <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <h3 className="font-semibold text-gray-900 dark:text-white">{title}</h3>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export function SettingsManager() {
  const { showToast } = useToast()
  const [tab, setTab] = useState('school')

  const [school, setSchool] = useState({
    name: 'Alber School',
    motto: 'Where Excellence Meets Tomorrow',
    founded: '2005',
    county: 'Kirinyaga',
    town: 'Kutus',
    tagline: 'Premium private education in the heart of Kirinyaga.',
    description: 'A complete private school offering ECDE, Primary, Junior Secondary, and Senior School education through both CBC and Cambridge IGCSE pathways.',
  })

  const [contact, setContact] = useState({
    phone1: '+254 700 000 000',
    phone2: '+254 720 000 000',
    email: 'info@alberschool.ke',
    admissions: 'admissions@alberschool.ke',
    address: 'Adjacent to Governor\'s Offices, Kutus, Kirinyaga County, Kenya',
    poBox: 'P.O. Box 1000 – 10300, Kutus',
    whatsapp: '+254 700 000 000',
    officeHours: 'Mon–Fri: 7:00 AM – 5:00 PM · Sat: 8:00 AM – 1:00 PM',
    mapUrl: 'https://maps.google.com/?q=Kutus+Kirinyaga+Kenya',
  })

  const [social, setSocial] = useState({
    facebook: 'https://facebook.com/alberschool',
    instagram: 'https://instagram.com/alberschool',
    twitter: 'https://twitter.com/alberschool',
    youtube: 'https://youtube.com/@alberschool',
    tiktok: '',
    linkedin: '',
  })

  const [virtualTour, setVirtualTour] = useState({
    campus:     'https://cdn.polyhaven.com/asset_img/thumbs/school_quad.png?width=3000&height=1500',
    classrooms: 'https://cdn.polyhaven.com/asset_img/thumbs/school_hall.png?width=3000&height=1500',
    library:    'https://cdn.polyhaven.com/asset_img/thumbs/reading_room.png?width=3000&height=1500',
    music:      'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/music_hall_01.jpg',
    sports:     'https://dl.polyhaven.org/file/ph-assets/HDRIs/extra/Tonemapped%20JPG/gym_01.jpg',
  })

  const save = () => showToast('Settings saved ✓')

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Site Settings</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Manage school information, contact details, and site configuration</p>
        </div>
        <button onClick={save} className="flex items-center gap-2 rounded-xl bg-[#E8B84B] px-4 py-2.5 text-sm font-semibold text-[#0d1b0d] hover:bg-[#d4a43a] transition">
          <Save className="h-4 w-4" /> Save All
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-6 flex gap-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 p-1">
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition ${tab === t.id ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'}`}>
            <t.icon className="h-4 w-4" />
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── SCHOOL INFO ── */}
      {tab === 'school' && (
        <div className="space-y-6">
          <Card title="School Identity">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL}>School Name</label>
                <input className={INP} value={school.name} onChange={e => setSchool({ ...school, name: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Founded Year</label>
                <input className={INP} value={school.founded} onChange={e => setSchool({ ...school, founded: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>School Motto / Tagline</label>
                <input className={INP} value={school.motto} onChange={e => setSchool({ ...school, motto: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>County</label>
                <input className={INP} value={school.county} onChange={e => setSchool({ ...school, county: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Town / Location</label>
                <input className={INP} value={school.town} onChange={e => setSchool({ ...school, town: e.target.value })} />
              </div>
              <div className="sm:col-span-2">
                <label className={LABEL}>Hero Subtitle (public site)</label>
                <textarea rows={3} className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-yellow-400/40 resize-none" value={school.description} onChange={e => setSchool({ ...school, description: e.target.value })} />
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── CONTACT ── */}
      {tab === 'contact' && (
        <div className="space-y-6">
          <Card title="Phone Numbers">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL}>Main Line</label>
                <input className={INP} value={contact.phone1} onChange={e => setContact({ ...contact, phone1: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Secondary Line</label>
                <input className={INP} value={contact.phone2} onChange={e => setContact({ ...contact, phone2: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>WhatsApp Number</label>
                <input className={INP} value={contact.whatsapp} onChange={e => setContact({ ...contact, whatsapp: e.target.value })} />
              </div>
            </div>
          </Card>
          <Card title="Email Addresses">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className={LABEL}>General Enquiries</label>
                <input type="email" className={INP} value={contact.email} onChange={e => setContact({ ...contact, email: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Admissions</label>
                <input type="email" className={INP} value={contact.admissions} onChange={e => setContact({ ...contact, admissions: e.target.value })} />
              </div>
            </div>
          </Card>
          <Card title="Physical Address">
            <div className="space-y-4">
              <div>
                <label className={LABEL}>Street / Landmark Address</label>
                <input className={INP} value={contact.address} onChange={e => setContact({ ...contact, address: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>P.O. Box</label>
                <input className={INP} value={contact.poBox} onChange={e => setContact({ ...contact, poBox: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Office Hours</label>
                <input className={INP} value={contact.officeHours} onChange={e => setContact({ ...contact, officeHours: e.target.value })} />
              </div>
              <div>
                <label className={LABEL}>Google Maps URL</label>
                <div className="flex gap-2">
                  <input className={INP} value={contact.mapUrl} onChange={e => setContact({ ...contact, mapUrl: e.target.value })} />
                  <a href={contact.mapUrl} target="_blank" rel="noreferrer" className="flex items-center gap-1 rounded-lg border border-gray-200 dark:border-gray-700 px-3 text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700">
                    <Map className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* ── SOCIAL ── */}
      {tab === 'social' && (
        <Card title="Social Media Links">
          <div className="space-y-4">
            {([
              ['facebook',  'Facebook Page URL'],
              ['instagram', 'Instagram Profile URL'],
              ['twitter',   'X / Twitter Profile URL'],
              ['youtube',   'YouTube Channel URL'],
              ['tiktok',    'TikTok Profile URL'],
              ['linkedin',  'LinkedIn Page URL'],
            ] as [keyof typeof social, string][]).map(([key, label]) => (
              <div key={key}>
                <label className={LABEL}>{label}</label>
                <input className={INP} placeholder="https://…" value={social[key]} onChange={e => setSocial({ ...social, [key]: e.target.value })} />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* ── VIRTUAL TOUR ── */}
      {tab === 'virtual' && (
        <Card title="360° Virtual Tour Panorama URLs">
          <p className="mb-4 text-xs text-gray-500 dark:text-gray-400">
            Replace with equirectangular panorama images from a Ricoh Theta, Insta360, or Panotour Pro export. Must be publicly accessible URLs (2:1 aspect ratio).
          </p>
          <div className="space-y-4">
            {([
              ['campus',     '🏫 Campus Entrance'],
              ['classrooms', '🖥️ Smart Classrooms'],
              ['library',    '📚 Digital Library'],
              ['music',      '🎹 Music Studio'],
              ['sports',     '🏟️ Sports Complex'],
            ] as [keyof typeof virtualTour, string][]).map(([key, label]) => (
              <div key={key}>
                <label className={LABEL}>{label}</label>
                <input className={INP} value={virtualTour[key]} onChange={e => setVirtualTour({ ...virtualTour, [key]: e.target.value })} />
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  )
}
