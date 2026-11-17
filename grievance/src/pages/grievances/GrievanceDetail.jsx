import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Check,
  Loader2,
  Calendar,
  User,
  UserCheck,
  Send,
  AlertCircle,
  Clock,
  Printer,
  Sparkles,
} from 'lucide-react'
import {
  fetchGrievanceById,
  fetchGrievanceHistory,
  addGrievanceHistory,
  fetchGrievanceAssignments,
  assignGrievance,
  fetchAdminUsers,
  fetchStatuses,
} from './grievanceApi'
import { StatusBadge, PriorityBadge } from './GrievanceStatusBadge'
import GrievanceTimeline from './GrievanceTimeline'
import AssignModal from './AssignModal'

export default function GrievanceDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'Admin'

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [grievance, setGrievance] = useState(null)
  const [history, setHistory] = useState([])
  const [assignments, setAssignments] = useState([])
  const [assignees, setAssignees] = useState([])
  const [statuses, setStatuses] = useState([])

  // Admin status update form
  const [newStatus, setNewStatus] = useState('')
  const [remarks, setRemarks] = useState('')
  const [updatingStatus, setUpdatingStatus] = useState(false)
  const [statusSuccess, setStatusSuccess] = useState(false)

  // Assign modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false)

  const loadData = async () => {
    setLoading(true)
    setError('')
    try {
      const [g, hist, assign, users, stats] = await Promise.all([
        fetchGrievanceById(id),
        fetchGrievanceHistory(id),
        fetchGrievanceAssignments(id),
        fetchAdminUsers(),
        fetchStatuses(),
      ])
      setGrievance(g)
      setHistory(hist.length ? hist : g?.history || [])
      setAssignments(assign)
      setAssignees(users)
      setStatuses(stats)
    } catch (err) {
      console.error('Failed to load grievance detail:', err)
      setError('Could not load grievance details from backend.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [id])

  const handleStatusUpdate = async (e) => {
    e.preventDefault()
    if (!newStatus || !remarks.trim()) return

    setUpdatingStatus(true)
    try {
      const selectedStatusObj = statuses.find(
        (s) => String(s.id || s.statusID || s.statusId) === String(newStatus)
      )

      await addGrievanceHistory({
        grievanceId: grievance.grievanceId || id,
        status: Number(newStatus),
        remarks: remarks.trim(),
        updatedBy: user?.userId || 1,
      })

      // Optimistically push history and update grievance status
      const newEntry = {
        statusHistoryId: Date.now(),
        grievanceId: grievance.grievanceId || id,
        status: Number(newStatus),
        statusName: selectedStatusObj?.name || selectedStatusObj?.statusName || 'Updated',
        remarks: remarks.trim(),
        updatedBy: user?.userId || 1,
        updatedOn: new Date().toISOString().slice(0, 16).replace('T', ' '),
      }

      setHistory((prev) => [...prev, newEntry])
      setGrievance((prev) => ({
        ...prev,
        statusId: Number(newStatus),
        statusName: selectedStatusObj?.name || selectedStatusObj?.statusName,
      }))

      setRemarks('')
      setNewStatus('')
      setStatusSuccess(true)
      setTimeout(() => setStatusSuccess(false), 2500)
    } catch (err) {
      alert('Failed to update status: ' + err.message)
    } finally {
      setUpdatingStatus(false)
    }
  }

  const handleAssignConfirm = async (assignedToUserId) => {
    await assignGrievance({
      grievanceId: grievance.grievanceId || id,
      assignedTo: assignedToUserId,
    })
    const freshAssign = await fetchGrievanceAssignments(id)
    setAssignments(freshAssign)
  }

  const handlePrint = () => {
    window.print()
  }

  const goBack = () => navigate(-1)

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center gap-3 text-slate-400">
        <Loader2 size={24} className="animate-spin text-blue-600" />
        <span className="text-xs">Loading grievance #{id}...</span>
      </div>
    )
  }

  if (error || !grievance) {
    return (
      <div className="p-10 text-center text-slate-500">
        <div className="font-semibold mb-2 text-slate-900">Grievance Not Found</div>
        <p className="text-xs text-slate-500 mb-4">{error || 'Unable to locate grievance record.'}</p>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-slate-700 border border-slate-300 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={13} /> Go back
        </button>
      </div>
    )
  }

  const codeId = grievance.id || `GRV-${grievance.grievanceId}`
  const currentAssignee = assignments[assignments.length - 1]

  return (
    <div className="animate-in fade-in duration-200 max-w-4xl">
      <div className="flex items-start justify-between gap-3 mb-6">
        <div className="flex items-start gap-3">
          <button
            onClick={goBack}
            className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors mt-0.5 cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="font-mono text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {codeId}
              </span>
              <StatusBadge statusId={grievance.statusId} statusName={grievance.statusName} />
              <PriorityBadge priorityId={grievance.priorityId} priorityName={grievance.priorityName} />
              <span className="text-xs text-slate-600 font-medium bg-slate-50 border border-slate-200 px-2.5 py-0.5 rounded-full">
                {grievance.categoryName || grievance.category || 'General'}
              </span>
            </div>
            <h1 className="text-lg font-bold text-slate-900">{grievance.title}</h1>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
            title="Print Summary"
          >
            <Printer size={16} />
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAssignModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-medium rounded-md shadow-xs transition-colors cursor-pointer"
            >
              <UserCheck size={14} className="text-blue-600" />
              {currentAssignee ? 'Reassign' : 'Assign to Staff'}
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Description
            </h2>
            <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
              {grievance.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Calendar size={13} className="text-slate-400" /> Submitted on{' '}
                {grievance.date || grievance.createdAt || '2026-10-27'}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <User size={13} className="text-slate-400" /> Raised by User #{grievance.raisedBy}
              </span>
              {currentAssignee && (
                <span className="inline-flex items-center gap-1.5 text-blue-700 font-medium">
                  <UserCheck size={13} /> Assigned to #{currentAssignee.assignedTo}
                </span>
              )}
            </div>
          </div>

          {/* Admin Action: Update Status & Add Remarks */}
          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles size={14} className="text-blue-600" /> Update Status & Add Remarks
                </h2>
              </div>

              <form onSubmit={handleStatusUpdate} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 mb-1">
                      New Status
                    </label>
                    <select
                      value={newStatus}
                      onChange={(e) => setNewStatus(e.target.value)}
                      className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600"
                    >
                      <option value="">-- Choose status --</option>
                      {statuses.map((s) => (
                        <option key={s.id || s.statusID || s.statusId} value={s.id || s.statusID || s.statusId}>
                          {s.name || s.statusName}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    Remarks / Action Taken
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide details regarding the update or resolution steps..."
                    value={remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full border border-slate-300 rounded-md px-3 py-1.5 text-xs focus:outline-none focus:border-blue-600"
                  />
                </div>

                {statusSuccess && (
                  <div className="p-2 rounded bg-emerald-50 border border-emerald-200 text-xs text-emerald-700 flex items-center gap-1.5">
                    <Check size={13} /> Status update recorded in grievance history!
                  </div>
                )}

                <div className="flex justify-end pt-1">
                  <button
                    type="submit"
                    disabled={updatingStatus || !newStatus || !remarks.trim()}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-medium transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {updatingStatus ? (
                      <>
                        <Loader2 size={13} className="animate-spin" /> Saving...
                      </>
                    ) : (
                      <>
                        <Send size={13} /> Post Update
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar: Status History Timeline */}
        <div className="space-y-4">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <h2 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <Clock size={13} /> Status History
            </h2>
            <GrievanceTimeline history={history} />
          </div>
        </div>
      </div>

      {/* Assign Modal */}
      <AssignModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        grievanceId={codeId}
        assignees={assignees}
        onAssign={handleAssignConfirm}
      />
    </div>
  )
}
