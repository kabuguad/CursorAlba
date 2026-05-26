import type { Department, Teacher } from './types'

const FIRST = [
  'Amina', 'Brian', 'Catherine', 'David', 'Esther', 'Francis', 'Grace', 'Henry',
  'Irene', 'James', 'Kevin', 'Lucy', 'Michael', 'Nancy', 'Oscar', 'Patricia',
  'Quincy', 'Ruth', 'Samuel', 'Teresa', 'Victor', 'Wanjiku', 'Xavier', 'Yvonne', 'Zachary',
]
const LAST = [
  'Kamau', 'Ochieng', 'Wanjiru', 'Mutua', 'Njeri', 'Omondi', 'Mwangi', 'Kariuki',
  'Wambui', 'Otieno', 'Akinyi', 'Kimani', 'Achieng', 'Njoroge', 'Maina', 'Chebet',
]
const TITLES = [
  'Head of Department', 'Senior Teacher', 'Subject Lead', 'Coordinator',
  'Specialist Instructor', 'Academic Mentor', 'Curriculum Developer',
]
const DEPTS: Department[] = ['Sciences', 'Humanities', 'Languages', 'Music', 'Drama', 'Sports']
const CREDENTIALS = [
  'B.Ed (University of Nairobi)', 'M.Ed (Kenyatta University)', 'PGDE',
  'TSC Registered', 'CBC Certified', 'IGCSE Trained', 'First Aid Certified',
]
const QUALS = [
  '15+ years teaching experience', 'Published curriculum author',
  'National exam marker', 'Award-winning educator', 'STEM innovation lead',
  'Arts festival judge', 'Sports coaching license',
]

function seededRandom(seed: number) {
  const x = Math.sin(seed) * 10000
  return x - Math.floor(x)
}

export const teachers: Teacher[] = Array.from({ length: 125 }, (_, i) => {
  const first = FIRST[i % FIRST.length]
  const last = LAST[Math.floor(i / FIRST.length) % LAST.length]
  const suffix = i > 24 ? ` ${String.fromCharCode(65 + (i % 26))}` : ''
  const dept = DEPTS[i % DEPTS.length]
  const name = `${first} ${last}${suffix}`
  const imgSeed = 100 + i

  return {
    id: `t-${i + 1}`,
    name,
    title: TITLES[i % TITLES.length],
    department: dept,
    image: `https://images.unsplash.com/photo-${1500000000000 + imgSeed * 7919}?w=400&h=500&fit=crop&auto=format`,
    bio: `${name} brings exceptional dedication to ${dept} at Alber School. Known for innovative pedagogy and student-centered learning, they have shaped countless young minds in Kutus and beyond.`,
    credentials: [
      CREDENTIALS[i % CREDENTIALS.length],
      CREDENTIALS[(i + 2) % CREDENTIALS.length],
    ],
    qualifications: [
      QUALS[i % QUALS.length],
      QUALS[(i + 3) % QUALS.length],
      `${Math.floor(seededRandom(i) * 15) + 5}+ years at Alber School`,
    ],
  }
})

teachers.forEach((t, i) => {
  t.image = `https://i.pravatar.cc/400?img=${(i % 70) + 1}`
})

export const departments: Department[] = DEPTS
