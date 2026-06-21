import { PagesManager } from './PagesManager'

export function SiteContentManager() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 min-h-0 overflow-y-auto">
        <PagesManager />
      </div>
    </div>
  )
}
