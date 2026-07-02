import { BookMarked } from 'lucide-react'

export function TeacherLessonPlans() {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-3 mb-2">
        <BookMarked className="h-6 w-6 text-[#E8B84B]" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Lesson Plans</h1>
      </div>
      <p className="text-gray-500 dark:text-gray-400">Lesson plan management coming soon.</p>
    </div>
  )
}
