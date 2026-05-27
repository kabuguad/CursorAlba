export const GRADES = [
  { subject: 'Mathematics',    score: 88, grade: 'A'  },
  { subject: 'English',        score: 92, grade: 'A'  },
  { subject: 'Science',        score: 85, grade: 'A-' },
  { subject: 'Kiswahili',      score: 90, grade: 'A'  },
  { subject: 'Social Studies', score: 78, grade: 'B+' },
  { subject: 'Creative Arts',  score: 94, grade: 'A'  },
  { subject: 'CRE',            score: 82, grade: 'A-' },
  { subject: 'PE',             score: 96, grade: 'A'  },
]

export const HOMEWORK = [
  { id: 1, subject: 'Mathematics',    title: 'Algebra Practice — Quadratic Equations',    due: '2026-05-30', status: 'pending',   teacher: 'Mr. Ochieng'  },
  { id: 2, subject: 'English',        title: 'Essay: "My Future Career"',                 due: '2026-06-02', status: 'pending',   teacher: 'Mrs. Wanjiku' },
  { id: 3, subject: 'Science',        title: 'Lab Report — Photosynthesis Experiment',    due: '2026-05-28', status: 'submitted', teacher: 'Mr. Kamau'    },
  { id: 4, subject: 'Kiswahili',      title: 'Insha: Mazingira ya Shule',                 due: '2026-05-25', status: 'graded',    teacher: 'Ms. Akinyi'   },
  { id: 5, subject: 'Social Studies', title: 'Map Reading Assignment — Kirinyaga County', due: '2026-06-05', status: 'pending',   teacher: 'Mr. Njoroge'  },
  { id: 6, subject: 'Creative Arts',  title: 'Portfolio: 3 Original Sketches',            due: '2026-06-10', status: 'pending',   teacher: 'Ms. Chebet'   },
]

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']

export const TIMETABLE: Record<string, { time: string; subject: string; teacher: string; room: string }[]> = {
  Monday:    [
    { time: '7:30–8:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
    { time: '8:30–9:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '10:00–11:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'      },
    { time: '11:00–12:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05'    },
    { time: '13:00–14:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'      },
  ],
  Tuesday:   [
    { time: '7:30–8:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10'    },
    { time: '8:30–9:30',   subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
    { time: '10:00–11:00', subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio' },
    { time: '11:00–12:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '13:00–14:00', subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03'    },
  ],
  Wednesday: [
    { time: '7:30–8:30',   subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'      },
    { time: '8:30–9:30',   subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05'    },
    { time: '10:00–11:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
    { time: '11:00–12:00', subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10'    },
    { time: '13:00–14:00', subject: 'Music',          teacher: 'Ms. Waweru',   room: 'Music Room' },
  ],
  Thursday:  [
    { time: '7:30–8:30',   subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '8:30–9:30',   subject: 'CRE',            teacher: 'Mr. Gitonga',  room: 'Room 03'    },
    { time: '10:00–11:00', subject: 'Kiswahili',      teacher: 'Ms. Akinyi',   room: 'Room 05'    },
    { time: '11:00–12:00', subject: 'Science',        teacher: 'Mr. Kamau',    room: 'Lab 2'      },
    { time: '13:00–14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
  ],
  Friday:    [
    { time: '7:30–8:30',   subject: 'Creative Arts',  teacher: 'Ms. Chebet',   room: 'Art Studio' },
    { time: '8:30–9:30',   subject: 'Social Studies', teacher: 'Mr. Njoroge',  room: 'Room 10'    },
    { time: '10:00–11:00', subject: 'English',        teacher: 'Mrs. Wanjiku', room: 'Room 08'    },
    { time: '11:00–12:00', subject: 'PE',             teacher: 'Mr. Mutua',    room: 'Field'      },
    { time: '13:00–14:00', subject: 'Mathematics',    teacher: 'Mr. Ochieng',  room: 'Room 12'    },
  ],
}

export const ANNOUNCEMENTS = [
  { id: 1, title: 'Term 2 Examination Timetable Released',        date: '2026-05-26', category: 'Academic',      body: 'The Term 2 examination timetable has been released. Exams begin 27 July 2026. Please collect your admit card from the office.' },
  { id: 2, title: 'Drama Festival Rehearsals — All Cast Members', date: '2026-05-24', category: 'Co-curricular', body: 'All students selected for the Inter-School Drama Festival must attend rehearsals every Wednesday 4–6 PM in the Theatre Studio.' },
  { id: 3, title: 'School Fees Reminder — Term 2',                date: '2026-05-20', category: 'Finance',       body: 'Term 2 fees are due by 15 June 2026. Parents are reminded to clear any pending balances to avoid disruption of studies.' },
  { id: 4, title: 'Sports Day — Inter-House Championships',       date: '2026-05-18', category: 'Sports',        body: 'Annual inter-house athletics will be held on 15 June at the Sports Complex. All students are required to participate in at least one event.' },
  { id: 5, title: 'Library Book Return Deadline',                 date: '2026-05-15', category: 'General',       body: 'All borrowed library books must be returned by 30 May 2026. Fines of KES 10 per day will apply for late returns.' },
]

export const STATUS_STYLES: Record<string, string> = {
  pending:   'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  graded:    'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
}

export const CAT_STYLES: Record<string, string> = {
  Academic:        'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'Co-curricular': 'bg-purple-50 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  Finance:         'bg-yellow-50 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400',
  Sports:          'bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  General:         'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400',
}

export function gradeColor(s: number) {
  if (s >= 80) return 'text-green-600 dark:text-green-400'
  if (s >= 60) return 'text-blue-600 dark:text-blue-400'
  if (s >= 40) return 'text-yellow-600 dark:text-yellow-500'
  return 'text-red-600 dark:text-red-400'
}
