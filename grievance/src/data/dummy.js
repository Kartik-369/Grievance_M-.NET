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
    title: 'Incorrect marks',
    description: 'Marks entered wrongly.',
    statusId: 2, priorityId: 3, date: '2026-06-15',
    history: [
      { statusId: 1, remarks: 'Submitted.', on: '2026-06-15 09:00' },
      { statusId: 2, remarks: 'Checking.', on: '2026-06-16 10:30' },
    ],
  },
  {
    id: 'GRV-002', categoryId: 2,
    title: 'No company info',
    description: 'TCS details not shared.',
    statusId: 3, priorityId: 2, date: '2026-06-10',
    history: [
      { statusId: 1, remarks: 'Submitted.', on: '2026-06-10 14:00' },
      { statusId: 3, remarks: 'Resolved.', on: '2026-06-13 17:00' },
    ],
  },
  {
    id: 'GRV-003', categoryId: 3,
    title: 'Scholarship not given',
    description: 'not credited to account.',
    statusId: 1, priorityId: 4, date: '2026-07-01',
    history: [
      { statusId: 1, remarks: 'Grievance submitted.', on: '2026-07-01 11:00' },
    ],
  },
  {
    id: 'GRV-004', categoryId: 4,
    title: 'AC not working',
    description: 'Room 204 AC dead.',
    statusId: 1, priorityId: 2, date: '2026-07-02',
    history: [
      { statusId: 1, remarks: 'Submitted.', on: '2026-07-02 08:30' },
    ],
  },
  {
    id: 'GRV-005', categoryId: 5,
    title: 'Bus late',
    description: 'Route 4 bus always late.',
    statusId: 4, priorityId: 1, date: '2026-05-20',
    history: [
      { statusId: 1, remarks: 'Submitted.', on: '2026-05-20 12:00' },
      { statusId: 4, remarks: 'Traffic issue, rejected.', on: '2026-05-28 16:00' },
    ],
  },
]
