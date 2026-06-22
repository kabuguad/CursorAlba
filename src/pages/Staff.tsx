import { StaffDirectory } from '../components/staff/StaffDirectory'
import { PageHero } from '../components/layout/PageHero'

export function Staff() {
  return (
    <div className="overflow-hidden">
      <PageHero
        title="Our Faculty"
        subtitle="120+ world-class educators across every department — dedicated to developing every learner at Alber School."
        badge="Faculty & Staff"
        image="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80"
        variant="cinematic"
        overlay="green"
      />
      <StaffDirectory />
    </div>
  )
}
