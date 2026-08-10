import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import { GRIEVANCES, STATUSES, CATEGORIES, PRIORITIES } from '../../data/dummy'

const ST_CSS = {
  1: 'bg-yellow-100 text-yellow-800',
  2: 'bg-blue-100 text-blue-800',
  3: 'bg-green-100 text-green-800',
  4: 'bg-red-100 text-red-800'
}
const PRI_CSS = {
  1: 'bg-green-50 text-green-700',
  2: 'bg-yellow-50 text-yellow-700',
  3: 'bg-orange-50 text-orange-700',
  4: 'bg-red-50 text-red-700'
}
const DOT_CLR = { 1: '#eab308', 2: '#2563eb', 3: '#16a34a', 4: '#dc2626' }

// Mock admin assignees (from api/user filtered to role Admin)
const ASSIGNEES = [
  { id: 1, name: 'ABC'  },
  { id: 2, name: 'ABC' },
  { id: 3, name: 'ABC'  },
]

export default function GrievanceDetail({ user }) {
  const { id }   = useParams()
  const navigate = useNavigate()
  const isAdmin  = user?.role === 'Admin'

  const g = GRIEVANCES.find(x => x.id === id)

  // Admin: status update state
  const [newStatus,  setNewStatus]  = useState('')
  const [remarks,    setRemarks]    = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [history,    setHistory]    = useState(g ? g.history : [])
  const [saved,      setSaved]      = useState(false)

  const goBack = () => navigate(-1)

  if (!g) {
    return (
      <div className="p-10 text-center text-slate-500">
        <div className="font-semibold mb-3 text-slate-900">Grievance not found</div>
        <button
          onClick={goBack}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-transparent text-slate-700 border border-slate-300 text-xs font-medium rounded-md hover:bg-slate-50 transition-colors"
        >
          <ArrowLeft size={13} /> Go back
        </button>
      </div>
    )
  }

  const st  = STATUSES.find(s => s.id === g.statusId)
  const cat = CATEGORIES.find(c => c.id === g.categoryId)
  const pri = PRIORITIES.find(p => p.id === g.priorityId)

  // Admin: submit status update → POST api/grievancehistory
  const handleStatusUpdate = (e) => {
    e.preventDefault()
    if (!newStatus || !remarks.trim()) return
    const entry = {
      statusId: +newStatus,
      remarks:  remarks.trim(),
      on:       new Date().toISOString().slice(0, 16).replace('T', ' '),
    }
    setHistory(prev => [...prev, entry])
    setRemarks('')
    setNewStatus('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Admin: assign grievance → POST api/grievanceassignment
  const handleAssign = (e) => {
    e.preventDefault()
    if (!assignedTo) return
    setAssignedTo('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const handleStatusChange   = (e) => setNewStatus(e.target.value)
  const handleRemarksChange  = (e) => setRemarks(e.target.value)
  const handleAssigneeChange = (e) => setAssignedTo(e.target.value)

  return (
    <div className="animate-in fade-in duration-200 max-w-4xl">
      <div className="flex items-start gap-3 mb-6">
        <button
          onClick={goBack}
          className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors mt-0.5"
        >
          <ArrowLeft size={16} />
        </button>
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">{g.id}</span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11.5px] font-medium ${ST_CSS[g.statusId]}`}>
              {st?.name}
            </span>
            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${PRI_CSS[g.priorityId]}`}>
              {pri?.name}
            </span>
          </div>
          <div className="text-lg font-bold text-slate-900">{g.title}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Left — Description + History */}
        <div className="md:col-span-2 flex flex-col gap-5 min-w-0">
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-3">Description</div>
            <div className="text-[13.5px] text-slate-700 leading-relaxed whitespace-pre-wrap">{g.description}</div>
          </div>

          {/* Status History — from api/grievancehistory */}
          <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
            <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-5">Status History</div>
            <div className="flex flex-col gap-0">
              {history.map((h, i) => {
                const hst    = STATUSES.find(s => s.id === h.statusId)
                const isLast = i === history.length - 1
                return (
                  <div key={i} className="relative pl-7 pb-5">
                    {!isLast && <div className="absolute left-[7px] top-4 bottom-0 w-px bg-slate-200" />}
                    <div
                      className="absolute left-0 top-1 w-3.5 h-3.5 rounded-full border-2 bg-white"
                      style={{ borderColor: DOT_CLR[h.statusId] }}
                    />
                    <div className="bg-slate-50 rounded-lg p-3 ml-1 border border-slate-100">
                      <div className="flex items-center gap-2 mb-1.5">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10.5px] font-medium ${ST_CSS[h.statusId]}`}>
                          {hst?.name}
                        </span>
                        <span className="text-[11px] text-slate-400 font-medium">{h.on}</span>
                      </div>
                      <div className="text-[12.5px] text-slate-600">{h.remarks}</div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Admin only: Update Status form → POST api/grievancehistory */}
          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-4">
                Update Status
                <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold normal-case tracking-normal">Admin</span>
              </div>
              <form onSubmit={handleStatusUpdate} className="flex flex-col gap-3">
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">New Status</label>
                  <select
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                    value={newStatus}
                    onChange={handleStatusChange}
                    required
                  >
                    <option value="">Select status…</option>
                    {STATUSES.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Remarks</label>
                  <textarea
                    className="w-full border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors resize-none"
                    rows={2}
                    placeholder="Add a remark for this status change…"
                    value={remarks}
                    onChange={handleRemarksChange}
                    required
                  />
                </div>
                <button
                  type="submit"
                  className={`inline-flex items-center gap-1.5 px-4 py-2 text-white text-[13px] font-medium rounded-md transition-colors ${
                    saved ? 'bg-green-600 hover:bg-green-700' : 'bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <Check size={13} /> {saved ? 'Saved!' : 'Update Status'}
                </button>
              </form>
            </div>
          )}

          {/* Admin only: Assign grievance → POST api/grievanceassignment */}
          {isAdmin && (
            <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-sm">
              <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-4">
                Assign To
                <span className="ml-2 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[9px] font-bold normal-case tracking-normal">Admin</span>
              </div>
              <form onSubmit={handleAssign} className="flex gap-3">
                <select
                  className="flex-1 border border-slate-300 rounded-md px-3 py-2 text-[13px] text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-colors"
                  value={assignedTo}
                  onChange={handleAssigneeChange}
                  required
                >
                  <option value="">Select assignee…</option>
                  {ASSIGNEES.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-[13px] font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Assign
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right — Details sidebar */}
        <div>
          <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-sm sticky top-20">
            <div className="font-bold text-[11px] text-slate-500 uppercase tracking-wider mb-4">Details</div>
            <div className="flex flex-col gap-4">
              {[
                { label: 'Category', value: cat?.name },
                { label: 'Priority', value: <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${PRI_CSS[g.priorityId]}`}>{pri?.name}</span> },
                { label: 'Status',   value: <span className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium ${ST_CSS[g.statusId]}`}>{st?.name}</span> },
                { label: 'Date',     value: g.date },
                { label: 'Raised By', value: user?.role === 'Student' ? user.name : 'Kartik (Student)' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">{label}</div>
                  <div className="text-[13px] text-slate-800 font-medium">{value}</div>
                </div>
              ))}
            </div>

            {/* Student read-only notice */}
            {!isAdmin && (
              <div className="mt-5 pt-4 border-t border-slate-100">
                <div className="text-[11.5px] text-slate-400 bg-slate-50 rounded-md px-3 py-2 border border-slate-200">
                  View only. Contact admin to update status.
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
