export const SUBJECTS = ['Mathematics', 'English', 'Science', 'Kiswahili', 'Social Studies', 'Creative Arts']

export const MY_CLASS = [
  { id: 1,  name: 'Amani Kariuki',    avg: 88, attendance: 94, status: 'Active'  },
  { id: 2,  name: 'Baraka Muthoni',   avg: 72, attendance: 88, status: 'Active'  },
  { id: 3,  name: 'Cherono Oduor',    avg: 91, attendance: 97, status: 'Active'  },
  { id: 4,  name: 'Daudi Wairimu',    avg: 65, attendance: 80, status: 'Active'  },
  { id: 5,  name: 'Eunice Kipchoge',  avg: 84, attendance: 92, status: 'Active'  },
  { id: 6,  name: 'Farida Nyambura',  avg: 79, attendance: 85, status: 'Active'  },
  { id: 7,  name: 'Gitonga Odhiambo', avg: 55, attendance: 70, status: 'At Risk' },
  { id: 8,  name: 'Hannah Wanjala',   avg: 93, attendance: 98, status: 'Active'  },
  { id: 9,  name: 'Ibrahim Mwenda',   avg: 76, attendance: 90, status: 'Active'  },
  { id: 10, name: 'Joyce Kamau',      avg: 88, attendance: 95, status: 'Active'  },
  { id: 11, name: 'Kelvin Ndirangu',  avg: 48, attendance: 65, status: 'At Risk' },
  { id: 12, name: 'Lydia Otieno',     avg: 82, attendance: 93, status: 'Active'  },
]

export const POSTED_ASSIGNMENTS = [
  { id: 1, title: 'Algebra Practice — Quadratic Equations',    subject: 'Mathematics',    class_: 'Grade 5 Gold', due: '2026-05-30', submitted: 10, total: 12 },
  { id: 2, title: 'Essay: "My Future Career"',                 subject: 'English',        class_: 'Grade 5 Gold', due: '2026-06-02', submitted: 7,  total: 12 },
  { id: 3, title: 'Lab Report — Photosynthesis Experiment',    subject: 'Science',        class_: 'Grade 5 Gold', due: '2026-05-28', submitted: 12, total: 12 },
  { id: 4, title: 'Map Reading Assignment — Kirinyaga County', subject: 'Social Studies', class_: 'Grade 5 Gold', due: '2026-06-05', submitted: 4,  total: 12 },
]

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const TIMETABLE: Record<string, { time: string; subject: string; class_: string; room: string }[]> = {
  Monday:    [
    { time: '7:30–8:30',   subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '9:00–10:00',  subject: 'Mathematics', class_: 'Grade 4 Ruby',  room: 'Room 09' },
    { time: '11:00–12:00', subject: 'Mathematics', class_: 'Grade 6 Jade',  room: 'Room 14' },
  ],
  Tuesday:   [
    { time: '7:30–8:30',   subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '10:00–11:00', subject: 'Mathematics', class_: 'Grade 7 Pearl', room: 'Room 18' },
  ],
  Wednesday: [
    { time: '10:00–11:00', subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '11:00–12:00', subject: 'Mathematics', class_: 'Grade 4 Ruby',  room: 'Room 09' },
    { time: '13:00–14:00', subject: 'Mathematics', class_: 'Grade 6 Jade',  room: 'Room 14' },
  ],
  Thursday:  [
    { time: '13:00–14:00', subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '14:00–15:00', subject: 'Mathematics', class_: 'Grade 7 Pearl', room: 'Room 18' },
  ],
  Friday:    [
    { time: '13:00–14:00', subject: 'Mathematics', class_: 'Grade 5 Gold',  room: 'Room 12' },
    { time: '14:00–15:00', subject: 'Mathematics', class_: 'Grade 6 Jade',  room: 'Room 14' },
  ],
}

export const MESSAGES = [
  { id: 1, parent: 'Grace Njeri',    student: 'Amani Kariuki',    time: '09:14', date: '2026-05-27', text: "Good morning. I wanted to check on Amani's progress in Mathematics this term.", read: false },
  { id: 2, parent: 'Peter Muthoni',  student: 'Baraka Muthoni',   time: '08:30', date: '2026-05-26', text: 'Baraka was unwell last week. Please update his attendance accordingly.',            read: true  },
  { id: 3, parent: 'Susan Kipchoge', student: 'Eunice Kipchoge',  time: '15:45', date: '2026-05-25', text: 'Thank you for the positive report on Eunice. She is very motivated this term!',    read: true  },
  { id: 4, parent: 'John Odhiambo',  student: 'Gitonga Odhiambo', time: '07:55', date: '2026-05-24', text: "I am concerned about Gitonga's recent grades. Can we schedule a meeting?",         read: false },
]

export function gradeColor(s: number) {
  if (s >= 80) return 'text-green-600 dark:text-green-400'
  if (s >= 60) return 'text-blue-600 dark:text-blue-400'
  if (s >= 40) return 'text-yellow-600 dark:text-yellow-500'
  return 'text-red-600 dark:text-red-400'
}
