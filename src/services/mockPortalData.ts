/**
 * Demo / Fallback Portal Data
 * ───────────────────────────
 * Used when the ASP.NET Core backend is unreachable (ECONNREFUSED / Network Error).
 * Replace each function with a real API call once the backend is ready.
 * All shapes match exactly what the real API mappers produce so the UI
 * receives identical objects in both modes.
 */

// ── Announcements ─────────────────────────────────────────────────────────────

export const MOCK_ANNOUNCEMENTS = [
  {
    id: 'ann-1',
    title: 'End-Term Examinations — 23–27 June 2026',
    body: 'End-term examinations for all classes will be held from Monday 23 June to Friday 27 June 2026. Students should arrive by 7:15 AM each day. No late entry after 7:30 AM. Please ensure all revision is completed by Friday 20 June.',
    priority: 'urgent' as const,
    publishAt: '2026-06-10',
    targetRoles: ['student'],
  },
  {
    id: 'ann-2',
    title: 'Outstanding Fee Balances — Action Required',
    body: 'Families with outstanding Term 2 fee balances are requested to clear by 20 June 2026 to avoid disruption of learning. M-Pesa Paybill: 400200, Account: Admission Number. Contact the bursar\'s office for payment plans.',
    priority: 'high' as const,
    publishAt: '2026-06-08',
    targetRoles: ['student'],
  },
  {
    id: 'ann-3',
    title: 'Sports Day Rescheduled to Saturday 5 July 2026',
    body: 'The Annual Sports Day originally planned for 28 June has been moved to Saturday 5 July 2026 to avoid clash with end-term exams. All students are encouraged to participate.',
    priority: 'high' as const,
    publishAt: '2026-06-05',
    targetRoles: ['student'],
  },
  {
    id: 'ann-4',
    title: 'Term 2 Report Cards — 12 July 2026',
    body: 'Term 2 report cards will be issued on Saturday 12 July 2026. Check the portal for your grade summary once released.',
    priority: 'normal' as const,
    publishAt: '2026-06-01',
    targetRoles: ['student'],
  },
]
