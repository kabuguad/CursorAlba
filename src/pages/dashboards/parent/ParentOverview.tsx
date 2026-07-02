import { LayoutDashboard } from 'lucide-react'

export function ParentOverview() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-2">
        <LayoutDashboard className="h-6 w-6 text-[#E8B84B]" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400">Welcome to your parent portal. This page is coming soon.</p>
    </div>
  )
}
