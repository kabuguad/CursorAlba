import type { GalleryImage } from './types'

const CATEGORIES = ['Campus', 'Classrooms', 'Sports', 'Arts', 'Events', 'Students']
const UNSPLASH = [
  '1523050854898-fb9d7d4f9c0e', '1523240795612-9a054b0db644', '1509062522716-5315f0c8d5f0',
  '1541339907198-e08756dedfbf', '1580582938317-6572b825d3f9', '1524178232363-1fb2b075b655',
  '1497633762263-9fc9e4a76534', '1523050854898-fb9d7d4f9c0e', '1562774053-701939374585',
  '1517486808906-6ca8b5f9f4b4', '1503676260728-1c51daae3ac1', '1522202176988-66273c2fd55f',
]

export const galleryImages: GalleryImage[] = Array.from({ length: 40 }, (_, i) => ({
  id: `g-${i + 1}`,
  url: `https://images.unsplash.com/photo-${UNSPLASH[i % UNSPLASH.length]}?w=800&h=600&fit=crop&auto=format`,
  category: CATEGORIES[i % CATEGORIES.length],
  title: `Alber School ${CATEGORIES[i % CATEGORIES.length]} ${i + 1}`,
}))
