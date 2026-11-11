import React, { useState } from 'react'
import { X, UserPlus } from 'lucide-react'

export default function AssignModal({ isOpen, onClose, grievanceId, assignees = [], onAssign }) {
  if (!isOpen) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <div className="flex justify-between mb-4">
          <h3 className="font-semibold text-sm">Assign Grievance #{grievanceId}</h3>
          <button onClick={onClose}><X size={16} /></button>
        </div>
      </div>
    </div>
  )
}
