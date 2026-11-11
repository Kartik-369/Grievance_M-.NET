import React, { useState } from 'react'
import { X, UserPlus, Loader2 } from 'lucide-react'

export default function AssignModal({
  isOpen,
  onClose,
  grievanceId,
  assignees = [],
  onAssign,
}) {
  const [selectedUser, setSelectedUser] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedUser) {
      setError('Please select an assignee')
      return
    }

    setLoading(true)
    setError('')
    try {
      await onAssign(Number(selectedUser))
      onClose()
    } catch (err) {
      setError(err.message || 'Failed to assign grievance')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <UserPlus size={18} className="text-blue-600" />
            <h3 className="font-semibold text-slate-900 text-sm">Assign Grievance #{grievanceId}</h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-600 uppercase tracking-wide mb-1.5">
              Select Assignee (Staff / Admin)
            </label>
            <select
              value={selectedUser}
              onChange={(e) => {
                setSelectedUser(e.target.value)
                setError('')
              }}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
            >
              <option value="">-- Choose member --</option>
              {assignees.map((a) => (
                <option key={a.userId || a.id} value={a.userId || a.id}>
                  {a.firstName ? `${a.firstName} ${a.lastName}` : a.name} ({a.email || 'Admin'})
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded bg-red-50 text-red-600 text-xs border border-red-200">
              {error}
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-3.5 py-1.5 border border-slate-300 rounded-md text-xs font-medium text-slate-700 hover:bg-slate-50 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-70"
            >
              {loading ? (
                <>
                  <Loader2 size={13} className="animate-spin" /> Assigning...
                </>
              ) : (
                'Confirm Assignment'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
