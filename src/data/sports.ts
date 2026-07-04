import type { SportFixture } from './types'

export const fixtures: SportFixture[] = [
  { id: 'f1', sport: 'Football', opponent: 'St. Annes Academy', date: '2026-03-20', venue: 'Home', result: '3-1', status: 'completed' },
  { id: 'f2', sport: 'Rugby', opponent: 'Alliance High', date: '2026-03-25', venue: 'Away', result: '—', status: 'upcoming' },
  { id: 'f3', sport: 'Swimming', opponent: 'County Championships', date: '2026-03-22', venue: 'Aquatic Centre', result: 'Live', status: 'live' },
  { id: 'f4', sport: 'Basketball', opponent: 'Green Valley School', date: '2026-04-02', venue: 'Home', result: '—', status: 'upcoming' },
  { id: 'f5', sport: 'Athletics', opponent: 'Regional Meet', date: '2026-03-15', venue: 'Sports Complex', result: '12 Gold', status: 'completed' },
  { id: 'f6', sport: 'Tennis', opponent: 'Hillcrest Prep', date: '2026-04-10', venue: 'Away', result: '—', status: 'upcoming' },
]

export const playerOfMonth = {
  name: 'Brian Mutua',
  sport: 'Football',
  class: 'Form 3 Ruby',
  image: '/images/avatar-12.jpg',
  stats: '14 goals · 8 assists · Captain',
}
