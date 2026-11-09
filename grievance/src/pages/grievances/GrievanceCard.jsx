import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight } from 'lucide-react'

export default function GrievanceCard({ grievance }) {
  const id = grievance.id || `GRV-${grievance.grievanceId}`
  const rawId = grievance.grievanceId || grievance.id
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm">
      <div className="font-mono text-xs font-semibold text-slate-500 mb-2">{id}</div>
      <Link to={`/grievances/${rawId}`} className="block font-semibold text-slate-900 mb-1">{grievance.title}</Link>
      <p className="text-xs text-slate-500 line-clamp-2">{grievance.description}</p>
    </div>
  )
}
