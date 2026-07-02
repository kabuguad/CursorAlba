import { Users } from 'lucide-react'

export function ParentMeetings() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-2">
        <Users className="h-6 w-6 text-[#E8B84B]" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Meetings</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400">Parent-teacher meetings coming soon.</p>
    </div>
  )
}
