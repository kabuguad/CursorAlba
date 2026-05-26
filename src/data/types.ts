export type Department =
  | 'Sciences'
  | 'Humanities'
  | 'Languages'
  | 'Music'
  | 'Drama'
  | 'Sports'

export interface Teacher {
  id: string
  name: string
  title: string
  department: Department
  image: string
  bio: string
  credentials: string[]
  qualifications: string[]
}

export interface SchoolEvent {
  id: string
  title: string
  date: string
  location: string
  description: string
  isPast: boolean
}

export interface GalleryImage {
  id: string
  url: string
  category: string
  title: string
}

export interface BlogPost {
  id: string
  title: string
  excerpt: string
  content: string
  image: string
  author: string
  date: string
  category: string
}

export interface Student {
  id: string
  name: string
  grade: string
  className: string
}

export interface SportFixture {
  id: string
  sport: string
  opponent: string
  date: string
  venue: string
  result: string
  status: 'upcoming' | 'live' | 'completed'
}
