import { GlassCard } from '../../../components/ui/GlassCard'
import { Bus, Phone, Clock, MapPin, AlertCircle, CheckCircle2, User } from 'lucide-react'

const ROUTE_STOPS = [
  { stop: 'Kerugoya Bus Stage',      pickup: '6:00 AM',  dropoff: '5:15 PM', distance: '12 km' },
  { stop: 'Kutus Market Junction',   pickup: '6:20 AM',  dropoff: '5:00 PM', distance: '8 km'  },
  { stop: 'Kiamutugu Centre',        pickup: '6:35 AM',  dropoff: '4:48 PM', distance: '5 km'  },
  { stop: 'Sagana Road Turnoff',     pickup: '6:45 AM',  dropoff: '4:40 PM', distance: '3 km'  },
  { stop: 'Alber School Main Gate',  pickup: '7:10 AM',  dropoff: '4:20 PM', distance: '0 km'  },
]

const STUDENT_STOP = 'Kutus Market Junction'

const CONTACTS = [
  { name: 'Mr. Peter Muriuki',  role: 'Bus Driver — Route B',       phone: '0722-456-789', avatar: 'PM' },
  { name: 'Ms. Alice Njoroge',  role: 'Transport Coordinator',       phone: '0733-987-654', avatar: 'AN' },
  { name: 'School Office',      role: 'General Transport Enquiries', phone: '0712-345-678', avatar: 'SO' },
]

const RULES = [
  'Students must be at the pick-up stop 5 minutes before the scheduled time.',
  'The bus will not wait more than 2 minutes at any stop.',
  'Students must remain seated and wear seatbelts at all times.',
  'No eating or drinking on the bus.',
  'Any change to pick-up/drop-off arrangements must be communicated to the transport coordinator by 8:00 AM on that day.',
  'Parents must inform the school if their child will not be using the bus on a particular day.',
  'Lost property left on the bus should be reported to the transport office.',
]

const NOTICES = [
  { id: 1, text: 'Route B pick-up times have been adjusted by 5 minutes from 27 May 2026 due to road works on Sagana Road. Please plan accordingly.', date: '25 May 2026', type: 'warning' },
  { id: 2, text: 'The bus will not operate on 20 June 2026 (Madaraka Day — public holiday). Normal service resumes 23 June.', date: '10 May 2026', type: 'info' },
]

export function ParentTransport() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 space-y-6">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Transport & Bus Route</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Amani Kariuki · Route B — Kerugoya–Kutus–Alber School</p>
      </div>

      {/* Notices */}
      {NOTICES.map(n => (
        <div
          key={n.id}
          className={`flex items-start gap-3 rounded-xl border px-4 py-3 ${
            n.type === 'warning'
              ? 'border-yellow-200 dark:border-yellow-800 bg-yellow-50 dark:bg-yellow-900/20'
              : 'border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20'
          }`}
        >
          <AlertCircle className={`h-4 w-4 mt-0.5 shrink-0 ${n.type === 'warning' ? 'text-yellow-500' : 'text-blue-500'}`} />
          <div>
            <p className={`text-sm ${n.type === 'warning' ? 'text-yellow-700 dark:text-yellow-300' : 'text-blue-700 dark:text-blue-300'}`}>
              {n.text}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">{n.date}</p>
          </div>
        </div>
      ))}

      {/* Bus info card */}
      <GlassCard className="p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Bus className="h-4 w-4 text-gray-400" />
          Route B — Bus Details
        </h2>
        <div className="grid sm:grid-cols-3 gap-4">
          {[
            { label: 'Bus Number',     value: 'KDX 482M' },
            { label: 'Route',          value: 'Kerugoya → Alber School' },
            { label: 'Capacity',       value: '33 students' },
            { label: 'Morning Depart', value: '6:00 AM from Kerugoya' },
            { label: 'School Arrival', value: '7:10 AM (latest)' },
            { label: 'School Depart',  value: '4:20 PM daily' },
          ].map(item => (
            <div key={item.label} className="rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-wide text-gray-400 mb-0.5">{item.label}</p>
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{item.value}</p>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Route stops */}
      <GlassCard className="p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-gray-400" />
          Pick-up & Drop-off Schedule
        </h2>
        <div className="space-y-2">
          {ROUTE_STOPS.map((stop, i) => {
            const isStudentStop = stop.stop === STUDENT_STOP
            const isSchool = i === ROUTE_STOPS.length - 1
            return (
              <div
                key={stop.stop}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 ${
                  isStudentStop
                    ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                    : isSchool
                    ? 'bg-[#E8B84B]/8 border border-[#E8B84B]/20'
                    : 'bg-gray-50 dark:bg-gray-800/50'
                }`}
              >
                {/* Timeline dot */}
                <div className="flex flex-col items-center shrink-0">
                  <div className={`h-2.5 w-2.5 rounded-full ${
                    isStudentStop ? 'bg-green-500' : isSchool ? 'bg-[#E8B84B]' : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{stop.stop}</p>
                    {isStudentStop && (
                      <span className="text-[10px] font-bold text-green-700 dark:text-green-400 bg-green-100 dark:bg-green-900/40 px-2 py-0.5 rounded-full">
                        Amani's Stop
                      </span>
                    )}
                    {isSchool && (
                      <span className="text-[10px] font-bold text-[#E8B84B] bg-[#E8B84B]/10 px-2 py-0.5 rounded-full">
                        School
                      </span>
                    )}
                  </div>
                  {!isSchool && <p className="text-xs text-gray-400 mt-0.5">{stop.distance} from school</p>}
                </div>

                <div className="flex gap-4 text-xs text-gray-500 dark:text-gray-400 shrink-0">
                  <div className="text-center">
                    <p className="font-mono font-semibold text-gray-700 dark:text-gray-300">{stop.pickup}</p>
                    <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> Pick-up
                    </p>
                  </div>
                  {!isSchool && (
                    <div className="text-center">
                      <p className="font-mono font-semibold text-gray-700 dark:text-gray-300">{stop.dropoff}</p>
                      <p className="text-[10px] text-gray-400 flex items-center gap-0.5">
                        <Clock className="h-2.5 w-2.5" /> Drop-off
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </GlassCard>

      {/* Contacts */}
      <GlassCard className="p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <Phone className="h-4 w-4 text-gray-400" />
          Transport Contacts
        </h2>
        <div className="space-y-3">
          {CONTACTS.map(c => (
            <div key={c.name} className="flex items-center gap-3 rounded-xl bg-gray-50 dark:bg-gray-800 px-4 py-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8B84B] text-[11px] font-bold text-[#0d1b0d]">
                {c.avatar}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 dark:text-gray-200">{c.name}</p>
                <p className="text-xs text-gray-400">{c.role}</p>
              </div>
              <a
                href={`tel:${c.phone.replace(/-/g, '')}`}
                className="flex items-center gap-1.5 text-sm font-semibold text-green-700 dark:text-green-400 hover:underline"
              >
                <Phone className="h-3.5 w-3.5" />
                {c.phone}
              </a>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Rules */}
      <GlassCard className="p-6">
        <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
          <User className="h-4 w-4 text-gray-400" />
          Transport Rules & Guidelines
        </h2>
        <ul className="space-y-2">
          {RULES.map((rule, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-green-500 mt-0.5" />
              {rule}
            </li>
          ))}
        </ul>
      </GlassCard>

    </div>
  )
}
