import React from 'react'
import { Link } from 'react-router-dom'
import { Calendar, ChevronRight, User, Trash2 } from 'lucide-react'
import { StatusBadge, PriorityBadge } from './GrievanceStatusBadge'

export default function GrievanceCard({
  grievance,
  isAdmin = false,
  onDelete = null,
}) {
  const id = grievance.id || `GRV-${grievance.grievanceId}`
  const rawId = grievance.grievanceId || grievance.id
  const title = grievance.title || 'Untitled Grievance'
  const description = grievance.description || ''
  const categoryName = grievance.categoryName || grievance.category || 'General'
  const dateStr = grievance.date || grievance.createdAt || new Date().toISOString().slice(0, 10)

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            {id}
          </span>
          <StatusBadge statusId={grievance.statusId} statusName={grievance.statusName} />
          <PriorityBadge priorityId={grievance.priorityId} priorityName={grievance.priorityName} />
          <span className="text-xs text-slate-500 font-medium bg-slate-50 border border-slate-100 px-2 py-0.5 rounded">
            {categoryName}
          </span>
        </div>

        {isAdmin && onDelete && (
          <button
            onClick={() => onDelete(rawId)}
            className="text-slate-400 hover:text-red-600 p-1 rounded transition-colors"
            title="Delete Grievance"
          >
            <Trash2 size={15} />
          </button>
        )}
      </div>

      <Link
        to={`/grievances/${rawId}`}
        className="block group"
      >
        <h3 className="text-sm font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 mb-1">
          {title}
        </h3>
        <p className="text-xs text-slate-500 line-clamp-2 mb-3">
          {description}
        </p>
      </Link>

      <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1">
            <Calendar size={13} /> {dateStr}
          </span>
          {grievance.raisedBy && (
            <span className="inline-flex items-center gap-1">
              <User size={13} /> User #{grievance.raisedBy}
            </span>
          )}
        </div>

        <Link
          to={`/grievances/${rawId}`}
          className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium"
        >
          Details <ChevronRight size={13} />
        </Link>
      </div>
    </div>
  )
}
