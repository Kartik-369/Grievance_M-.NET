import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Loader2, Clock, Check, Send } from 'lucide-react'
import { fetchGrievanceById, fetchGrievanceHistory, addGrievanceHistory, fetchStatuses } from './grievanceApi'
import { StatusBadge, PriorityBadge } from './GrievanceStatusBadge'
import GrievanceTimeline from './GrievanceTimeline'

export default function GrievanceDetail({ user }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const isAdmin = user?.role === 'Admin'
  const [loading, setLoading] = useState(true)
  const [grievance, setGrievance] = useState(null)
  const [history, setHistory] = useState([])
  const [statuses, setStatuses] = useState([])
  const [newStatus, setNewStatus] = useState('')
  const [remarks, setRemarks] = useState('')

  useEffect(() => {
    Promise.all([fetchGrievanceById(id), fetchGrievanceHistory(id), fetchStatuses()]).then(([g, h, s]) => {
      setGrievance(g)
      setHistory(h.length ? h : g?.history || [])
      setStatuses(s)
    }).finally(() => setLoading(false))
  }, [id])

  if (loading) return <div className="p-10 text-center"><Loader2 size={24} className="animate-spin" /></div>
  if (!grievance) return <div>Not found</div>

  return (
    <div className="max-w-4xl">
      <button onClick={() => navigate(-1)} className="mb-4"><ArrowLeft size={16} /></button>
      <h1 className="text-xl font-bold">{grievance.title}</h1>
      <p className="mt-2 text-sm text-slate-700">{grievance.description}</p>
      {isAdmin && (
        <form className="mt-6 p-4 border rounded bg-white">
          <h3 className="font-bold text-xs uppercase mb-2">Update Status & Remarks</h3>
          <textarea className="w-full border p-2 text-xs" value={remarks} onChange={e => setRemarks(e.target.value)} />
        </form>
      )}
      <div className="mt-6"><GrievanceTimeline history={history} /></div>
    </div>
  )
}
