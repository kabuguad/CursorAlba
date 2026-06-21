import { useState } from 'react'
import { cn } from '../../../lib/utils'
import { PagesManager } from './PagesManager'
import { WhyChooseUsManager } from './WhyChooseUsManager'
import { ProgramsManager } from './ProgramsManager'
import { Globe, ThumbsUp, GraduationCap } from 'lucide-react'

const TABS = [
  { id: 'blocks',      label: 'Page Blocks',          icon: Globe,          desc: 'Edit text, images and lists across public pages' },
  { id: 'why-us',     label: 'Why Choose Us',         icon: ThumbsUp,       desc: 'Manage the Alber Difference cards shown on the website' },
  { id: 'programmes', label: 'Academic Programmes',   icon: GraduationCap,  desc: 'Manage school programme levels and descriptions' },
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
      </div>
    </div>
  )
}
