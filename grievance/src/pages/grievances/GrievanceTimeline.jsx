import React from 'react'
import { Clock, CheckCircle2, AlertCircle, MessageSquare } from 'lucide-react'
import { StatusBadge } from './GrievanceStatusBadge'

export default function GrievanceTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return (
      <div className="text-center py-6 text-xs text-slate-400 bg-slate-50 rounded-lg border border-slate-200">
        No status update history recorded yet.
      </div>
    )
  }

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
      {history.map((entry, idx) => {
        const key = entry.statusHistoryId || entry.id || idx
        const dateStr = entry.updatedOn || entry.on || 'Recent'
        const remarks = entry.remarks || 'No additional remarks provided.'
        const statusId = entry.status || entry.statusId
        const statusName = entry.statusName

        return (
          <div key={key} className="relative group">
            {/* Timeline marker */}
            <div className="absolute -left-6 top-1 w-4 h-4 rounded-full bg-white border-2 border-blue-600 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs hover:border-slate-300 transition-all">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                <StatusBadge statusId={statusId} statusName={statusName} />
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Clock size={11} /> {dateStr}
                </span>
              </div>

              <p className="text-xs text-slate-700 flex items-start gap-1.5">
                <MessageSquare size={13} className="text-slate-400 shrink-0 mt-0.5" />
                <span>{remarks}</span>
              </p>

              {entry.updatedBy && (
                <div className="mt-2 pt-1.5 border-t border-slate-100 text-[11px] text-slate-400">
                  Updated by User #{entry.updatedBy}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
