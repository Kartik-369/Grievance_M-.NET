import React from 'react'

const DEFAULT_STATUS_MAP = {
  1: { label: 'Pending', bg: 'bg-amber-100 text-amber-800 border-amber-200' },
  2: { label: 'Under Review', bg: 'bg-blue-100 text-blue-800 border-blue-200' },
  3: { label: 'Complete', bg: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  4: { label: 'Rejected', bg: 'bg-rose-100 text-rose-800 border-rose-200' },
}

export function StatusBadge({ statusId, statusName, customClass = '' }) {
  const meta = DEFAULT_STATUS_MAP[statusId] || {
    label: statusName || `Status ${statusId}`,
    bg: 'bg-slate-100 text-slate-700 border-slate-200',
  }
  const label = statusName || meta.label
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${meta.bg} ${customClass}`}>
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70" />
      {label}
    </span>
  )
}
export default StatusBadge
