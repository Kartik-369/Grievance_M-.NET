// Shared data used across multiple pages

export const CATEGORIES = [
  { id: 1, name: 'Academic', css: 'badge-inprogress' },
  { id: 2, name: 'Internship and placement', css: 'badge-medium' },
  { id: 3, name: 'Fee & Finance', css: 'badge-high' },
  { id: 4, name: 'Hostel', css: 'badge-low' },
  { id: 5, name: 'Transport service', css: 'badge-pending' },
]

export const STATUSES = [
  { id: 1, name: 'Pending',     css: 'badge-pending' },
  { id: 2, name: 'In Progress', css: 'badge-inprogress' },
  { id: 3, name: 'Resolved',    css: 'badge-resolved' },
  { id: 4, name: 'Rejected',    css: 'badge-rejected' },
]

export const PRIORITIES = [
  { id: 1, name: 'Low',      css: 'badge-low' },
  { id: 2, name: 'Medium',   css: 'badge-medium' },
  { id: 3, name: 'High',     css: 'badge-high' },
  { id: 4, name: 'Critical', css: 'badge-critical' },
]

export const GRIEVANCES = [
  {
    id: 'GRV-001', categoryId: 1,
    title: 'Incorrect marks entered for Semester 4',
    description: 'My marks for Data Structures show 42 on the portal but I scored 68 in the exam.',
    statusId: 2, priorityId: 3, date: '2026-06-15',
    history: [
      { statusId: 1, remarks: 'Grievance submitted.', on: '2026-06-15 09:00' },
      { statusId: 2, remarks: 'Assigned to examination cell for verification.', on: '2026-06-16 10:30' },
    ],
  },
  {
    id: 'GRV-002', categoryId: 2,
    title: 'Hostel room AC not working since 3 days',
    description: 'AC in Room 204, Block B has stopped working. Extremely uncomfortable in summer.',
    statusId: 3, priorityId: 2, date: '2026-06-10',
    history: [
      { statusId: 1, remarks: 'Grievance submitted.', on: '2026-06-10 14:00' },
      { statusId: 2, remarks: 'Maintenance team dispatched.', on: '2026-06-11 09:00' },
      { statusId: 3, remarks: 'AC repaired and tested. Issue resolved.', on: '2026-06-13 17:00' },
    ],
  },
  {
    id: 'GRV-003', categoryId: 3,
    title: 'Scholarship amount not credited for June',
    description: 'My government scholarship for June has not been credited to my bank account.',
    statusId: 1, priorityId: 4, date: '2026-07-01',
    history: [
      { statusId: 1, remarks: 'Grievance submitted.', on: '2026-07-01 11:00' },
    ],
  },
  {
    id: 'GRV-004', categoryId: 5,
    title: 'Campus WiFi not accessible in Lab 3',
    description: 'The network "DU-Student" is unreachable in Computer Lab 3 during practical sessions.',
    statusId: 1, priorityId: 2, date: '2026-07-02',
    history: [
      { statusId: 1, remarks: 'Grievance submitted.', on: '2026-07-02 08:30' },
    ],
  },
  {
    id: 'GRV-005', categoryId: 4,
    title: 'Requested book not available for 2 months',
    description: 'Placed a request for "Clean Code by Robert Martin" 2 months ago. Still unavailable.',
    statusId: 4, priorityId: 1, date: '2026-05-20',
    history: [
      { statusId: 1, remarks: 'Grievance submitted.', on: '2026-05-20 12:00' },
      { statusId: 4, remarks: 'Book not in procurement budget for this year.', on: '2026-05-28 16:00' },
    ],
  },
]
