import type { GalleryImage } from './types'

const CATEGORIES = ['Campus', 'Classrooms', 'Sports', 'Arts', 'Events', 'Students']
const SEEDS = [
  'alber-campus1', 'alber-class1', 'alber-sports1',
  'alber-arts1', 'alber-events1', 'alber-students1',
  'alber-campus2', 'alber-class2', 'alber-sports2',
  'alber-arts2', 'alber-events2', 'alber-students2',
]

export const galleryImages: GalleryImage[] = Array.from({ length: 40 }, (_, i) => ({
  id: `g-${i + 1}`,
  url: `https://picsum.photos/seed/${SEEDS[i % SEEDS.length]}-${i}/800/600`,
  category: CATEGORIES[i % CATEGORIES.length],
  title: `Demo School ${CATEGORIES[i % CATEGORIES.length]} ${i + 1}`,
}))
