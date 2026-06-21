import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { PagesManager } from './PagesManager'
import { WhyChooseUsManager } from './WhyChooseUsManager'
import { ProgramsManager } from './ProgramsManager'
import { AboutContentManager } from './AboutContentManager'
import { CoreValuesManager } from './CoreValuesManager'
import { HistoryMilestonesManager } from './HistoryMilestonesManager'
import { AboutApiDiagnostic } from './AboutApiDiagnostic'
import { Globe, ThumbsUp, GraduationCap, Info, Star, Clock, FlaskConical } from 'lucide-react'

const TABS = [
  { id: 'blocks',      label: 'Page Blocks',          icon: Globe,          desc: 'Edit text, images and lists across public pages' },
  { id: 'why-us',     label: 'Why Choose Us',         icon: ThumbsUp,       desc: 'Manage the Alber Difference cards shown on the website' },
  { id: 'programmes', label: 'Academic Programmes',   icon: GraduationCap,  desc: 'Manage school programme levels and descriptions' },
  { id: 'about',      label: 'About Content',         icon: Info,           desc: 'Headline, mission, vision and history intro for the About page' },
  { id: 'values',     label: 'Core Values',           icon: Star,           desc: 'Manage core values shown on the About page' },
  { id: 'history',    label: 'History Milestones',    icon: Clock,          desc: 'Manage the school history timeline on the About page' },
  { id: 'diagnostic', label: 'API Diagnostics',       icon: FlaskConical,   desc: 'Test read and write operations against the About API' },
] as const

type TabId = typeof TABS[number]['id']

export function SiteContentManager() {
  const [tab, setTab] = useState<TabId>('blocks')

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 pt-4">
        <div className="mb-3">
          <h1 className="text-lg font-bold text-gray-900 dark:text-white">Site Content</h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Manage all public-facing page content from one place.
          </p>
        </div>
        <nav className="flex gap-0.5 -mb-px overflow-x-auto scrollbar-none">
          {TABS.map(t => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap shrink-0',
                tab === t.id
                  ? 'border-[#E8B84B] text-[#E8B84B]'
                  : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-600',
              )}
            >
              <t.icon className="h-3.5 w-3.5 shrink-0" />
              {t.label}
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto">
        {tab === 'blocks'      && <PagesManager />}
        {tab === 'why-us'      && <WhyChooseUsManager />}
        {tab === 'programmes'  && <ProgramsManager />}
        {tab === 'about'       && <AboutContentManager />}
        {tab === 'values'      && <CoreValuesManager />}
        {tab === 'history'     && <HistoryMilestonesManager />}
        {tab === 'diagnostic'  && <AboutApiDiagnostic />}
      </div>
    </div>
  )
}
